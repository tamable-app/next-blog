import { siteUrl } from '@/lib/site'

export const dynamic = 'force-static'

// Built from the site address, so the sitemap line is right on any domain.
export function GET() {
  return new Response(`User-agent: *\nDisallow: /preview/\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
