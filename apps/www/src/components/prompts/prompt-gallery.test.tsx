import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { PromptGallery } from './prompt-gallery'
import type { PromptItem } from '@/lib/prompts/types'

const item: PromptItem = {
  id: 'gallery',
  title: '测试作品',
  type: 'image',
  prompt: 'A city',
  tags: [],
  createdAt: '2026-09-15T00:00:00.000Z',
  media: [
    { url: '/one.png', name: '第一张' },
    { url: '/two.png', name: '第二张' },
    { url: '/three.png', name: '第三张' },
  ],
}

beforeEach(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  )
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('PromptGallery', () => {
  it('selects every image through thumbnails and wraps at both ends', () => {
    render(<PromptGallery item={item} />)
    expect(screen.getAllByRole('button', { name: /查看第/ })).toHaveLength(3)
    fireEvent.click(screen.getByRole('button', { name: '查看第 3 个预览' }))
    expect(screen.getByRole('img', { name: '第三张' }).getAttribute('src')).toBe('/three.png')
    expect(screen.getByRole('link', { name: '打开当前预览原文件' }).getAttribute('href')).toBe('/three.png')
    fireEvent.click(screen.getByRole('button', { name: '下一个预览' }))
    expect(screen.getByRole('button', { name: '查看第 1 个预览' }).getAttribute('aria-pressed')).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: '上一个预览' }))
    expect(screen.getByRole('img', { name: '第三张' })).toBeTruthy()
  })

  it('supports keyboard and horizontal swipes without treating vertical scrolling as a switch', () => {
    render(<PromptGallery item={item} />)
    fireEvent.keyDown(screen.getByRole('region', { name: '当前预览，使用左右方向键切换' }), { key: 'ArrowRight' })
    let image = screen.getByRole('img', { name: '第二张' })
    fireEvent.touchStart(image, { touches: [{ clientX: 200, clientY: 100 }] })
    fireEvent.touchEnd(image, { changedTouches: [{ clientX: 190, clientY: 250 }] })
    expect(screen.getByRole('img', { name: '第二张' })).toBeTruthy()
    image = screen.getByRole('img', { name: '第二张' })
    fireEvent.touchStart(image, { touches: [{ clientX: 200, clientY: 100 }] })
    fireEvent.touchEnd(image, { changedTouches: [{ clientX: 90, clientY: 110 }] })
    expect(screen.getByRole('img', { name: '第三张' })).toBeTruthy()
  })

  it('handles missing and single media without offering unusable navigation', () => {
    const { rerender } = render(<PromptGallery item={{ ...item, media: [] }} />)
    expect(screen.getByText('还没有生成结果')).toBeTruthy()
    expect(screen.queryByRole('button', { name: '下一个预览' })).toBeNull()
    rerender(<PromptGallery item={{ ...item, media: [item.media[0]!] }} />)
    expect(screen.getByRole('img', { name: '第一张' })).toBeTruthy()
    expect(screen.queryByRole('group', { name: '选择预览' })).toBeNull()
  })

  it('keeps other images usable after an image fails to load', () => {
    render(<PromptGallery item={item} />)
    fireEvent.error(screen.getByRole('img', { name: '第一张' }))
    expect(screen.getByRole('status').textContent).toContain('预览加载失败')
    fireEvent.click(screen.getByRole('button', { name: '下一个预览' }))
    expect(screen.getByRole('img', { name: '第二张' })).toBeTruthy()
  })

  it('switches between video, image and audio while preserving native media controls', () => {
    const { container } = render(
      <PromptGallery
        item={{
          ...item,
          type: 'video',
          media: [
            { url: '/clip.mp4', name: '视频' },
            { url: '/poster.png', name: '海报' },
            { url: '/track.mp3', name: '音乐' },
          ],
        }}
      />,
    )
    const video = container.querySelector('video')!
    expect(video.controls).toBe(true)
    fireEvent.keyDown(video, { key: 'ArrowRight' })
    expect(container.querySelector('video')).toBe(video)
    fireEvent.click(screen.getByRole('button', { name: '下一个预览' }))
    expect(container.querySelector('video')).toBeNull()
    expect(screen.getByRole('img', { name: '海报' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: '下一个预览' }))
    expect(container.querySelector('audio')?.controls).toBe(true)
  })
})
