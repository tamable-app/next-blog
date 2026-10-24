import { sitemapEntries, sitemapXml } from '@tamable/blog-kit'
import { siteUrl } from '@/lib/site'
import { content } from '@/lib/tamable'

export const dynamic = 'force-static'

// The site's own pages; posts, tags and series come from Tamable.
const PAGES = ['/', '/blog', '/series', '/about']

export async function GET() {
  const [posts, series] = await Promise.all([content().allPosts(), content().seriesSummaries()])
  return new Response(sitemapXml(sitemapEntries(PAGES, posts, series), siteUrl), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
