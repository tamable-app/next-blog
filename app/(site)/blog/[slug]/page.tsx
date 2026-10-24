import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PostArticle from '@/components/PostArticle'
import { pageMetadata, siteUrl } from '@/lib/site'
import { content, redirectIfMoved } from '@/lib/tamable'
import site from '@/site.config'

type Props = { params: Promise<{ slug: string }> }

// Posts published after the build render on their first visit, then stay cached until the next revalidation.
export const dynamicParams = true

export async function generateStaticParams() {
  const posts = await content().postSummaries()
  if (!posts.length && process.env.ALLOW_EMPTY_BLOG !== 'true') {
    throw new Error('Tamable has no published posts for this site, so the build stopped rather than publish an empty blog. Set ALLOW_EMPTY_BLOG=true to build one on purpose.')
  }
  return posts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await content().postPage(slug)
  if (!post) return {}

  const tags = post.tags.map(tag => tag.name)
  return {
    ...pageMetadata({
      path: post.path,
      title: post.seo.title,
      description: post.seo.description,
      canonical: post.seo.canonicalUrl,
      openGraph: {
        type: 'article',
        title: post.seo.title,
        description: post.seo.description ?? undefined,
        publishedTime: post.publishedAt ?? undefined,
        modifiedTime: post.updatedAt ?? undefined,
        tags,
        images: post.cover
          ? [{ url: post.cover.url, alt: post.cover.alt, width: post.cover.width ?? undefined, height: post.cover.height ?? undefined }]
          : undefined,
      },
    }),
    twitter: { card: post.cover ? 'summary_large_image' : 'summary' },
  }
}

export default async function PostRoute({ params }: Props) {
  const { slug } = await params
  const post = await content().postPage(slug)
  if (!post) {
    await redirectIfMoved(`/blog/${slug}`)
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.seo.description,
    'datePublished': post.publishedAt,
    'dateModified': post.updatedAt,
    'url': post.seo.canonicalUrl ?? `${siteUrl}${post.path}`,
    'image': post.cover?.url,
    'keywords': post.tags.map(tag => tag.name).join(', ') || undefined,
    'author': { '@type': 'Person', 'name': site.author, 'url': siteUrl },
  }

  return (
    <>
      {/* `<` escaped so text from a post can never close the script tag. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <PostArticle post={post} />
    </>
  )
}
