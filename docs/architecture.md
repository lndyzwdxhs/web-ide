# dsh-cursor-layout 架构

## 总体结构

插件是 DeepSeek Harness 的 bundle 插件，一个 npm 包同时包含 Node half 与
client half：

- Node half（`src/index.ts`）：在 `webServer` 上注册文件树读写 API。
- Client half（`src/client/index.ts`）：在浏览器中注册根布局 slot，并渲染
  Cursor 风格三栏工作台。
- `cordis.patch.yml`：向 web 组合层挂载 `dsh-cursor-layout`，并禁用默认
  `ui-layout`，让本插件接管根布局。

## Node half

Node half 通过 `inject: ['fs', 'webServer']` 获取宿主服务，在
`ctx.effect()` 中注册以下路由，并在 effect cleanup 时释放：

| 方法 | 路径 | 参数 | 返回 |
|---|---|---|---|
| GET | `/api/cursor/fs/list` | `path` | `{ ok, entries: [{ name, type, displayPath }] }` |
| GET | `/api/cursor/fs/read` | `path` | `{ ok, content }` |
| POST | `/api/cursor/fs/write` | JSON `{ path, content }` | `{ ok }` |

文件系统能力来自 `ctx.fs.resolve`、`ctx.fs.listDir`、`ctx.fs.readText`、
`ctx.fs.writeText`。路径来自前端请求参数，插件本身不持久化额外状态。

## Client half

Client half 通过 `inject: ['slots', 'sessions', 'workspaces']` 获取服务，
在 `ctx.slots.register({ name: 'root', ... })` 中注册根布局。渲染入口为
`CursorRoot` 组件：

```text
CursorRoot
├── cur-left
│   ├── workspace select / new workspace input
│   └── cur-tree (lazy directory tree)
├── cur-center
│   ├── cur-tabs (multi-tab, drag reorder, middle-click close)
│   └── CodeMirror preview (editable, Ctrl/Cmd+S save)
├── cur-right
│   ├── session select / new session button
│   └── native DSH conversation slot
└── cur-drag-handle (right pane resize, 320–800px)
```

组件通过 `renderSlot('conversation', {})` 复用宿主原生 conversation UI；
`ctx.sessions` 与 `ctx.workspaces` 提供会话/工作空间状态与操作。

## 构建

`scripts/build.mjs` 使用 esbuild 生成两个产物：

- `lib/index.js`：ESM，`platform: node`，打包 `src/index.ts`。
- `lib/client.js`：CJS，`platform: browser`，打包
  `src/client/index.ts`，并在外层包装
  `window.__ModuleLoader__.load({ id, factory })`，供 client-modules 扫描加载。

该脚本不依赖 harness 仓库中的 `tsdown.client.ts`，因此插件目录可以独立构建、
提交并发布。

## 分发

构建产物入库后，用户通过 git 源或本地目录安装，无需在安装时执行构建。包
`dsh.bundle.patch` 指向 `cordis.patch.yml`，`dsh.client.platform` 为 `web`。
