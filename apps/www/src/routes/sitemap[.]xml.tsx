import { createFileRoute } from '@tanstack/react-router'
import { fetchPrompts } from '@/lib/prompts/notion'
import { siteConfig } from '@/config/site'

function xmlEscape(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const { items } = await fetchPrompts()
        const urls = [
          `<url><loc>${xmlEscape(siteConfig.url)}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
          ...items.map(
            (item) =>
              `<url><loc>${xmlEscape(`${siteConfig.url}/p/${item.id}`)}</loc><lastmod>${item.createdAt.slice(0, 10)}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
          ),
        ]
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`
        return new Response(xml, {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        })
      },
    },
  },
})
