import site from '@/site.config'
import styles from './SiteFooter.module.css'

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <span>© {new Date().getFullYear()} {site.author}</span>
        <span className={styles.links}>
          <a href="/rss.xml">RSS</a>
          {site.links.x && <a href={`https://x.com/${site.links.x}`}>X</a>}
          {site.links.github && <a href={`https://github.com/${site.links.github}`}>GitHub</a>}
          {site.links.email && <a href={`mailto:${site.links.email}`}>Email</a>}
        </span>
      </div>
    </footer>
  )
}
