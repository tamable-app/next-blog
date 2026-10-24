import { NextResponse, type NextRequest } from 'next/server'
import { withoutTrailingSlash } from '@tamable/blog-kit'
import { PREVIEW_TOKEN_HEADER, previewToken } from '@/lib/redirects'
import { siteUrl } from '@/lib/site'

const siteHost = new URL(siteUrl).host

export function proxy(request: NextRequest) {
  const { pathname, search, searchParams } = request.nextUrl

  if (pathname === '/preview' || pathname.startsWith('/preview/')) {
    const headers = new Headers(request.headers)
    headers.set(PREVIEW_TOKEN_HEADER, previewToken(pathname, searchParams))
    return NextResponse.next({ request: { headers } })
  }

  // One address per page: /blog/ answers with a 301 to /blog.
  const trimmed = withoutTrailingSlash(pathname)
  if (trimmed) return NextResponse.redirect(new URL(trimmed + search, request.url), 301)

  // Only the real address is indexed: a preview deployment or any other host serving this build stays out of search.
  const response = NextResponse.next()
  if (request.headers.get('host') !== siteHost) response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return response
}

export const config = {
  matcher: '/((?!_next/|api/|favicon.ico).*)',
}
