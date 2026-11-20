import Link from 'next/link'
import { BLOG_PATH, tagPath } from '@tamable/blog-kit'
import type { TagCount } from '@/lib/tags'
import styles from './TagFilter.module.css'

export default function TagFilter({ tags, total, current }: { tags: TagCount[], total: number, current?: string }) {
  return (
    <nav aria-label="Tags" className={styles.filter}>
      <Link href={BLOG_PATH} className={`${styles.chip} ${current ? '' : styles.on}`} aria-current={current ? undefined : 'page'}>
        All · {total}
      </Link>
      {tags.map(tag => (
        <Link
          key={tag.slug}
          href={tagPath(tag.slug)}
          className={`${styles.chip} ${current === tag.slug ? styles.on : ''}`}
          aria-current={current === tag.slug ? 'page' : undefined}
        >
          {tag.name} · {tag.count}
        </Link>
      ))}
    </nav>
  )
}
