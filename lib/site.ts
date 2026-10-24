import type { Metadata } from 'next'
import site from '@/site.config'

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || site.url).replace(/\/+$/, '')

export function absolute(path: string): string {
  return `${siteUrl}${path === '/' ? '' : path}`
}

/** The metadata every page shares. Next replaces nested objects rather than merging them, so pages build theirs here. */
export function pageMetadata({ path, title, description, canonical, openGraph }: {
  path: string
  title?: string
  description?: string | null
  canonical?: string | null
  openGraph?: Metadata['openGraph']
}): Metadata {
  const url = canonical ?? absolute(path)
  return {
    ...(title ? { title } : {}),
    description: description ?? undefined,
    alternates: {
      canonical: url,
      types: { 'application/rss+xml': [{ url: absolute('/rss.xml'), title: site.name }] },
    },
    openGraph: { siteName: site.name, type: 'website', url, ...openGraph },
  }
}
