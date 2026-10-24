import { revalidatePath, revalidateTag } from 'next/cache'
import { callDeployHook, checkWebhook, MAX_BODY_BYTES, reply, SIGNATURE_HEADER, type WebhookReply } from '@tamable/blog-kit/webhook'
import { currentRedirects, TAMABLE_TAG } from '@/lib/tamable'

// Tamable's deploy webhook: set Settings › Sites › Deploy webhook to https://<your site>/api/deploy.
export async function POST(request: Request) {
  const rawBody = await readLimited(request)
  if (!rawBody) return answer(reply(413, 'Too large.'))

  const check = checkWebhook({
    rawBody,
    signature: request.headers.get(SIGNATURE_HEADER),
    secret: process.env.TAMABLE_WEBHOOK_SECRET ?? '',
  })
  if (check.kind === 'reply') return answer(check.reply)

  // Revalidating while Tamable is unreachable would only rebuild pages from stale data; Tamable retries a 502.
  const redirects = await currentRedirects()
  if (!redirects) return answer(reply(502, 'Tamable did not answer. Nothing revalidated.'))

  // Each page keeps serving what it has until its next visit rebuilds it from Tamable in the background.
  revalidateTag(TAMABLE_TAG, 'max')
  // A page turning into a redirect is rebuilt on its next request instead: Next drops the Location header
  // of a redirect it rebuilds in the background.
  for (const from of Object.keys(redirects)) revalidatePath(from)

  if (process.env.DEPLOY_HOOK_URL) return answer(await callDeployHook(process.env.DEPLOY_HOOK_URL))
  return answer(reply(200, 'Content revalidated.'))
}

function answer({ status, body }: WebhookReply) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
}

/** The body as sent, or null once it passes the limit, so a huge request is never held in memory. */
async function readLimited(request: Request): Promise<Uint8Array | null> {
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) return null
  if (!request.body) return new Uint8Array()

  const chunks: Uint8Array[] = []
  let size = 0
  const reader = request.body.getReader()
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.length
    if (size > MAX_BODY_BYTES) {
      await reader.cancel()
      return null
    }
    chunks.push(value)
  }

  const body = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    body.set(chunk, offset)
    offset += chunk.length
  }
  return body
}
