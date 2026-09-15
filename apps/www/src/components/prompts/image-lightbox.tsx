import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { PromptMedia } from '@/lib/prompts/types'

gsap.registerPlugin(useGSAP)

export function ImageLightbox({
  images,
  activeIndex,
  onSelect,
  onClose,
}: {
  images: PromptMedia[]
  activeIndex: number
  onSelect: (index: number) => void
  onClose: () => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const media = images[activeIndex]!

  useEffect(() => {
    const element = dialog.current!
    const overflow = document.body.style.overflow
    const focused = document.activeElement
    element.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      element.close()
      document.body.style.overflow = overflow
      // Switching images replaces the original trigger; restore focus to its replacement.
      const target =
        focused instanceof HTMLElement && focused.isConnected
          ? focused
          : document.querySelector<HTMLButtonElement>('[data-image-expand]')
      target?.focus({ preventScroll: true })
    }
  }, [])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-lightbox-image]',
          { autoAlpha: 0, scale: 0.97 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.25,
            ease: 'power2.out',
            clearProps: 'all',
          },
        )
      })
      return () => mm.revert()
    },
    { scope: dialog, dependencies: [activeIndex], revertOnUpdate: true },
  )

  const select = (offset: number) => onSelect((activeIndex + offset + images.length) % images.length)
  const controlClass =
    'inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

  return (
    <dialog
      ref={dialog}
      aria-label="图片放大预览"
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden border-0 bg-black/95 p-0 text-white backdrop:bg-black/80"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault()
          event.stopPropagation()
          select(event.key === 'ArrowRight' ? 1 : -1)
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="flex h-full flex-col px-3 py-4 sm:px-6">
        <div className="flex shrink-0 items-center justify-between gap-4">
          <p aria-live="polite" aria-atomic="true" className="min-w-0 truncate text-sm text-white/75">
            <span className="mr-3 font-mono tabular-nums text-white">
              {activeIndex + 1} / {images.length}
            </span>
            {media.name || '生成图'}
          </p>
          <button type="button" autoFocus aria-label="关闭放大预览" className={controlClass} onClick={onClose}>
            <X className="size-5" />
          </button>
        </div>
        <div
          className="relative flex min-h-0 flex-1 items-center justify-center py-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose()
          }}
        >
          <img
            key={media.url}
            data-lightbox-image
            src={media.url}
            alt={media.name || `生成图 ${activeIndex + 1}`}
            draggable={false}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div className="flex shrink-0 items-center justify-center gap-5">
          {images.length > 1 && (
            <button type="button" aria-label="放大预览上一张" className={controlClass} onClick={() => select(-1)}>
              <ChevronLeft className="size-5" />
            </button>
          )}
          <p className="text-xs text-white/60">{images.length > 1 ? '← → 切换 · ' : ''}Esc 关闭</p>
          {images.length > 1 && (
            <button type="button" aria-label="放大预览下一张" className={controlClass} onClick={() => select(1)}>
              <ChevronRight className="size-5" />
            </button>
          )}
        </div>
      </div>
    </dialog>
  )
}
