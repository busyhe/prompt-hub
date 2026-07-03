import type { PromptItem } from './types'

/**
 * Mock data used when NOTION_TOKEN / NOTION_DATABASE_ID is not configured,
 * so the app runs out of the box. Covers every card type.
 */
export const mockPrompts: PromptItem[] = [
  {
    id: 'mock-structured-summary',
    title: '结构化总结助手',
    type: 'text',
    prompt:
      '你是一名资深编辑。请把我给你的任何长文压缩为：\n1. 一句话核心结论\n2. 3-5 个关键要点（每点不超过 20 字）\n3. 一个可执行的下一步建议\n保持客观，不要添加原文没有的信息。',
    description: '把任意长文压缩成一句话结论 + 要点清单，适合快速阅读会议纪要、报告。',
    tags: ['总结', '写作', '效率'],
    model: 'Claude / GPT 通用',
    media: [],
    createdAt: '2026-06-01T08:00:00.000Z',
  },
  {
    id: 'mock-isometric-city',
    title: '等距像素小城',
    type: 'image',
    prompt:
      'Isometric pixel-art city block at dusk, warm street lights, tiny cars, cozy shops, soft gradient sky, 32-bit palette, high detail, no text --ar 4:3',
    description: '生成温暖色调的等距像素风城市插画，适合做壁纸或封面。',
    tags: ['像素风', '插画', 'Midjourney'],
    model: 'Midjourney v7',
    media: [{ url: 'https://picsum.photos/seed/prompthub-city/960/720', name: '示例输出' }],
    createdAt: '2026-06-03T08:00:00.000Z',
  },
  {
    id: 'mock-product-shot',
    title: '产品摄影棚拍',
    type: 'image',
    prompt:
      'Studio product photography of a matte ceramic coffee mug on a floating stone pedestal, dramatic rim lighting, dark charcoal background, ultra sharp, 85mm lens, commercial grade',
    description: '电商级产品图 prompt 模板，替换主体即可复用。',
    tags: ['产品图', '摄影', '电商'],
    model: 'DALL·E / Flux',
    media: [{ url: 'https://picsum.photos/seed/prompthub-mug/960/720', name: '示例输出' }],
    createdAt: '2026-06-05T08:00:00.000Z',
  },
  {
    id: 'mock-drone-video',
    title: '航拍海岸线运镜',
    type: 'video',
    prompt:
      'Cinematic drone shot flying low over a rugged coastline at golden hour, waves crashing on black rocks, camera slowly rising and tilting up to reveal the sun, 24fps, anamorphic, film grain',
    description: '电影感航拍视频生成 prompt，黄金时刻 + 慢速上升运镜。',
    tags: ['运镜', '航拍', 'Sora'],
    model: 'Sora / Veo',
    media: [
      {
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        name: '示例输出',
      },
    ],
    createdAt: '2026-06-08T08:00:00.000Z',
  },
  {
    id: 'mock-lofi-track',
    title: 'Lo-fi 学习背景乐',
    type: 'audio',
    prompt:
      'lo-fi hip hop, mellow Rhodes piano chords, vinyl crackle, soft rain ambience, 72 bpm, warm tape saturation, no vocals, loopable study beat',
    description: '生成可循环的 Lo-fi 学习音乐，适合 Suno / Udio。',
    tags: ['音乐', 'Lo-fi', 'Suno'],
    model: 'Suno v5',
    media: [],
    createdAt: '2026-06-10T08:00:00.000Z',
  },
  {
    id: 'mock-landing-page',
    title: 'SaaS 落地页生成',
    type: 'webpage',
    prompt:
      '为一个 AI 笔记工具生成单页落地页：深色主题、大标题 + 渐变高亮词、三个功能卡片、定价区（免费/专业版）、FAQ 折叠面板、底部 CTA。使用 Tailwind CSS，移动端优先，动效克制。',
    description: '一句话生成完整落地页结构，适合 v0 / Bolt / Lovable。',
    tags: ['落地页', 'v0', 'Tailwind'],
    model: 'v0.dev',
    media: [{ url: 'https://picsum.photos/seed/prompthub-landing/960/600', name: '页面截图' }],
    link: 'https://v0.dev',
    createdAt: '2026-06-12T08:00:00.000Z',
  },
  {
    id: 'mock-code-review',
    title: '严格代码审查员',
    type: 'code',
    prompt:
      '请以资深工程师身份审查以下代码，输出格式：\n- 🔴 必须修复（bug / 安全问题）\n- 🟡 建议改进（性能 / 可读性）\n- 🟢 做得好的地方\n每条给出行号和修改示例。若无问题，直接说明。\n\n```\n{在此粘贴代码}\n```',
    description: '结构化 code review 输出，红黄绿三级分类，可直接贴进 PR。',
    tags: ['代码审查', '工程', '开发'],
    model: 'Claude Code',
    media: [],
    createdAt: '2026-06-15T08:00:00.000Z',
  },
  {
    id: 'mock-research-agent',
    title: '深度调研 Agent',
    type: 'agent',
    prompt:
      '你是一个调研 Agent。目标：{主题}。流程：\n1. 先列出 5 个关键子问题\n2. 逐个搜索并交叉验证至少 2 个来源\n3. 标注每条结论的置信度（高/中/低）\n4. 最终输出带引用链接的调研报告\n遇到相互矛盾的信息时，明确指出分歧而不是选边。',
    description: '带自我验证流程的调研 Agent 系统提示词，输出可追溯来源。',
    tags: ['Agent', '调研', '系统提示词'],
    model: 'Claude / GPT Agents',
    media: [],
    createdAt: '2026-06-18T08:00:00.000Z',
  },
  {
    id: 'mock-anime-portrait',
    title: '吉卜力风人像转绘',
    type: 'image',
    prompt:
      'Convert this photo into a Studio Ghibli style illustration: soft watercolor textures, warm afternoon light, gentle expression, detailed background with floating dust particles, hand-drawn feel',
    description: '照片转吉卜力风格插画，保留人物神态。',
    tags: ['风格转绘', '人像', '吉卜力'],
    model: 'GPT-4o 图像',
    media: [{ url: 'https://picsum.photos/seed/prompthub-ghibli/960/720', name: '示例输出' }],
    createdAt: '2026-06-20T08:00:00.000Z',
  },
  {
    id: 'mock-explainer-video',
    title: '产品概念动画短片',
    type: 'video',
    prompt:
      'A clean 3D animation explaining cloud sync: glowing files flying from a laptop into a stylized cloud, then appearing on phone and tablet, pastel color palette, smooth camera orbit, minimal style, 10 seconds',
    description: '10 秒产品概念动画，适合官网 hero 区。',
    tags: ['动画', '产品', 'Veo'],
    model: 'Veo 3',
    media: [
      {
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        name: '示例输出',
      },
    ],
    createdAt: '2026-06-22T08:00:00.000Z',
  },
  {
    id: 'mock-dashboard-page',
    title: '数据看板页面',
    type: 'webpage',
    prompt:
      '生成一个运营数据看板页面：顶部 4 个指标卡（环比箭头）、中部折线图 + 柱状图并排、下方最近订单表格（可排序）。浅色主题，卡片圆角阴影，使用 shadcn/ui 风格。',
    description: '后台看板页面一键生成，shadcn 风格。',
    tags: ['看板', 'shadcn', '后台'],
    model: 'v0.dev / Lovable',
    media: [{ url: 'https://picsum.photos/seed/prompthub-dash/960/600', name: '页面截图' }],
    createdAt: '2026-06-25T08:00:00.000Z',
  },
  {
    id: 'mock-naming',
    title: '中英文命名生成器',
    type: 'text',
    prompt:
      '为 {产品描述} 生成 10 个名字：5 个英文 + 5 个中文。要求：好记、易读、域名友好（英文附 .com 可用性猜测）、避开行业烂大街词汇。每个名字附一句 slogan。',
    description: '产品/项目起名，中英文各 5 个，附 slogan。',
    tags: ['命名', '品牌', '创意'],
    model: '通用',
    media: [],
    createdAt: '2026-06-28T08:00:00.000Z',
  },
]
