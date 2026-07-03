import { Link } from '@tanstack/react-router'
import { Badge } from '@workspace/ui/components/badge'
import type { PromptItem } from '@/lib/prompts/types'
import { MediaPreview } from './media-preview'
import { CopyPromptButton, ShareButton } from './copy-button'
import { TypeBadgeContent } from './type-meta'

export function PromptCard({ item }: { item: PromptItem }) {
  return (
    <div className="group relative flex break-inside-avoid flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <Link
        to="/p/$id"
        params={{ id: item.id }}
        aria-label={item.title}
        className="absolute inset-0 z-0 rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      />

      <MediaPreview item={item} className="pointer-events-none z-0" />

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <TypeBadgeContent type={item.type} />
          </Badge>
          {item.model && (
            <span className="truncate text-xs text-muted-foreground">{item.model}</span>
          )}
        </div>

        <h3 className="text-sm font-semibold leading-snug">{item.title}</h3>

        {item.description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
        )}

        <pre className="line-clamp-4 whitespace-pre-wrap rounded-md bg-muted/60 p-2.5 font-mono text-[11px] leading-relaxed text-muted-foreground">
          {item.prompt}
        </pre>

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.map((tag) => (
              <span key={tag} className="rounded-sm bg-accent px-1.5 py-0.5 text-[10px] text-accent-foreground/80">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="relative z-10 mt-auto flex items-center gap-1 pt-1">
          <CopyPromptButton text={item.prompt} className="h-7 px-2.5 text-xs" />
          <ShareButton id={item.id} title={item.title} className="h-7 px-2.5 text-xs" />
        </div>
      </div>
    </div>
  )
}
