import ErrorCard from '@/components/ErrorCard'

export const metadata = { title: 'Preview expired', robots: { index: false } }

export default function PreviewExpired() {
  return (
    <ErrorCard
      eyebrow="Preview"
      title="This preview link has expired"
      text="Preview links last 24 hours. Open Preview in Tamable again for a fresh one."
    />
  )
}
