import Link from 'next/link'
import PostList from '@/components/PostList'
import SeriesCard from '@/components/SeriesCard'
import { pageMetadata } from '@/lib/site'
import { content } from '@/lib/tamable'
import site from '@/site.config'
import styles from './page.module.css'

export const metadata = pageMetadata({ path: '/', description: site.description })

export default async function Home() {
  const [posts, series] = await Promise.all([content().postSummaries(), content().seriesSummaries()])

  return (
    <div className="container">
      <section className={styles.hero}>
        <h1 className={styles.hello}>{site.name}</h1>
        <p className={styles.intro}>{site.description}</p>
      </section>

      <section aria-labelledby="latest" className={styles.latest}>
        <h2 id="latest" className={styles.sectionTitle}>Latest posts</h2>
        <PostList posts={posts.slice(0, 5)} />
        <Link href="/blog" className={styles.all}>All posts →</Link>
      </section>

      {series.length > 0 && (
        <section aria-labelledby="series" className={styles.series}>
          <h2 id="series" className={styles.sectionTitle}>Series</h2>
          <div className={styles.cards}>
            {series.map(item => <SeriesCard key={item.slug} series={item} />)}
          </div>
        </section>
      )}
    </div>
  )
}
