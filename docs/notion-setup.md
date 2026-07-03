# Notion 数据库搭建指南

Prompt Hub 使用一个 Notion database 作为数据源。按下面的结构创建后，把凭据填入 `apps/www/.env` 即可自动从示例数据切换为你的真实数据。

## 一、创建 Integration

1. 打开 <https://www.notion.so/my-integrations>，点击 **New integration**
2. 类型选 **Internal**，关联你的 workspace，创建后复制 **Internal Integration Secret**（即 `NOTION_TOKEN`）
3. Capabilities 只需 **Read content** 权限

## 二、创建 Database

在 Notion 中新建一个 **Table 类型的 database**（名字随意，如 `Prompts`），按下表配置属性（属性名需完全一致，区分大小写；括号内为兼容的中文名）：

| 属性名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `Name` | Title | ✅ | prompt 的名称，卡片标题 |
| `Type` | Select | ✅ | 卡片类型，选项见下方 |
| `Prompt` | Text (rich text) | ✅ | prompt 正文，复制按钮复制的就是它 |
| `Description` (`描述`) | Text | | 一句话介绍，展示在卡片上 |
| `Tags` (`标签`) | Multi-select | | 标签，可被搜索 |
| `Model` (`模型`) | Select | | 适用模型，如 `Midjourney v7`、`Claude` |
| `Media` (`媒体`) | Files & media | | 示例输出：图片 / 视频(mp4/webm) / 音频(mp3/wav)，或网页截图 |
| `Link` (`链接`) | URL | | 外部链接（网页类型的示例地址、来源等） |
| `Published` (`发布`) | Checkbox | | 勾选才会展示；不加此属性则默认全部展示 |

### Type 的 Select 选项（小写）

`text` 文本 · `image` 图片 · `video` 视频 · `audio` 音频 · `webpage` 网页 · `code` 代码 · `agent` Agent

> 类型不在上述列表内或为空时，按 `text` 处理。

## 三、授权并获取 Database ID

1. 打开该 database 页面 → 右上角 `...` → **Connections** → 添加你刚创建的 integration
2. 复制浏览器地址栏 URL 中的 database id：
   `https://www.notion.so/workspace/<DATABASE_ID>?v=...`（32 位十六进制，带不带连字符均可）

## 四、配置环境变量

```bash
# apps/www/.env
NOTION_TOKEN=ntn_xxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

重启 `pnpm dev`，首页提示的「当前展示示例数据」消失即表示连接成功。

## 注意事项

- **Notion 文件链接约 1 小时过期**：`Media` 中直接上传到 Notion 的文件 URL 是临时签名链接。个人使用（每次请求实时拉取）没有问题；若要做静态部署或长缓存，建议 Media 使用外链（如图床 URL）。
- 数据在服务端拉取，`NOTION_TOKEN` 不会暴露到浏览器。
- 卡片分享链接格式为 `/p/<notion-page-id>`，对方打开时服务端会实时读取该页面。
