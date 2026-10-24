import { pageMetadata } from '@/lib/site'
import site from '@/site.config'
import styles from './page.module.css'

export const metadata = pageMetadata({ path: '/about', title: 'About', description: `About ${site.author}.` })

export default function About() {
  const { x, github, email } = site.links

  return (
    <div className={`container ${styles.about}`}>
      <div className={styles.main}>
        <h1 className={`page-title ${styles.title}`}>About</h1>
        <div className="prose">
          <p className={styles.lead}>Hi, I&apos;m {site.author}.</p>
          <p>This page lives in <code>app/(site)/about/page.tsx</code>. Replace this text with your own.</p>
        </div>
      </div>

      {(x || github || email) && (
        <aside aria-label="Elsewhere" className={styles.elsewhere}>
          <p className={styles.label}>Elsewhere</p>
          <ul>
            {x && <li><a href={`https://x.com/${x}`}>x.com/{x}</a></li>}
            {github && <li><a href={`https://github.com/${github}`}>github.com/{github}</a></li>}
            {email && <li><a href={`mailto:${email}`}>{email}</a></li>}
            <li><a href="/rss.xml">RSS feed</a></li>
          </ul>
        </aside>
      )}
    </div>
  )
}
