import { AudioLines, Bot, Clapperboard, Code2, Globe, Image as ImageIcon, LetterText } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { PromptType } from '@/lib/prompts/types'
import { PROMPT_TYPE_LABELS } from '@/lib/prompts/types'

export const TYPE_ICONS: Record<PromptType, LucideIcon> = {
  text: LetterText,
  image: ImageIcon,
  video: Clapperboard,
  audio: AudioLines,
  webpage: Globe,
  code: Code2,
  agent: Bot,
}

export function TypeBadgeContent({ type }: { type: PromptType }) {
  const Icon = TYPE_ICONS[type]
  return (
    <>
      <Icon className="size-3" />
      {PROMPT_TYPE_LABELS[type]}
    </>
  )
}
