import { createFileRoute } from '@tanstack/react-router'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PromptWall } from '@/components/prompts/prompt-wall'
import { getPrompts } from '@/server/prompts'
import { siteConfig } from '@/config/site'

export const Route = createFileRoute('/')({
  loader: () => getPrompts(),
  head: () => ({
    links: [{ rel: 'canonical', href: siteConfig.url }],
  }),
  component: HomePage,
})

function HomePage() {
  const { items, source } = Route.useLoaderData()

  return (
    <div data-wrapper="" className="border-grid flex min-h-svh flex-1 flex-col">
      <SiteHeader />
      <main className="container-wrapper flex flex-1 flex-col">
        <section className="relative isolate">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklch,var(--color-primary)_10%,transparent),transparent_45%)]" />
          <div className="container py-12 text-center md:py-16">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Prompt Hub
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              收集、检索、复用你的 Prompt
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              文本、图片、视频、网页……所有类型的 prompt 一站管理，一键复制，一键分享。
            </p>
            {source === 'mock' && (
              <p className="mt-3 text-xs text-muted-foreground/70">
                当前展示示例数据 · 配置 <code className="font-mono">NOTION_TOKEN</code> 后自动切换为你的
                Notion 数据库
              </p>
            )}
          </div>
        </section>

        <section className="container pb-16">
          <PromptWall items={items} />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
