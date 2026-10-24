import { createHmac } from 'node:crypto'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const revalidateTag = vi.fn()
const revalidatePath = vi.fn()
const currentRedirects = vi.fn(async (): Promise<Record<string, string> | null> => ({ '/blog/old-name': '/blog/hello-world' }))

vi.mock('next/cache', () => ({ revalidatePath, revalidateTag }))
vi.mock('@/lib/tamable', () => ({ TAMABLE_TAG: 'tamable', currentRedirects }))

const { POST } = await import('../app/api/deploy/route')

const secret = 'signing-secret'

function body(event: string, sentAt = new Date().toISOString()) {
  return JSON.stringify({ event, site_id: 'site', sent_at: sentAt })
}

function sign(raw: string, key = secret) {
  return `sha256=${createHmac('sha256', key).update(raw).digest('hex')}`
}

function post(raw: string, signature?: string) {
  return POST(new Request('http://localhost/api/deploy', {
    method: 'POST',
    body: raw,
    headers: signature ? { 'x-tamable-signature': signature } : {},
  }))
}

beforeEach(() => {
  vi.stubEnv('TAMABLE_WEBHOOK_SECRET', secret)
  vi.stubEnv('DEPLOY_HOOK_URL', '')
  revalidateTag.mockClear()
  revalidatePath.mockClear()
  currentRedirects.mockClear()
  currentRedirects.mockResolvedValue({ '/blog/old-name': '/blog/hello-world' })
})

describe('the deploy webhook', () => {
  it('revalidates Tamable content on a signed content.changed', async () => {
    const raw = body('content.changed')
    const response = await post(raw, sign(raw))

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ ok: true, message: 'Content revalidated.' })
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(revalidateTag).toHaveBeenCalledWith('tamable', 'max')
    expect(revalidatePath).toHaveBeenCalledWith('/blog/old-name')
  })

  it('refuses an unsigned or wrongly signed call and revalidates nothing', async () => {
    const raw = body('content.changed')

    expect((await post(raw)).status).toBe(401)
    expect((await post(raw, sign(raw, 'other'))).status).toBe(401)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('refuses a replayed call', async () => {
    const raw = body('content.changed', '2020-01-01T00:00:00Z')

    expect((await post(raw, sign(raw))).status).toBe(401)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('answers the test event without revalidating', async () => {
    const raw = body('test')

    expect((await post(raw, sign(raw))).status).toBe(200)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('keeps the cache when Tamable does not answer, so Tamable retries', async () => {
    currentRedirects.mockResolvedValue(null)
    const raw = body('content.changed')

    expect((await post(raw, sign(raw))).status).toBe(502)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('refuses a body over the limit before reading it all', async () => {
    const raw = 'a'.repeat(20_000)

    expect((await post(raw, sign(raw))).status).toBe(413)
  })

  it('says so when the secret is not set', async () => {
    vi.stubEnv('TAMABLE_WEBHOOK_SECRET', '')
    const raw = body('content.changed')

    expect((await post(raw, sign(raw))).status).toBe(503)
  })

  it('also calls the deploy hook when one is set', async () => {
    const fetch = vi.fn(async () => new Response('ok'))
    vi.stubGlobal('fetch', fetch)
    vi.stubEnv('DEPLOY_HOOK_URL', 'https://api.netlify.com/build_hooks/abc')
    const raw = body('content.changed')

    const response = await post(raw, sign(raw))

    expect(response.status).toBe(202)
    expect(revalidateTag).toHaveBeenCalled()
    expect(fetch).toHaveBeenCalledOnce()
    vi.unstubAllGlobals()
  })
})
