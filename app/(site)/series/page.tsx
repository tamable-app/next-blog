import SeriesCard from '@/components/SeriesCard'
import { pageMetadata } from '@/lib/site'
import { content } from '@/lib/tamable'
import listing from '../listing.module.css'
import styles from '../page.module.css'

export const metadata = pageMetadata({ path: '/series', title: 'Series', description: 'Posts that belong together, in order.' })

export default async function SeriesIndex() {
  const series = await content().seriesSummaries()

  return (
    <div className={`container ${listing.listing}`}>
      <h1 className={`page-title ${listing.titleTight}`}>Series</h1>
      <p className={listing.intro}>Posts that belong together, in order.</p>
      {series.length
        ? <div className={styles.cards}>{series.map(item => <SeriesCard key={item.slug} series={item} />)}</div>
        : <p className={listing.empty}>No series yet.</p>}
    </div>
  )
}
