export const PROMPT_TYPES = [
  'text',
  'image',
  'video',
  'audio',
  'webpage',
  'code',
  'agent',
] as const

export type PromptType = (typeof PROMPT_TYPES)[number]

export const PROMPT_TYPE_LABELS: Record<PromptType, string> = {
  text: '文本',
  image: '图片',
  video: '视频',
  audio: '音频',
  webpage: '网页',
  code: '代码',
  agent: 'Agent',
}

export interface PromptMedia {
  url: string
  name?: string
}

export interface PromptItem {
  id: string
  title: string
  type: PromptType
  prompt: string
  description?: string
  tags: string[]
  model?: string
  /** Example output media (image / video / audio / webpage screenshot) */
  media: PromptMedia[]
  /** External link (webpage type demo url, source, etc.) */
  link?: string
  createdAt: string
}

export function isPromptType(value: string): value is PromptType {
  return (PROMPT_TYPES as readonly string[]).includes(value)
}
