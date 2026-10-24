import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isoDay } from '@tamable/blog-kit'
import { pageMetadata } from '@/lib/site'
import { content } from '@/lib/tamable'
import listing from '../../listing.module.css'
import styles from './page.module.css'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = true

export async function generateStaticParams() {
  return (await content().seriesSummaries()).map(series => ({ slug: series.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const series = await content().seriesDetail(slug)
  if (!series) return {}
  return pageMetadata({
    path: `/series/${slug}`,
    title: series.title,
    description: series.description ?? `${series.posts.length} posts in order.`,
  })
}

export default async function SeriesPage({ params }: Props) {
  const { slug } = await params
  const series = await content().seriesDetail(slug)
  if (!series) notFound()

  const dates = series.posts.map(post => post.publishedAt).filter((date): date is string => Boolean(date)).sort()
  const parts = series.posts.length

  return (
    <div className={`container ${listing.listing}`}>
      <p className="eyebrow"><Link href="/series" className={styles.crumb}>Series</Link></p>
      <h1 className={`page-title ${listing.titleTight}`}>{series.title}</h1>
      {series.description && <p className={styles.description}>{series.description}</p>}
      <p className={styles.facts}>
        {parts} {parts === 1 ? 'part' : 'parts'}
        {dates.length > 0 && <> · started {isoDay(dates[0]!)}</>}
        {dates.length > 1 && <> · latest {isoDay(dates[dates.length - 1]!)}</>}
      </p>

      <ol className={styles.parts}>
        {series.posts.map(post => (
          <li key={post.slug} className={styles.part}>
            <span className={styles.dot} aria-hidden="true" />
            <p className={styles.when}>
              Part {post.series?.number}
              {post.publishedAt && <> · {isoDay(post.publishedAt)}</>}
              {post.readingMinutes && <> · {post.readingMinutes} min</>}
            </p>
            <h2 className={styles.title}><Link href={post.path}>{post.title}</Link></h2>
            {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
          </li>
        ))}
      </ol>
    </div>
  )
}
