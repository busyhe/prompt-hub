# Prompt Hub

一个 Prompt 管理应用：单页卡片墙展示所有 prompt（文本 / 图片 / 视频 / 音频 / 网页 / 代码 / Agent），支持搜索、一键复制、链接分享，数据存储在 Notion database。

基于 [tanstack-starter](https://github.com/busyhe/tanstack-starter) 脚手架（TanStack Start + pnpm + Turborepo Monorepo）。

## 功能

- **卡片墙**：按类型自适应展示 —— 图片卡带示例图、视频卡悬停播放、音频卡内嵌播放器、网页卡带截图和链接、文本/代码/Agent 卡展示 prompt 正文
- **搜索**：按名称、类型、标签、模型、prompt 内容多关键词检索，类型筛选 chips
- **复制**：卡片和详情页均可一键复制 prompt
- **分享**：复制 `/p/<id>` 卡片链接（支持系统分享面板），打开即查看详情
- **Notion 数据源**：通过 `@notionhq/client` 服务端读取；未配置时用内置示例数据运行

## 快速开始

```bash
pnpm install
pnpm dev   # http://localhost:3000
```

默认使用示例数据。接入 Notion 见 [docs/notion-setup.md](./docs/notion-setup.md)，配置好 database 后：

```bash
# apps/www/.env
NOTION_TOKEN=ntn_xxx
NOTION_DATABASE_ID=xxx
```

## 关键目录

```
apps/www/src/
├── lib/prompts/        # 类型定义、Notion 数据访问、mock 数据
├── server/prompts.ts   # server functions
├── components/prompts/ # 卡片、搜索墙、复制/分享按钮、媒体预览
└── routes/
    ├── index.tsx       # 卡片墙首页
    └── p.$id.tsx       # 卡片详情（分享落地页）
```

## 技术栈

- **框架**: [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router)
- **构建工具**: [Vite 8](https://vite.dev)
- **UI**: React 19 + [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **语言**: TypeScript 5.9
- **包管理**: pnpm 10 (workspace + catalog)
- **任务编排**: [Turborepo](https://turbo.build)
- **测试**: Vitest + Testing Library
- **代码规范**: ESLint 9 + Prettier + Lefthook + Commitizen

## 项目结构

```
tanstack-starter/
├── apps/
│   └── www/                    # TanStack Start 应用
├── packages/
│   ├── ui/                     # 共享 UI 组件库 (shadcn/ui)
│   ├── eslint-config/          # 共享 ESLint 配置
│   └── typescript-config/      # 共享 TypeScript 配置
├── scripts/                    # 工程脚本
├── turbo.json                  # Turborepo 配置
├── pnpm-workspace.yaml         # pnpm workspace + catalog
└── lefthook.yml                # Git hooks
```

## 环境要求

- Node.js `>= 20`
- pnpm `10.27.0`

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器 (默认 http://localhost:3000)
pnpm dev

# 构建
pnpm build

# 类型检查
pnpm check-types

# Lint
pnpm lint

# 格式化
pnpm format
```

## 常用脚本

| 命令               | 说明                          |
| ------------------ | ----------------------------- |
| `pnpm dev`         | 启动所有应用的开发模式        |
| `pnpm build`       | 构建所有应用与包              |
| `pnpm lint`        | 运行 ESLint                   |
| `pnpm check-types` | TypeScript 类型检查           |
| `pnpm test`        | 运行 Vitest 测试              |
| `pnpm format`      | Prettier 格式化               |
| `pnpm clean`       | 清理构建产物与 `node_modules` |
| `pnpm commit`      | 使用 czg 创建规范化提交       |
| `pnpm release`     | 使用 bumpp 统一更新版本号     |

## 部署

`pnpm build` 产出 Nitro node-server 产物(`apps/www/.output`),可直接 `node apps/www/.output/server/index.mjs` 运行,或使用仓库根的 [Dockerfile](Dockerfile) 容器化:

```bash
docker build -t tanstack-starter .
docker run -p 3000:3000 tanstack-starter
```

如需部署到 Vercel / Cloudflare 等平台,修改 Nitro preset 即可。

## 依赖管理

本项目使用 pnpm **catalog** 统一管理依赖版本。新增公共依赖时，请先在 [pnpm-workspace.yaml](pnpm-workspace.yaml) 的 `catalog` 中声明版本，再在对应 package 中以 `"catalog:"` 引用。

## Git 工作流

- 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/)，推荐使用 `pnpm commit`
- [Lefthook](lefthook.yml) 在提交前自动执行 Prettier 格式化；lint / 类型检查 / 测试由 CI 执行
- 版本发布使用 [bumpp](https://github.com/antfu-collective/bumpp)

## License

MIT
