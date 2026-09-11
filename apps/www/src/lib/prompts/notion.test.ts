import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const api = vi.hoisted(() => ({ query: vi.fn(), retrieve: vi.fn(), page: vi.fn() }))
vi.mock('@notionhq/client', () => ({
  Client: vi.fn(function () {
    return { databases: { retrieve: api.retrieve }, dataSources: { query: api.query }, pages: { retrieve: api.page } }
  }),
}))

beforeEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
  vi.stubEnv('NOTION_TOKEN', 'test-only')
  vi.stubEnv('NOTION_DATABASE_ID', 'test-db')
  api.retrieve.mockResolvedValue({ data_sources: [{ id: 'test-source' }] })
  vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks() })

function page(published: boolean, xhsStatus: string) {
  return { id: 'test-page', properties: {
    Name: { type: 'title', title: [{ plain_text: 'Example' }] },
    Prompt: { type: 'rich_text', rich_text: [{ plain_text: 'Line one\n\nLine two' }] },
    Published: { type: 'checkbox', checkbox: published },
    'XHS Status': { type: 'select', select: { name: xhsStatus } },
  } }
}

describe('Notion availability and publication boundaries', () => {
  it('does not replace a failed Notion request with examples', async () => {
    api.query.mockRejectedValue(new Error('Unavailable'))
    expect(await (await import('./notion')).fetchPrompts()).toEqual({ items: [], source: 'unavailable' })
  })
  it('does not show examples when production configuration is absent', async () => {
    vi.stubEnv('NODE_ENV', 'production'); vi.stubEnv('NOTION_TOKEN', ''); vi.stubEnv('NOTION_DATABASE_ID', '')
    expect((await (await import('./notion')).fetchPrompts()).source).toBe('unavailable')
  })
  it('keeps examples available for an unconfigured development environment', async () => {
    vi.stubEnv('NODE_ENV', 'development'); vi.stubEnv('NOTION_TOKEN', ''); vi.stubEnv('NOTION_DATABASE_ID', '')
    expect((await (await import('./notion')).fetchPrompts()).source).toBe('mock')
  })
  it('website visibility is independent of Xiaohongshu status and preserves prompt newlines', async () => {
    api.query.mockResolvedValue({ results: [page(true, 'Generating'), page(false, 'Published')], has_more: false })
    const result = await (await import('./notion')).fetchPrompts()
    expect(result.items).toHaveLength(1)
    expect(result.items[0]?.prompt).toBe('Line one\n\nLine two')
  })
  it('continues pagination and never returns a partial list after failure', async () => {
    api.query.mockResolvedValueOnce({ results: [page(true, 'Published')], has_more: true, next_cursor: 'next' }).mockRejectedValueOnce(new Error('second page failed'))
    expect(await (await import('./notion')).fetchPrompts()).toEqual({ items: [], source: 'unavailable' })
    expect(api.query).toHaveBeenLastCalledWith(expect.objectContaining({ start_cursor: 'next' }))
  })
})
