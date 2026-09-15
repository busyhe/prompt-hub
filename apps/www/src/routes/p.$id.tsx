import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PromptDetail } from '@/components/prompts/prompt-detail'
import { getPrompt } from '@/server/prompts'
import { siteConfig } from '@/config/site'

export const Route = createFileRoute('/p/$id')({
  loader: async ({ params }) => {
    const item = await getPrompt({ data: params.id })
    if (!item) throw notFound()
    return item
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] }
    const title = `${loaderData.title} · ${siteConfig.name}`
    const description = loaderData.description ?? loaderData.prompt.slice(0, 120)
    const url = `${siteConfig.url}/p/${loaderData.id}`
    const mediaUrl = loaderData.media[0]?.url
    const image =
      mediaUrl && (loaderData.type === 'image' || loaderData.type === 'webpage') ? mediaUrl : siteConfig.ogImage
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: url },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
      ],
      links: [{ rel: 'canonical', href: url }],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: loaderData.title,
            description,
            url,
            genre: loaderData.type,
            keywords: loaderData.tags.join(','),
            dateCreated: loaderData.createdAt,
            inLanguage: 'zh-CN',
          }),
        },
      ],
    }
  },
  component: PromptDetailPage,
})

function PromptDetailPage() {
  const item = Route.useLoaderData()

  return (
    <div data-wrapper="" className="border-grid flex min-h-svh flex-1 flex-col">
      <SiteHeader />
      <main className="container-wrapper flex flex-1 flex-col">
        <div className="container w-full max-w-7xl py-6 md:py-8 lg:pb-16">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            返回全部 Prompt
          </Link>

          <PromptDetail key={item.id} item={item} />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
