import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ArrowUpRight, ChevronLeft, ChevronRight, ImageOff, Images, Music2, Play } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { cn } from '@workspace/ui/lib/utils'
import type { PromptItem, PromptMedia } from '@/lib/prompts/types'
import { ImageLightbox } from './image-lightbox'

gsap.registerPlugin(useGSAP)

function mediaKind(media: PromptMedia, type: PromptItem['type']) {
  if (/\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(media.url)) return 'video'
  if (/\.(mp3|wav|ogg|m4a|flac)(\?|#|$)/i.test(media.url)) return 'audio'
  if (/\.(png|jpe?g|webp|gif|avif|svg)(\?|#|$)/i.test(media.url)) return 'image'
  return type === 'video' || type === 'audio' ? type : 'image'
}

export function PromptGallery({ item }: { item: PromptItem }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const swiped = useRef(false)
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const stage = useRef<HTMLDivElement>(null)
  const thumbnails = useRef<HTMLDivElement>(null)
  const direction = useRef(1)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const count = item.media.length
  const index = Math.min(activeIndex, Math.max(0, count - 1))
  const media = item.media[index]
  const kind = media ? mediaKind(media, item.type) : null
  const imageEntries = item.media
    .map((entry, entryIndex) => ({ entry, entryIndex }))
    .filter(({ entry }) => mediaKind(entry, item.type) === 'image')

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-gallery-media]',
          { autoAlpha: 0, x: direction.current * 16, scale: 0.985 },
          { autoAlpha: 1, x: 0, scale: 1, duration: 0.32, ease: 'power2.out', clearProps: 'all' },
        )
      })
      const selected = thumbnails.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')
      if (selected && thumbnails.current) {
        // Scroll only the filmstrip; changing images must not move the page.
        const strip = thumbnails.current
        const offset = selected.offsetLeft
        if (offset < strip.scrollLeft) strip.scrollLeft = offset
        else if (offset + selected.offsetWidth > strip.scrollLeft + strip.clientWidth) {
          strip.scrollLeft = offset + selected.offsetWidth - strip.clientWidth
        }
      }
      return () => mm.revert()
    },
    { scope: stage, dependencies: [index, media?.url], revertOnUpdate: true },
  )

  const select = (next: number) => {
    if (count < 2) return
    direction.current = next > index ? 1 : -1
    setActiveIndex((next + count) % count)
  }

  return (
    <section aria-label="生成结果预览" className="min-w-0">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-medium">
          <Images className="size-4 text-muted-foreground" />
          生成结果
        </h2>
        <span className="text-xs tabular-nums text-muted-foreground">{count ? `${count} 个预览` : '暂无预览'}</span>
      </div>
      <div className="overflow-hidden rounded-2xl border bg-muted/35">
        <div
          ref={stage}
          role="region"
          aria-label="当前预览，使用左右方向键切换"
          tabIndex={count > 1 ? 0 : undefined}
          className="relative flex h-[min(55svh,28rem)] min-h-64 items-center justify-center overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:h-[min(62svh,38rem)]"
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault()
              select(index + (event.key === 'ArrowRight' ? 1 : -1))
            }
          }}
        >
          {media ? (
            <div
              key={`${index}-${media.url}`}
              data-gallery-media
              className="flex h-full w-full items-center justify-center p-3 sm:p-6"
            >
              {failedUrl === media.url ? (
                <div role="status" className="text-center text-sm text-muted-foreground">
                  <ImageOff className="mx-auto mb-3 size-8" />
                  预览加载失败，可尝试打开原文件
                </div>
              ) : kind === 'video' ? (
                <video
                  src={media.url}
                  aria-label={media.name || item.title}
                  controls
                  playsInline
                  preload="metadata"
                  className="max-h-full w-full rounded-lg"
                  onError={() => setFailedUrl(media.url)}
                />
              ) : kind === 'audio' ? (
                <div className="flex w-full max-w-sm flex-col items-center gap-6">
                  <Music2 className="size-14 text-muted-foreground/60" />
                  <p className="text-sm text-muted-foreground">{media.name || '音频预览'}</p>
                  <audio
                    src={media.url}
                    controls
                    preload="none"
                    className="w-full"
                    onError={() => setFailedUrl(media.url)}
                  />
                </div>
              ) : (
                <button
                  type="button"
                  data-image-expand
                  aria-label="放大查看当前图片"
                  className="relative h-full w-full cursor-zoom-in rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => {
                    if (!swiped.current) setExpanded(true)
                    swiped.current = false
                  }}
                >
                  <img
                    src={media.url}
                    alt={media.name || `${item.title} · 生成图 ${index + 1}`}
                    className="h-full w-full rounded-lg object-contain"
                    style={{ touchAction: 'pan-y pinch-zoom' }}
                    draggable={false}
                    onError={() => setFailedUrl(media.url)}
                    onTouchStart={(event) => {
                      swiped.current = false
                      const touch = event.touches[0]
                      touchStart.current =
                        event.touches.length === 1 && touch ? { x: touch.clientX, y: touch.clientY } : null
                    }}
                    onTouchEnd={(event) => {
                      const start = touchStart.current
                      const touch = event.changedTouches[0]
                      touchStart.current = null
                      if (!start || !touch) return
                      const dx = touch.clientX - start.x
                      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(touch.clientY - start.y) * 1.5) {
                        swiped.current = true
                        select(index + (dx < 0 ? 1 : -1))
                      }
                    }}
                    onTouchCancel={() => {
                      touchStart.current = null
                    }}
                  />
                </button>
              )}
            </div>
          ) : (
            <div className="max-w-xs px-6 text-center">
              <ImageOff className="mx-auto mb-4 size-9 text-muted-foreground/50" />
              <p className="text-sm font-medium">还没有生成结果</p>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">复制 Prompt 到对应模型，开始你的创作。</p>
            </div>
          )}
        </div>
        {media && (
          <div className="flex min-h-14 items-center gap-2 border-t bg-card px-3 sm:px-4">
            <p aria-live="polite" aria-atomic="true" className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
              <span className="mr-2 font-mono tabular-nums text-foreground">
                {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
              </span>
              {media.name || '生成结果'}
            </p>
            <a
              href={media.url}
              target="_blank"
              rel="noreferrer"
              aria-label="打开当前预览原文件"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              data-motion-button
            >
              <ArrowUpRight className="size-4" />
            </a>
            {count > 1 && (
              <div className="flex gap-1 border-l pl-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9"
                  aria-label="上一个预览"
                  data-motion-button
                  onClick={() => select(index - 1)}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9"
                  aria-label="下一个预览"
                  data-motion-button
                  onClick={() => select(index + 1)}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      {count > 1 && (
        <div
          ref={thumbnails}
          role="group"
          aria-label="选择预览"
          className="relative mt-3 flex gap-2 overflow-x-auto p-1 pb-3"
        >
          {item.media.map((entry, entryIndex) => {
            const entryKind = mediaKind(entry, item.type)
            return (
              <button
                key={`${entryIndex}-${entry.url}`}
                type="button"
                aria-label={`查看第 ${entryIndex + 1} 个预览`}
                aria-pressed={entryIndex === index}
                onClick={() => select(entryIndex)}
                data-motion-button
                className={cn(
                  'relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 bg-muted outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:size-20',
                  entryIndex === index
                    ? 'border-primary ring-2 ring-primary/15'
                    : 'border-transparent hover:border-muted-foreground/40',
                )}
              >
                {entryKind === 'image' ? (
                  <img src={entry.url} alt="" loading="lazy" className="size-full object-cover" />
                ) : entryKind === 'video' ? (
                  <Play className="size-6 text-muted-foreground" />
                ) : (
                  <Music2 className="size-6 text-muted-foreground" />
                )}
                <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1 text-[10px] tabular-nums text-white">
                  {entryIndex + 1}
                </span>
              </button>
            )
          })}
        </div>
      )}
      {expanded && kind === 'image' && (
        <ImageLightbox
          images={imageEntries.map(({ entry }) => entry)}
          activeIndex={imageEntries.findIndex(({ entryIndex }) => entryIndex === index)}
          onSelect={(next) => select(imageEntries[next]!.entryIndex)}
          onClose={() => setExpanded(false)}
        />
      )}
    </section>
  )
}
