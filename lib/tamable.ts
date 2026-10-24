import 'server-only'
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { permanentRedirect } from 'next/navigation'
import {
  buildRedirects,
  createContentSource,
  createTamableClient,
  redirectPaths,
  toPostSummary,
  type PostPage,
  type TamableClient,
} from '@tamable/blog-kit'
import site from '@/site.config'
import { redirectTarget } from './redirects'
import { siteUrl } from './site'

/** Every read from Tamable is cached under this tag; the deploy webhook revalidates it. */
export const TAMABLE_TAG = 'tamable'

const apiUrl = process.env.TAMABLE_API_URL || 'https://api.tamable.app/api/v1'

const client = createTamableClient({ apiUrl, readKey: process.env.TAMABLE_READ_KEY ?? '' })

// A missed webhook still heals within a day.
const DAY = 60 * 60 * 24

function cached<Args extends unknown[], Result>(name: string, read: (...args: Args) => Promise<Result>) {
  return unstable_cache(read, [TAMABLE_TAG, name, apiUrl], { tags: [TAMABLE_TAG], revalidate: DAY })
}

/** The read API behind Next's data cache, so a revalidated tag really reads Tamable again. */
const cachedClient: TamableClient = {
  ...client,
  allPosts: cached('allPosts', client.allPosts),
  getPost: cached('getPost', client.getPost),
  redirects: cached('redirects', client.redirects),
  allSeries: cached('allSeries', client.allSeries),
  getSeries: cached('getSeries', client.getSeries),
}

/**
 * The kit's content source, one per request. Its own memo lasts only that request,
 * while the cached client underneath is what persists until the next revalidation.
 */
export const content = cache(() => createContentSource(cachedClient))

/** Every permanent redirect, from the same cached data as the pages. */
export const redirectMap = cached('redirectMap', async () => buildRedirects({
  posts: (await cachedClient.allPosts()).map(toPostSummary),
  renamed: redirectPaths(await cachedClient.redirects(), siteUrl),
  ghost: site.ghostRedirects,
}))

/** Sends an address that matches no page to its new home, if it has one. Pages call it before a 404. */
export async function redirectIfMoved(path: string): Promise<void> {
  const target = redirectTarget(path, await redirectMap(), site.ghostRedirects)
  if (target) permanentRedirect(target)
}

/** The redirect map as Tamable has it right now, read past the cache. Null when Tamable doesn't answer. */
export async function currentRedirects(): Promise<Record<string, string> | null> {
  try {
    const [posts, renamed] = await Promise.all([client.allPosts(), client.redirects()])
    return buildRedirects({ posts: posts.map(toPostSummary), renamed: redirectPaths(renamed, siteUrl), ghost: site.ghostRedirects })
  }
  catch {
    return null
  }
}

/** A draft through a preview link, read fresh every time. Null once the link expired. */
export async function preview(token: string): Promise<PostPage | null> {
  return token ? createContentSource(client).previewPage(token) : null
}
