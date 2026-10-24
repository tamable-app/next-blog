import { notFound } from 'next/navigation'
import { redirectIfMoved } from '@/lib/tamable'

// Every address no other page matches: a redirect from the cached map (renamed posts, old Ghost addresses) or a 404.
export const dynamic = 'force-dynamic'

export default async function Fallback({ params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  await redirectIfMoved(`/${path.map(encodeURIComponent).join('/')}`)
  notFound()
}
