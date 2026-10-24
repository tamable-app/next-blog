import Link from 'next/link'
import { hasXPost, isoDay, type PostPage } from '@tamable/blog-kit'
import SeriesNav from './SeriesNav'
import XEmbeds from './XEmbeds'
import styles from './PostArticle.module.css'

export default function PostArticle({ post, preview = false }: { post: PostPage, preview?: boolean }) {
  return (
    <article className={`${styles.post} container-reading`}>
      <p className={styles.meta}>
        {post.publishedAt
          ? <time dateTime={post.publishedAt}>{isoDay(post.publishedAt)}</time>
          : preview && <span>Not published yet</span>}
        <span> · {post.readingMinutes} min</span>
        {post.tags.map(tag => (
          <span key={tag.slug}>
            <span> · </span><Link href={`/tags/${tag.slug}`}>{tag.name}</Link>
          </span>
        ))}
      </p>
      <h1 className={styles.title}>{post.title}</h1>
      {post.excerpt && <p className={styles.lead}>{post.excerpt}</p>}
      {post.cover && (
        <figure className={styles.cover}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover.url} alt={post.cover.alt} width={post.cover.width ?? undefined} height={post.cover.height ?? undefined} fetchPriority="high" />
        </figure>
      )}
      {/* Tamable's HTML goes through its own schema and is served as published. */}
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
      {hasXPost(post.html) && <XEmbeds />}
      {post.seriesNav && <SeriesNav nav={post.seriesNav} />}
    </article>
  )
}
