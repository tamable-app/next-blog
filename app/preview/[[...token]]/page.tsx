import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import PostArticle from '@/components/PostArticle'
import { PREVIEW_TOKEN_HEADER } from '@/lib/redirects'
import { preview } from '@/lib/tamable'

// Drafts are read on each request and never cached.
export const dynamic = 'force-dynamic'

const noindex: Metadata['robots'] = { index: false, follow: false }

// proxy.ts passes the raw path on: a token can hold a "/" or end in one, which route params would lose.
const draft = cache(async () => preview((await headers()).get(PREVIEW_TOKEN_HEADER) ?? ''))

export async function generateMetadata(): Promise<Metadata> {
  const post = await draft()
  return { title: post ? `Preview: ${post.title}` : 'Preview expired', robots: noindex }
}

export default async function PreviewPage() {
  const post = await draft()
  if (!post) notFound()
  return <PostArticle post={post} preview />
}
