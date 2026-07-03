import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@workspace/ui/components/input'
import { Button } from '@workspace/ui/components/button'
import { cn } from '@workspace/ui/lib/utils'
import type { PromptItem, PromptType } from '@/lib/prompts/types'
import { PROMPT_TYPE_LABELS, PROMPT_TYPES } from '@/lib/prompts/types'
import { PromptCard } from './prompt-card'
import { TYPE_ICONS } from './type-meta'

function matches(item: PromptItem, q: string): boolean {
  const hay = [
    item.title,
    item.prompt,
    item.description ?? '',
    item.model ?? '',
    item.type,
    PROMPT_TYPE_LABELS[item.type],
    ...item.tags,
  ]
    .join('\n')
    .toLowerCase()
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => hay.includes(word))
}

export function PromptWall({ items }: { items: PromptItem[] }) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<PromptType | 'all'>('all')

  const availableTypes = useMemo(
    () => PROMPT_TYPES.filter((t) => items.some((i) => i.type === t)),
    [items],
  )

  const filtered = useMemo(() => {
    let list = items
    if (type !== 'all') list = list.filter((i) => i.type === type)
    if (query.trim()) list = list.filter((i) => matches(i, query))
    return list
  }, [items, type, query])

  return (
    <div className="flex flex-col gap-6">
      {/* search */}
      <div className="relative mx-auto w-full max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索名称、类型、标签、prompt 内容…"
          className="h-11 rounded-full pl-9 pr-9 shadow-sm"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1.5 top-1/2 size-8 -translate-y-1/2 rounded-full"
            onClick={() => setQuery('')}
          >
            <X className="size-4" />
            <span className="sr-only">清空</span>
          </Button>
        )}
      </div>

      {/* type filter chips */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <FilterChip active={type === 'all'} onClick={() => setType('all')}>
          全部
          <span className="ml-1 text-[10px] opacity-60">{items.length}</span>
        </FilterChip>
        {availableTypes.map((t) => {
          const Icon = TYPE_ICONS[t]
          return (
            <FilterChip key={t} active={type === t} onClick={() => setType(type === t ? 'all' : t)}>
              <Icon className="size-3.5" />
              {PROMPT_TYPE_LABELS[t]}
              <span className="ml-0.5 text-[10px] opacity-60">
                {items.filter((i) => i.type === t).length}
              </span>
            </FilterChip>
          )
        })}
      </div>

      {/* grid */}
      {filtered.length > 0 ? (
        <div className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {filtered.map((item) => (
            <PromptCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-24 text-center text-muted-foreground">
          <Search className="size-8 opacity-40" />
          <p className="text-sm">没有找到匹配的 prompt</p>
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              setQuery('')
              setType('all')
            }}
          >
            清除筛选条件
          </Button>
        </div>
      )}
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors',
        active
          ? 'border-foreground bg-foreground text-background'
          : 'border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground',
      )}
    >
      {children}
    </button>
  )
}
