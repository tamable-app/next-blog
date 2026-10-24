import type { PostSummary, Tag } from '@tamable/blog-kit'

export interface TagCount extends Tag {
  count: number
}

export function tagCounts(posts: PostSummary[]): TagCount[] {
  const counts = new Map<string, TagCount>()
  for (const post of posts) {
    for (const tag of post.tags) {
      const entry = counts.get(tag.slug) ?? { ...tag, count: 0 }
      entry.count++
      counts.set(tag.slug, entry)
    }
  }
  return [...counts.values()].sort((a, b) => a.slug.localeCompare(b.slug))
}
