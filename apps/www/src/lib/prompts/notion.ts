import { Client } from '@notionhq/client'
import { mockPrompts } from './mock'
import { isPromptType, type PromptItem, type PromptMedia } from './types'

/**
 * Server-only Notion data access.
 *
 * Env vars (see .env.example):
 * - NOTION_TOKEN        Notion internal integration secret
 * - NOTION_DATABASE_ID  The prompts database id
 *
 * When missing, falls back to built-in mock data so the app runs out of the box.
 */

const NOTION_TOKEN = process.env.NOTION_TOKEN
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID

let client: Client | null = null
let dataSourceId: string | null = null

function getClient(): Client | null {
  if (!NOTION_TOKEN || !NOTION_DATABASE_ID) return null
  if (!client) client = new Client({ auth: NOTION_TOKEN })
  return client
}

/** Notion API 2025-09 splits databases into data sources; resolve and cache the first one. */
async function getDataSourceId(notion: Client): Promise<string> {
  if (dataSourceId) return dataSourceId
  const db = (await notion.databases.retrieve({ database_id: NOTION_DATABASE_ID! })) as {
    data_sources?: { id: string }[]
    id: string
  }
  dataSourceId = db.data_sources?.[0]?.id ?? db.id
  return dataSourceId
}

/* ---------- property helpers (defensive against schema drift) ---------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = Record<string, any>

function richTextToPlain(rt: unknown): string {
  if (!Array.isArray(rt)) return ''
  return rt.map((t) => t?.plain_text ?? '').join('')
}

function getTitle(props: Props): string {
  for (const key of Object.keys(props)) {
    if (props[key]?.type === 'title') return richTextToPlain(props[key].title)
  }
  return ''
}

function getText(props: Props, ...names: string[]): string {
  for (const name of names) {
    const p = props[name]
    if (!p) continue
    if (p.type === 'rich_text') return richTextToPlain(p.rich_text)
    if (p.type === 'title') return richTextToPlain(p.title)
    if (p.type === 'url') return p.url ?? ''
    if (p.type === 'select') return p.select?.name ?? ''
  }
  return ''
}

function getSelect(props: Props, ...names: string[]): string {
  for (const name of names) {
    const p = props[name]
    if (p?.type === 'select') return p.select?.name ?? ''
  }
  return ''
}

function getMultiSelect(props: Props, ...names: string[]): string[] {
  for (const name of names) {
    const p = props[name]
    if (p?.type === 'multi_select') return p.multi_select.map((t: { name: string }) => t.name)
  }
  return []
}

function getFiles(props: Props, ...names: string[]): PromptMedia[] {
  for (const name of names) {
    const p = props[name]
    if (p?.type !== 'files') continue
    return p.files
      .map((f: { name?: string; type: string; file?: { url: string }; external?: { url: string } }) => ({
        url: f.type === 'external' ? f.external?.url : f.file?.url,
        name: f.name,
      }))
      .filter((m: PromptMedia) => Boolean(m.url))
  }
  return []
}

function getUrl(props: Props, ...names: string[]): string | undefined {
  for (const name of names) {
    const p = props[name]
    if (p?.type === 'url' && p.url) return p.url
  }
  return undefined
}

function getCheckbox(props: Props, ...names: string[]): boolean | undefined {
  for (const name of names) {
    const p = props[name]
    if (p?.type === 'checkbox') return p.checkbox
  }
  return undefined
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pageToPrompt(page: any): PromptItem | null {
  const props: Props = page.properties ?? {}
  const title = getTitle(props)
  const prompt = getText(props, 'Prompt', 'prompt', '提示词')
  if (!title || !prompt) return null

  const rawType = getSelect(props, 'Type', 'type', '类型').toLowerCase()
  const published = getCheckbox(props, 'Published', 'published', '发布')
  if (published === false) return null

  return {
    id: page.id,
    title,
    type: isPromptType(rawType) ? rawType : 'text',
    prompt,
    description: getText(props, 'Description', 'description', '描述') || undefined,
    tags: getMultiSelect(props, 'Tags', 'tags', '标签'),
    model: getSelect(props, 'Model', 'model', '模型') || undefined,
    media: getFiles(props, 'Media', 'media', '媒体', '示例'),
    link: getUrl(props, 'Link', 'link', 'URL', '链接'),
    createdAt: page.created_time ?? new Date().toISOString(),
  }
}

/* ---------- public api ---------- */

export async function fetchPrompts(): Promise<{ items: PromptItem[]; source: 'notion' | 'mock' }> {
  const notion = getClient()
  if (!notion) return { items: mockPrompts, source: 'mock' }

  try {
    const dsId = await getDataSourceId(notion)
    const items: PromptItem[] = []
    let cursor: string | undefined

    do {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await (notion as any).dataSources.query({
        data_source_id: dsId,
        start_cursor: cursor,
        page_size: 100,
        sorts: [{ timestamp: 'created_time', direction: 'descending' }],
      })
      for (const page of res.results) {
        const item = pageToPrompt(page)
        if (item) items.push(item)
      }
      cursor = res.has_more ? res.next_cursor : undefined
    } while (cursor)

    return { items, source: 'notion' }
  } catch (err) {
    console.error('[notion] fetch failed, falling back to mock data:', err)
    return { items: mockPrompts, source: 'mock' }
  }
}

export async function fetchPromptById(id: string): Promise<PromptItem | null> {
  const notion = getClient()
  if (!notion) return mockPrompts.find((p) => p.id === id) ?? null

  try {
    const page = await notion.pages.retrieve({ page_id: id })
    return pageToPrompt(page)
  } catch (err) {
    console.error('[notion] page fetch failed:', err)
    return mockPrompts.find((p) => p.id === id) ?? null
  }
}
