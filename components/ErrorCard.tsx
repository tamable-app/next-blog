import Link from 'next/link'
import styles from './ErrorCard.module.css'

export default function ErrorCard({ eyebrow, title, text, allPosts = false }: {
  eyebrow: string
  title: string
  text: string
  allPosts?: boolean
}) {
  return (
    <div className={`container ${styles.error}`}>
      <section className={styles.card}>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.text}>{text}</p>
        <p className={styles.links}>
          <Link href="/">Home</Link>
          {allPosts && <Link href="/blog">All posts</Link>}
        </p>
      </section>
    </div>
  )
}
