import { rssXml } from '@tamable/blog-kit'
import { siteUrl } from '@/lib/site'
import { content } from '@/lib/tamable'
import site from '@/site.config'

export const dynamic = 'force-static'

export async function GET() {
  const xml = rssXml(await content().allPosts(), { siteUrl, title: site.name, description: site.description, language: site.locale })
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
