import PostList from '@/components/PostList'
import TagFilter from '@/components/TagFilter'
import { pageMetadata } from '@/lib/site'
import { tagCounts } from '@/lib/tags'
import { content } from '@/lib/tamable'
import styles from '../listing.module.css'

export const metadata = pageMetadata({ path: '/blog', title: 'Blog', description: 'Everything I have written, newest first.' })

export default async function Blog() {
  const posts = await content().postSummaries()

  return (
    <div className={`container ${styles.listing}`}>
      <h1 className={`page-title ${styles.title}`}>Blog</h1>
      <TagFilter tags={tagCounts(posts)} total={posts.length} />
      <PostList posts={posts} byYear showTags />
    </div>
  )
}
