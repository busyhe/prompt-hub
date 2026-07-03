import { ExternalLink } from 'lucide-react'
import type { PromptItem } from '@/lib/prompts/types'
import { cn } from '@workspace/ui/lib/utils'

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)(\?|$)/i
const AUDIO_EXT = /\.(mp3|wav|ogg|m4a|flac)(\?|$)/i

function isVideoUrl(url: string) {
  return VIDEO_EXT.test(url)
}
function isAudioUrl(url: string) {
  return AUDIO_EXT.test(url)
}

/**
 * Renders the example-output area of a card, adapting to the prompt type
 * and the actual media file. Returns null when there is nothing to show.
 */
export function MediaPreview({
  item,
  interactive = false,
  className,
}: {
  item: PromptItem
  /** true on detail page: video controls enabled */
  interactive?: boolean
  className?: string
}) {
  const media = item.media[0]

  if (media && (item.type === 'video' || isVideoUrl(media.url))) {
    return (
      <div className={cn('relative overflow-hidden bg-muted', className)}>
        <video
          src={media.url}
          className="aspect-video w-full object-cover"
          muted={!interactive}
          loop
          playsInline
          controls={interactive}
          preload="metadata"
          onMouseEnter={interactive ? undefined : (e) => void e.currentTarget.play().catch(() => {})}
          onMouseLeave={interactive ? undefined : (e) => e.currentTarget.pause()}
        />
        {!interactive && (
          <span className="absolute bottom-2 right-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
            悬停播放
          </span>
        )}
      </div>
    )
  }

  if (media && (item.type === 'audio' || isAudioUrl(media.url))) {
    return (
      <div className={cn('bg-muted/50 px-4 py-3', className)}>
        <audio src={media.url} controls className="h-9 w-full" preload="none" />
      </div>
    )
  }

  if (media) {
    return (
      <div className={cn('relative overflow-hidden bg-muted', className)}>
        <img
          src={media.url}
          alt={media.name || item.title}
          loading="lazy"
          className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        {item.type === 'webpage' && item.link && (
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
            <ExternalLink className="size-2.5" />
            {new URL(item.link).hostname}
          </span>
        )}
      </div>
    )
  }

  return null
}
