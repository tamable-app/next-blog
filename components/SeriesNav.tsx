import Link from 'next/link'
import type { SeriesNav as Nav } from '@tamable/blog-kit'
import styles from './SeriesNav.module.css'

export default function SeriesNav({ nav }: { nav: Nav }) {
  return (
    <nav aria-label="Series" className={styles.nav}>
      <p className={styles.where}>
        <Link href={`/series/${nav.slug}`}>{nav.title}</Link> · part {nav.number} · {nav.total} published
      </p>
      {(nav.previous || nav.next) && (
        <p className={styles.links}>
          {nav.previous ? <Link href={nav.previous.path} rel="prev">← {nav.previous.title}</Link> : <span />}
          {nav.next && <Link href={nav.next.path} rel="next" className={styles.next}>{nav.next.title} →</Link>}
        </p>
      )}
    </nav>
  )
}
