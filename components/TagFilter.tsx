import Link from 'next/link'
import type { TagCount } from '@/lib/tags'
import styles from './TagFilter.module.css'

export default function TagFilter({ tags, total, current }: { tags: TagCount[], total: number, current?: string }) {
  return (
    <nav aria-label="Tags" className={styles.filter}>
      <Link href="/blog" className={`${styles.chip} ${current ? '' : styles.on}`} aria-current={current ? undefined : 'page'}>
        All · {total}
      </Link>
      {tags.map(tag => (
        <Link
          key={tag.slug}
          href={`/tags/${tag.slug}`}
          className={`${styles.chip} ${current === tag.slug ? styles.on : ''}`}
          aria-current={current === tag.slug ? 'page' : undefined}
        >
          {tag.name} · {tag.count}
        </Link>
      ))}
    </nav>
  )
}
