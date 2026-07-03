import { env } from '@/env'

const url = env.VITE_SITE_URL || 'http://localhost:3000'

export const siteConfig = {
  name: 'Prompt Hub',
  url,
  ogImage: `${url}/og.png`,
  description: '收集、检索、复用你的 Prompt —— 文本、图片、视频、网页等各类 prompt 一站管理',
  keywords:
    'Prompt Hub,Prompt 管理,AI 提示词,提示词库,prompt manager,prompt library,Midjourney prompt,Sora prompt,AI prompts',
  links: {
    homepage: 'https://busyhe.com',
    twitter: 'https://twitter.com/busyhe_',
    github: 'https://github.com/busyhe',
  },
}

export type SiteConfig = typeof siteConfig

export const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b',
}
