// Who the blog belongs to. The address, read key and secrets are environment variables (see .env.example).
const site = {
  name: 'My blog',
  description: 'Notes and stories, published from Tamable.',
  author: 'Your name',
  locale: 'en',
  // Fallback for NEXT_PUBLIC_SITE_URL: the canonical address, with no trailing slash.
  url: 'https://example.com',
  // Leave any of these empty to hide it.
  links: {
    x: '',
    github: '',
    email: '',
  },
  // Turn on when moving from Ghost: its /{slug}/, /tag/, /author/ and /rss/ addresses get 301s.
  ghostRedirects: false,
}

export default site
