import ErrorCard from '@/components/ErrorCard'
import Shell from '@/components/Shell'

export const metadata = { title: 'Not found', robots: { index: false } }

export default function NotFound() {
  return (
    <Shell>
      <ErrorCard eyebrow="Error 404" title="This page doesn't exist" text="It may have moved, or the link has a typo." allPosts />
    </Shell>
  )
}
