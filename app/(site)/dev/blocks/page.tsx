import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prepareHtml } from '@tamable/blog-kit'
import fixture from '@tamable/blog-kit/fixtures/posts/hello-world.json'

// Every block Tamable can serve, for checking the post styles. Development only.
export const metadata: Metadata = { title: 'Blocks', robots: { index: false } }

const html = `<p>Inline: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike</s>, <mark>highlight</mark>, <code>inline code</code>.</p><ul><li><p>One</p></li><li><p>Two</p></li></ul><ol start="3"><li><p>Three</p></li></ol><hr>${prepareHtml(fixture.data.html)}`

export default function Blocks() {
  if (process.env.NODE_ENV === 'production') notFound()

  return (
    <article className="container-reading" style={{ paddingBlock: 64 }}>
      <h1 className="page-title">Blocks</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  )
}
