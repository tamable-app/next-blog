import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // proxy.ts answers trailing slashes with a 301 instead of Next's 308.
  skipTrailingSlashRedirect: true,
  async headers() {
    return [{
      source: '/preview/:path*',
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    }]
  },
}

export default nextConfig
