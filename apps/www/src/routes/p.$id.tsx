import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { MediaPreview } from '@/components/prompts/media-preview'
import { CopyPromptButton, ShareButton } from '@/components/prompts/copy-button'
import { TypeBadgeContent } from '@/components/prompts/type-meta'
import { getPrompt } from '@/server/prompts'

export const Route = createFileRoute('/p/$id')({
  loader: async ({ params }) => {
    const item = await getPrompt({ data: params.id })
    if (!item) throw notFound()
    return item
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} · Prompt Hub` },
          { name: 'description', content: loaderData.description ?? loaderData.prompt.slice(0, 120) },
        ]
      : [],
  }),
  component: PromptDetailPage,
})

function PromptDetailPage() {
  const item = Route.useLoaderData()

  return (
    <div data-wrapper="" className="border-grid flex min-h-svh flex-1 flex-col">
      <SiteHeader />
      <main className="container-wrapper flex flex-1 flex-col">
        <div className="container max-w-3xl py-8 md:py-12">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            返回全部 Prompt
          </Link>

          <article className="mt-6 overflow-hidden rounded-2xl border bg-card shadow-xs">
            <MediaPreview item={item} interactive />

            <div className="flex flex-col gap-4 p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  <TypeBadgeContent type={item.type} />
                </Badge>
                {item.model && <Badge variant="outline">{item.model}</Badge>}
                <span className="ml-auto text-xs text-muted-foreground">
                  {new Date(item.createdAt).toLocaleDateString('zh-CN')}
                </span>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{item.title}</h1>

              {item.description && (
                <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              )}

              <div className="relative">
                <pre className="max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-xl border bg-muted/50 p-4 pr-14 font-mono text-[13px] leading-relaxed">
                  {item.prompt}
                </pre>
                <CopyPromptButton
                  text={item.prompt}
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-2 size-8 bg-background/70 backdrop-blur"
                  label=""
                />
              </div>

              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-accent px-2 py-0.5 text-xs text-accent-foreground/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-2 flex flex-wrap items-center gap-2 border-t pt-4">
                <CopyPromptButton text={item.prompt} variant="default" size="default" />
                <ShareButton id={item.id} title={item.title} size="default" />
                {item.link && (
                  <Button asChild variant="outline" size="default" className="gap-1.5">
                    <a href={item.link} target="_blank" rel="noreferrer">
                      <ExternalLink className="size-3.5" />
                      查看示例
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </article>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
