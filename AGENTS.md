# AGENTS.md

web-ide 是 DeepSeek Harness 的官方 **bundle 插件**（仓库根
`package.json` 的 `dsh.bundle` + `dsh.client`）。它用 Cursor 风格三栏布局
替换默认 web shell：左栏 workspace 文件树、中栏 CodeMirror 多标签编辑器、
右栏原生 DSH conversation UI。架构说明见 [docs/architecture.md](docs/architecture.md)。

## 目录

```
src/index.ts          Node half 入口：fs 读写路由
src/client/index.ts   client half 源码：React UI + slot 注册
lib/index.js          生成的 Node half 产物（勿手改）
lib/client.js         生成的 client bundle 产物（勿手改）
scripts/build.mjs     独立构建脚本（不依赖 harness 仓库）
scripts/gates/        仓库门禁
cordis.patch.yml      bundle 组合层（insert 自身 + disable 默认 ui-layout）
docs/                 架构文档
```

## 命令

```sh
pnpm install
pnpm run bundle      # 生成 lib/index.js 与 lib/client.js
pnpm run watch       # 监听源码并重建
pnpm run gates       # 仓库本地门禁
```

## 关键契约

- Node half 导出 `inject` 和 `apply`；`inject` 必须声明用到的
  `fs`、`webServer` 服务。
- Node half 通过 `ctx.effect()` 注册 `/api/cursor/fs/list`、
  `/api/cursor/fs/read`、`/api/cursor/fs/write` 路由，并在 cleanup 中释放。
- Client half 导出 `inject` 和 `apply`；`inject` 声明
  `slots`、`sessions`、`workspaces` 服务。
- Client half 通过 `ctx.slots.register({ name: 'root', ... })` 注册根布局，
  并提供 `layout` 服务占位；cleanup 时移除 slot、layout 与注入样式。
- 不要在 `dependencies`/`peerDependencies` 中声明 `@deepseek-ai/*`；它们由
  profile 挂载环境注入。
- `lib/` 是生成物，改源码后运行 `pnpm run bundle`；不要手改生成物。

## 按改动面验证

| 改动面 | 验证 |
|---|---|
| `src/index.ts` Node half | `pnpm run bundle` + 重启 web（ESM 缓存） |
| `src/client/index.ts` client half | `pnpm run bundle` + 刷新页面 |
| 文档 / 元数据 | `pnpm run gates` |

发布前确认 `pnpm run gates` 通过，且 `npm pack --dry-run` 能看到完整
`package.json`、`cordis.patch.yml`、`lib/index.js`、`lib/client.js`。
