import { useRef, type PointerEvent } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ExternalLink, Sparkles } from 'lucide-react'
import { Badge } from '@workspace/ui/components/badge'
import { PromptGallery } from './prompt-gallery'
import { CopyPromptButton, ShareButton } from './copy-button'
import { TypeBadgeContent } from './type-meta'
import type { PromptItem } from '@/lib/prompts/types'

gsap.registerPlugin(useGSAP)

export function PromptDetail({ item }: { item: PromptItem }) {
  const container = useRef<HTMLElement>(null)
  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-detail-enter]', {
          y: 18,
          autoAlpha: 0,
          duration: 0.5,
          stagger: 0.065,
          ease: 'power2.out',
          clearProps: 'all',
        })
      })
      return () => mm.revert()
    },
    { scope: container },
  )

  const animateControl = contextSafe((event: PointerEvent<HTMLElement>, entering: boolean) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const target = (event.target as Element).closest<HTMLElement>('[data-motion-button], button')
    if (!target || !event.currentTarget.contains(target)) return
    if (event.relatedTarget instanceof Node && target.contains(event.relatedTarget)) return
    gsap.to(target, { y: entering ? -2 : 0, duration: 0.18, ease: 'power2.out', overwrite: 'auto' })
  })

  return (
    <article
      ref={container}
      className="mt-7 grid min-w-0 items-start gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-10 xl:gap-14"
      onPointerOver={(event) => animateControl(event, true)}
      onPointerOut={(event) => animateControl(event, false)}
    >
      <div data-detail-enter className="min-w-0 lg:sticky lg:top-24">
        <PromptGallery key={item.id} item={item} />
      </div>
      <div className="flex min-w-0 flex-col gap-6 lg:pt-1">
        <header data-detail-enter>
          <h1 className="break-words text-2xl font-semibold leading-tight tracking-tight sm:text-3xl xl:text-4xl">
            {item.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <TypeBadgeContent type={item.type} />
            </Badge>
            {item.model && (
              <Badge variant="outline" className="max-w-full whitespace-normal break-words">
                {item.model}
              </Badge>
            )}
          </div>
          {item.description && (
            <p className="mt-4 break-words text-sm leading-7 text-muted-foreground">{item.description}</p>
          )}
        </header>
        <section
          data-detail-enter
          aria-labelledby="prompt-heading"
          className="overflow-hidden rounded-2xl border bg-card shadow-xs"
        >
          <div className="flex items-center justify-between gap-3 border-b px-5 py-3.5">
            <h2 id="prompt-heading" className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="size-4 text-primary" />
              Prompt
            </h2>
            <CopyPromptButton text={item.prompt} size="sm" variant="ghost" className="h-8" label="复制" />
          </div>
          <pre
            tabIndex={0}
            aria-label="Prompt 内容"
            className="max-h-[26rem] overflow-auto whitespace-pre-wrap break-words bg-muted/25 p-5 font-mono text-[13px] leading-7 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          >
            {item.prompt}
          </pre>
          <div className="border-t px-5 py-2.5 text-xs text-muted-foreground">复制后可按需调整主体、风格与参数</div>
        </section>
        {item.tags.length > 0 && (
          <div data-detail-enter className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="max-w-full break-words rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground"
              >
                # {tag}
              </span>
            ))}
          </div>
        )}
        <div data-detail-enter className="flex flex-col gap-5 border-t pt-5">
          <div className="flex flex-wrap items-center gap-2">
            <CopyPromptButton
              text={item.prompt}
              variant="default"
              size="default"
              className="h-11 flex-1 sm:flex-none sm:px-6"
            />
            <ShareButton id={item.id} title={item.title} size="default" className="h-11" />
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                data-motion-button
                className="inline-flex h-11 items-center gap-1.5 rounded-md px-3 text-sm font-medium hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
              >
                查看相关链接
                <ExternalLink className="size-3.5" />
              </a>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            收录于{' '}
            <time dateTime={item.createdAt}>
              {new Date(item.createdAt).toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai' })}
            </time>
          </p>
        </div>
      </div>
    </article>
  )
}
