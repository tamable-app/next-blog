import { describe, expect, it } from 'vitest'
import { withoutTrailingSlash } from '@tamable/blog-kit'
import { previewToken, redirectTarget } from '@/lib/redirects'

const map = { '/blog/old-name': '/blog/hello-world', '/hello-world': '/blog/hello-world' }

describe('finding where a missing address went', () => {
  it('sends a renamed post to its new address', () => {
    expect(redirectTarget('/blog/old-name', map)).toBe('/blog/hello-world')
  })

  it('leaves an address with nowhere to go as a 404', () => {
    expect(redirectTarget('/blog/never-existed', map)).toBeNull()
  })

  it('sends Ghost tag and author archives to the nearest page only when asked', () => {
    expect(redirectTarget('/tag/unknown', map)).toBeNull()
    expect(redirectTarget('/tag/unknown', map, true)).toBe('/blog')
    expect(redirectTarget('/author/someone', map, true)).toBe('/about')
  })
})

describe('dropping a trailing slash in the proxy', () => {
  it('never answers with an address on another site', () => {
    for (const path of ['//evil.example/', '///evil.example/', '/\\evil.example/', '//evil.example//x/']) {
      const target = withoutTrailingSlash(path)!
      expect(target.startsWith('//')).toBe(false)
      expect(target.startsWith('/\\')).toBe(false)
    }
  })
})
describe('reading a preview token', () => {
  it('keeps slashes and a trailing slash, and decodes the rest', () => {
    expect(previewToken('/preview/ok/with/slash/', new URLSearchParams())).toBe('ok/with/slash/')
    expect(previewToken('/preview/a%2Fb', new URLSearchParams())).toBe('a/b')
  })

  it('falls back to the token query, and to nothing for a malformed path', () => {
    expect(previewToken('/preview', new URLSearchParams('token=abc'))).toBe('abc')
    expect(previewToken('/preview/%E0%A4%A', new URLSearchParams())).toBe('')
  })
})
