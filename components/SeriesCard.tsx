import Link from 'next/link'
import type { SeriesSummary } from '@tamable/blog-kit'
import styles from './SeriesCard.module.css'

export default function SeriesCard({ series }: { series: SeriesSummary }) {
  return (
    <Link href={`/series/${series.slug}`} className={styles.card}>
      <span className={styles.title}>{series.title}</span>
      {series.description && <span className={styles.description}>{series.description}</span>}
      <span className={styles.count}>{series.postCount} {series.postCount === 1 ? 'part' : 'parts'}</span>
    </Link>
  )
}
