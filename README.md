<h1 align="center">web-ide</h1>

<p align="center">
  <strong>DeepSeek Harness web 的 Cursor 风格三栏工作台</strong><br/>
  用文件树、多标签编辑器与原生 DSH conversation UI 替换默认 web shell。
</p>

<p align="center">
  <img src="https://badgen.net/badge/license/MIT/green" alt="license" />
  <img src="https://badgen.net/badge/format/official%20bundle/8257D0" alt="official bundle" />
</p>

---

## 能力

| 能力面 | 说明 |
|---|---|
| 工作空间文件树 | 左栏按目录懒加载，支持多 workspace 选择与新建 |
| 多文件标签 | 打开/切换/关闭/拖拽排序/中键关闭，dirty 状态与按扩展名标识 |
| 代码编辑 | 中栏 CodeMirror 编辑，`Ctrl/Cmd+S` 写回磁盘 |
| 会话 | 右栏复用 DSH 原生 conversation slot，支持会话切换与新建 |
| 布局 | 右栏可拖拽调整宽度，范围为 320–800px |

## 安装

**官方 bundle 插件**（仓库根 `package.json` 的 `dsh.bundle` + `dsh.client`）。经官方 profile 管理：

```sh
# git 源一行安装（构建产物已入库）
dsh plugin --profile web add "github:lndyzwdxhs/web-ide#main"

# 或本地目录（先构建：pnpm install && pnpm run bundle）
cd /path/to/web-ide
dsh plugin --profile web add .
```

装完重启 web：

```sh
dsh web
```

更新插件：

```sh
dsh plugin --profile web update web-ide
```

## 开发

```sh
pnpm install
pnpm run bundle      # 生成 lib/index.js 与 lib/client.js
pnpm run gates       # 仓库本地门禁
pnpm run watch       # 监听源码并重建
```

构建产物 `lib/index.js`、`lib/client.js` 提交进仓库；git 源安装不跑构建。

## 架构与 API

- 三栏组件树与 slot 契约见 [docs/architecture.md](docs/architecture.md)
- 仓库维护约定见 [AGENTS.md](AGENTS.md)

## License

MIT
