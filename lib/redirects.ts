/**
 * Where an address that matches no page should go, or null for a 404. Ghost's tag and author
 * archives fall back to the nearest page when Ghost redirects are on.
 */
export function redirectTarget(path: string, map: Record<string, string>, ghost = false): string | null {
  if (map[path]) return map[path]
  if (ghost && (path === '/tag' || path.startsWith('/tag/'))) return '/blog'
  if (ghost && (path === '/author' || path.startsWith('/author/'))) return '/about'
  return null
}

/** The request header proxy.ts uses to hand a preview page its token. */
export const PREVIEW_TOKEN_HEADER = 'x-tamable-preview-token'

/** The token in /preview/{token}, read from the raw path so an encoded or trailing "/" survives. */
export function previewToken(pathname: string, search: URLSearchParams): string {
  const raw = pathname.replace(/^\/preview\/?/, '')
  if (!raw) return search.get('token') ?? ''
  try {
    return decodeURIComponent(raw)
  }
  catch {
    return ''
  }
}
