import Link from 'next/link'
import { isoDay, monthDay, year, type PostSummary } from '@tamable/blog-kit'
import styles from './PostList.module.css'

export default function PostList({ posts, byYear = false, showTags = false }: {
  posts: PostSummary[]
  byYear?: boolean
  showTags?: boolean
}) {
  const groups = new Map<string, PostSummary[]>()
  for (const post of posts) {
    const key = byYear && post.publishedAt ? year(post.publishedAt) : ''
    groups.set(key, [...(groups.get(key) ?? []), post])
  }

  const date = (iso: string) => (byYear ? monthDay(iso) : isoDay(iso))

  return (
    <div className={styles.list}>
      {[...groups].map(([group, items]) => (
        <section key={group} aria-label={group || undefined}>
          {group && <h2 className={styles.year}>{group}</h2>}
          <div className={styles.rows}>
            {items.map(post => (
              <article key={post.slug} className={styles.row}>
                <p className={styles.when}>
                  {post.publishedAt && <time dateTime={post.publishedAt}>{date(post.publishedAt)}</time>}
                  {post.readingMinutes && <><br />{post.readingMinutes} min</>}
                </p>
                <div className={styles.what}>
                  <h3 className={styles.title}>
                    <Link href={post.path}>{post.title}</Link>
                  </h3>
                  {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
                  {showTags && post.tags.length > 0 && (
                    <p className={styles.tags}>
                      {post.tags.map(tag => <Link key={tag.slug} href={`/tags/${tag.slug}`}>{tag.name}</Link>)}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
