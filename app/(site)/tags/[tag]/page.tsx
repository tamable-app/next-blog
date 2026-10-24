import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PostList from '@/components/PostList'
import TagFilter from '@/components/TagFilter'
import { pageMetadata } from '@/lib/site'
import { tagCounts } from '@/lib/tags'
import { content } from '@/lib/tamable'
import styles from '../../listing.module.css'

type Props = { params: Promise<{ tag: string }> }

export const dynamicParams = true

export async function generateStaticParams() {
  return tagCounts(await content().postSummaries()).map(tag => ({ tag: tag.slug }))
}

async function load(slug: string) {
  const posts = await content().postSummaries()
  const tags = tagCounts(posts)
  const tag = tags.find(t => t.slug === slug)
  return tag ? { posts, tags, tag, tagged: posts.filter(post => post.tags.some(t => t.slug === slug)) } : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params
  const data = await load(tag)
  if (!data) return {}
  return pageMetadata({ path: `/tags/${tag}`, title: data.tag.name, description: `Posts tagged ${data.tag.name}.` })
}

export default async function TagPage({ params }: Props) {
  const { tag: slug } = await params
  const data = await load(slug)
  if (!data) notFound()
  const { posts, tags, tag, tagged } = data

  return (
    <div className={`container ${styles.listing}`}>
      <p className="eyebrow">Tag</p>
      <h1 className={`page-title ${styles.titleTight}`}>{tag.name}</h1>
      <p className={styles.count}>{tagged.length} {tagged.length === 1 ? 'post' : 'posts'} tagged {tag.name}.</p>
      <TagFilter tags={tags} total={posts.length} current={slug} />
      <PostList posts={tagged} byYear showTags />
    </div>
  )
}
