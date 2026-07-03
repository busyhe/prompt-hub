import { createFileRoute } from '@tanstack/react-router'
import { siteConfig } from '@/config/site'

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () =>
        new Response(`User-agent: *\nDisallow:\n\nSitemap: ${siteConfig.url}/sitemap.xml\n`, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=86400',
          },
        }),
    },
  },
})
