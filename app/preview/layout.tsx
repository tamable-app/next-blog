import Shell from '@/components/Shell'
import styles from '@/components/Shell.module.css'

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  const banner = (
    <div role="status" className={styles.banner}>
      <div className={`container ${styles.bannerInner}`}>
        <span>Preview: a draft, not published and not indexed</span>
        <span>Edits in Tamable show on reload</span>
      </div>
    </div>
  )
  return <Shell banner={banner}>{children}</Shell>
}
