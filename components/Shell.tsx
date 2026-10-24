import SiteFooter from './SiteFooter'
import SiteHeader from './SiteHeader'
import styles from './Shell.module.css'

export default function Shell({ banner, children }: { banner?: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <a href="#main" className="skip-link">Skip to content</a>
      {banner}
      <SiteHeader />
      <main id="main" className={styles.main}>{children}</main>
      <SiteFooter />
    </div>
  )
}
