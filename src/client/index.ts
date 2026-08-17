// @ts-nocheck
import React from 'react'
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { basicSetup } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { markdown } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'

function svg(size, children) {
  return React.createElement('svg', {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }, children)
}

function path(d) {
  return React.createElement('path', { d })
}

const FolderIcon = svg(15, path('M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'))
const FileIcon = svg(13, path('M6 3h8l4 4v14H6z'), path('M14 3v4h4'))
const ChevronR = svg(13, path('m9 6 6 6-6 6'))
const ChevronD = svg(13, path('m6 9 6 6 6-6'))

const CSS = [
  '.cur-root{position:fixed;inset:0;overflow:hidden;display:grid;grid-template-columns:250px minmax(0,1fr) 420px;background:var(--dsw-alias-bg-base,#0d0d12);color:var(--dsw-alias-label-primary,#e5e5ea);font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;font-size:13px;line-height:1.4}',
  '.cur-left{min-width:0;min-height:0;display:flex;flex-direction:column;background:var(--dsw-specific-sidebar-fill,#101016);border-right:1px solid var(--dsw-alias-border-l1,#26262e)}',
  '.cur-center{min-width:0;min-height:0;display:flex;flex-direction:column;background:var(--dsw-alias-bg-base,#0d0d12)}',
  '.cur-right{min-width:0;min-height:0;height:100%;overflow:hidden;display:flex;flex-direction:column;background:var(--dsw-alias-bg-layer-1,#15151b);border-left:1px solid var(--dsw-alias-border-l1,#26262e)}',
  '.cur-tabs{display:flex;height:36px;border-bottom:1px solid var(--dsw-alias-border-l1,#26262e);background:var(--dsw-alias-bg-layer-1,#15151b);overflow-x:auto;flex:0 0 auto}',
  '.cur-tab{display:flex;align-items:center;gap:6px;padding:0 10px;border-right:1px solid var(--dsw-alias-border-l1,#26262e);color:var(--dsw-alias-label-secondary,#9a9aa5);cursor:pointer;white-space:nowrap;font-size:12px}',
  '.cur-tab.active{background:var(--dsw-alias-bg-base,#0d0d12);color:var(--dsw-alias-label-primary,#e5e5ea)}',
  '.cur-tab-title{max-width:140px;overflow:hidden;text-overflow:ellipsis}',
  '.cur-tab-close{margin-left:4px;color:var(--dsw-alias-label-secondary,#9a9aa5)}',
  '.cur-tab-close:hover{color:var(--dsw-alias-label-primary,#e5e5ea)}',
  '.cur-chat-header{flex:0 0 auto;display:flex;gap:6px;align-items:center;padding:8px 10px;border-bottom:1px solid var(--dsw-alias-border-l1,#26262e);background:var(--dsw-alias-bg-layer-1,#15151b)}',
  '.cur-chat-select{flex:1;min-width:0;padding:7px 9px;border-radius:8px;border:1px solid var(--dsw-alias-border-l1,#26262e);background:var(--dsw-alias-bg-base,#0d0d12);color:var(--dsw-alias-label-primary,#e5e5ea);font-size:12px;outline:none}',
  '.cur-new-session{width:28px;height:28px;flex:0 0 auto;border:1px solid var(--dsw-alias-border-l1,#26262e);border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary,#9a9aa5);cursor:pointer;font-size:16px;line-height:1}',
  '.cur-new-session:hover{background:var(--dsw-alias-bg-layer-2,#1e1e26);color:var(--dsw-alias-label-primary,#e5e5ea)}',
  '.cur-workspace-select{width:100%;padding:7px 9px;border-radius:8px;border:1px solid var(--dsw-alias-border-l1,#26262e);background:var(--dsw-alias-bg-base,#0d0d12);color:var(--dsw-alias-label-primary,#e5e5ea);font-size:12px;outline:none}',
  '.cur-workspace-input{flex:1;min-width:0;padding:7px 9px;border-radius:8px;border:1px solid var(--dsw-alias-border-l1,#26262e);background:var(--dsw-alias-bg-base,#0d0d12);color:var(--dsw-alias-label-primary,#e5e5ea);font-size:12px;outline:none}',
  '.cur-conversation-wrap{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column}',
  '.cur-drag-handle{position:absolute;top:0;bottom:0;width:4px;cursor:col-resize;z-index:10;background:transparent}',
  '.cur-drag-handle:hover{background:var(--dsw-alias-brand-primary,#5b8dff)}',
  '.cur-pane-title{padding:12px 14px 10px;display:flex;gap:6px;align-items:center;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--dsw-alias-label-secondary,#9a9aa5);border-bottom:1px solid var(--dsw-alias-border-l1,#26262e)}',
  '.cur-add-workspace{width:26px;height:26px;flex:0 0 auto;border:1px solid var(--dsw-alias-border-l1,#26262e);border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary,#9a9aa5);cursor:pointer;font-size:16px;line-height:1}',
  '.cur-add-workspace:hover{background:var(--dsw-alias-bg-layer-2,#1e1e26);color:var(--dsw-alias-label-primary,#e5e5ea)}',
  '.cur-tree{flex:1;overflow:auto;padding:8px 0}',
  '.cur-tree-row{display:flex;align-items:center;gap:6px;padding:4px 8px;cursor:pointer;color:var(--dsw-alias-label-primary,#e5e5ea);user-select:none;white-space:nowrap;overflow:hidden}',
  '.cur-tree-row:hover{background:var(--dsw-alias-bg-layer-2,#1e1e26)}',
  '.cur-tree-row.active{background:rgba(91,141,255,.14);color:var(--dsw-alias-label-primary,#e5e5ea)}',
  '.cur-file-name{flex:1;overflow:hidden;text-overflow:ellipsis}',
  '.cur-file-icon{display:inline-flex;width:22px;height:18px;align-items:center;justify-content:center;font-size:9px;font-weight:700;border:1px solid currentColor;border-radius:4px;background:rgba(255,255,255,.04);flex:0 0 auto}',
  '.cur-tab.dragging{opacity:.4}',
  '.cur-tab.dirty::after{content:"";width:6px;height:6px;border-radius:50%;background:var(--dsw-alias-state-warn-primary,#f5b544);margin-left:2px}',
  '.cur-tree-loading,.cur-tree-error,.cur-empty{padding:8px 14px;color:var(--dsw-alias-label-secondary,#9a9aa5);font-size:12px}',
  '.cur-preview{flex:1;overflow:auto;display:flex}',
  '.cur-preview-code{flex:1;margin:0;padding:16px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12.5px;line-height:1.5;white-space:pre;color:var(--dsw-alias-label-primary,#e5e5ea);background:var(--dsw-alias-bg-base,#0d0d12)}',
  '.cur-codemirror{flex:1;overflow:hidden;background:var(--dsw-alias-bg-base,#0d0d12)}',
  '.cur-codemirror .cm-editor{height:100%;font-size:12.5px}',
  '.cur-preview-empty,.cur-preview-error{margin:auto;color:var(--dsw-alias-label-secondary,#9a9aa5);font-size:13px}',
  '.cur-chat{flex:1;min-height:0;display:flex;flex-direction:column}',
  '.cur-chat-msgs{flex:1;overflow:auto;padding:16px;display:flex;flex-direction:column;gap:12px}',
  '.cur-chat-msg{max-width:100%}',
  '.cur-chat-user{align-self:flex-end;background:var(--dsw-alias-brand-primary,#5b8dff);color:#fff;padding:8px 11px;border-radius:10px;max-width:75%}',
  '.cur-chat-assistant{align-self:flex-start;background:var(--dsw-alias-bg-layer-2,#1e1e26);padding:8px 11px;border-radius:10px;max-width:85%}',
  '.cur-chat-tool{align-self:flex-start;font-size:12px;color:var(--dsw-alias-label-secondary,#9a9aa5);padding:4px 8px;border:1px solid var(--dsw-alias-border-l1,#26262e);border-radius:8px;max-width:85%}',
  '.cur-chat-input{display:flex;gap:8px;padding:10px;border-top:1px solid var(--dsw-alias-border-l1,#26262e);background:var(--dsw-alias-bg-layer-1,#15151b)}',
  '.cur-chat-input textarea{flex:1;resize:none;min-height:38px;max-height:120px;padding:9px 10px;border-radius:8px;border:1px solid var(--dsw-alias-border-l1,#26262e);background:var(--dsw-alias-bg-base,#0d0d12);color:var(--dsw-alias-label-primary,#e5e5ea);font:inherit;outline:none}',
  '.cur-chat-input button{padding:0 14px;border:none;border-radius:8px;background:var(--dsw-alias-brand-primary,#5b8dff);color:#fff;font-weight:600;cursor:pointer}',
].join('\n')

function basename(value) {
  const parts = String(value || '').split('/')
  return parts[parts.length - 1] || String(value || '')
}

function textOfContent(content) {
  if (!Array.isArray(content)) return ''
  const parts = []
  for (const block of content) {
    if (block && block.type === 'text' && typeof block.text === 'string') parts.push(block.text)
  }
  return parts.join('\n')
}

function textOfBlocks(blocks) {
  if (!Array.isArray(blocks)) return ''
  const parts = []
  for (const block of blocks) {
    if (block && block.kind === 'text' && typeof block.text === 'string') parts.push(block.text)
  }
  return parts.join('\n')
}

function fsList(dirPath) {
  return fetch('/api/cursor/fs/list?path=' + encodeURIComponent(dirPath)).then((res) => res.json())
}

function fsRead(filePath) {
  return fetch('/api/cursor/fs/read?path=' + encodeURIComponent(filePath)).then((res) => res.json())
}

function fsWrite(filePath, content) {
  return fetch('/api/cursor/fs/write', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ path: filePath, content }),
  }).then((res) => res.json())
}

function languageForPath(filePath) {
  const ext = String(filePath || '').split('.').pop().toLowerCase()
  if (['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs'].includes(ext)) return javascript()
  if (ext === 'json') return json()
  if (['html', 'htm', 'xml'].includes(ext)) return html()
  if (['css', 'scss', 'less'].includes(ext)) return css()
  if (['md', 'markdown'].includes(ext)) return markdown()
  return []
}

function fileExt(filePath) {
  const parts = String(filePath || '').split('.')
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ''
}

function fileIconColor(ext) {
  if (['ts', 'tsx'].includes(ext)) return '#5b8dff'
  if (['js', 'jsx', 'mjs', 'cjs'].includes(ext)) return '#f5d76e'
  if (ext === 'json') return '#f5b544'
  if (['css', 'scss', 'less'].includes(ext)) return '#7dd3fc'
  if (['html', 'htm', 'xml'].includes(ext)) return '#f0616d'
  if (['md', 'markdown'].includes(ext)) return '#4ade80'
  return '#9a9aa5'
}

function FileTypeIcon(filePath) {
  const ext = fileExt(filePath)
  return React.createElement('span', {
    className: 'cur-file-icon',
    style: { color: fileIconColor(ext) },
  }, ext ? ext.toUpperCase().slice(0, 4) : 'FILE')
}

function CodePreview(props) {
  const ref = React.useRef(null)
  const onChangeRef = React.useRef(props.onChange)
  const onSaveRef = React.useRef(props.onSave)
  onChangeRef.current = props.onChange
  onSaveRef.current = props.onSave
  React.useEffect(() => {
    const view = new EditorView({
      parent: ref.current,
      state: EditorState.create({
        doc: props.value || '',
        extensions: [
          basicSetup,
          oneDark,
          languageForPath(props.path),
          EditorView.updateListener.of((update) => {
            if (update.docChanged && onChangeRef.current) onChangeRef.current(update.state.doc.toString())
          }),
        ],
      }),
    })
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault()
        if (onSaveRef.current) onSaveRef.current()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      view.destroy()
    }
  }, [])
  return React.createElement('div', { ref, className: 'cur-codemirror' })
}

function CursorRoot(props) {
  const useWorkspaces = props.useWorkspaces
  const useSessions = props.useSessions
  const renderSlot = props.renderSlot
  const openSession = props.openSession
  const addWorkspace = props.addWorkspace
  const newSession = props.newSession
  const workspaces = useWorkspaces((s) => s.items) || []
  const sessionState = useSessions((s) => s)
  const current = sessionState.current
  const sessionIds = sessionState.ids || []
  const sessionById = sessionState.byId || {}

  let activeWorkspace = null
  if (workspaces.length > 0) {
    activeWorkspace = workspaces[0]
    if (current) {
      for (const workspace of workspaces) {
        if (workspace.sessionIds && workspace.sessionIds.indexOf(current) !== -1) {
          activeWorkspace = workspace
          break
        }
      }
    }
  }

  const _workspaceId = React.useState(null)
  const workspaceId = _workspaceId[0]
  const setWorkspaceId = _workspaceId[1]
  const _showWorkspaceInput = React.useState(false)
  const showWorkspaceInput = _showWorkspaceInput[0]
  const setShowWorkspaceInput = _showWorkspaceInput[1]
  const _newWorkspacePath = React.useState('')
  const newWorkspacePath = _newWorkspacePath[0]
  const setNewWorkspacePath = _newWorkspacePath[1]

  React.useEffect(() => {
    if (!workspaceId && activeWorkspace) setWorkspaceId(activeWorkspace.workspaceId)
  }, [activeWorkspace, workspaceId])

  const selectedWorkspace = workspaces.find((workspace) => workspace.workspaceId === workspaceId)
    || activeWorkspace
    || workspaces[0]
    || null
  const rootPath = selectedWorkspace ? selectedWorkspace.path : null
  const rootTitle = selectedWorkspace ? (selectedWorkspace.title || basename(selectedWorkspace.path)) : 'Workspace'

  const _tree = React.useState({})
  const tree = _tree[0]
  const setTree = _tree[1]
  const _expanded = React.useState({})
  const expanded = _expanded[0]
  const setExpanded = _expanded[1]
  const _openFiles = React.useState([])
  const openFiles = _openFiles[0]
  const setOpenFiles = _openFiles[1]
  const _activePath = React.useState(null)
  const activePath = _activePath[0]
  const setActivePath = _activePath[1]
  const _fileData = React.useState({})
  const fileData = _fileData[0]
  const setFileData = _fileData[1]
  const _loadingRoot = React.useState(false)
  const loadingRoot = _loadingRoot[0]
  const setLoadingRoot = _loadingRoot[1]
  const _rightWidth = React.useState(420)
  const rightWidth = _rightWidth[0]
  const setRightWidth = _rightWidth[1]
  const dragRef = React.useRef({ startX: 0, startWidth: 420 })
  const _dragIndex = React.useState(null)
  const dragIndex = _dragIndex[0]
  const setDragIndex = _dragIndex[1]

  function onResizePointerDown(e) {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { startX: e.clientX, startWidth: rightWidth }
  }
  function onResizePointerMove(e) {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return
    const dx = e.clientX - dragRef.current.startX
    setRightWidth(Math.min(800, Math.max(320, dragRef.current.startWidth - dx)))
  }
  function onResizePointerUp(e) {
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  function loadDir(dirPath, force) {
    const existing = tree[dirPath]
    if (!force && existing && existing.entries) return Promise.resolve()
    setTree((prev) => {
      const next = { ...prev }
      next[dirPath] = {
        loading: true,
        error: '',
        entries: (prev[dirPath] && prev[dirPath].entries) || null,
      }
      return next
    })
    return fsList(dirPath).then((res) => {
      setTree((prev) => {
        const next = { ...prev }
        next[dirPath] = {
          loading: false,
          error: res && res.ok ? '' : (res && res.error ? res.error : 'failed'),
          entries: res && res.ok ? res.entries : null,
        }
        return next
      })
    }).catch((err) => {
      setTree((prev) => {
        const next = { ...prev }
        next[dirPath] = {
          loading: false,
          error: err && err.message ? err.message : String(err),
          entries: null,
        }
        return next
      })
    })
  }

  React.useEffect(() => {
    if (!rootPath) return
    setOpenFiles([])
    setActivePath(null)
    setFileData({})
    setTree({})
    setExpanded({})
    setLoadingRoot(true)
    loadDir(rootPath, true).finally(() => {
      setLoadingRoot(false)
    })
  }, [rootPath])

  function toggleDir(dirPath) {
    const isOpen = !!expanded[dirPath]
    setExpanded({ ...expanded, [dirPath]: !isOpen })
    if (!isOpen) loadDir(dirPath, false)
  }

  function openFile(filePath) {
    setOpenFiles((prev) => prev.some((file) => file.path === filePath)
      ? prev
      : [...prev, { path: filePath, name: basename(filePath) }])
    setActivePath(filePath)
    setFileData((prev) => ({ ...prev, [filePath]: { loading: true, content: '', error: '' } }))
    fsRead(filePath).then((res) => {
      setFileData((prev) => ({
        ...prev,
        [filePath]: {
          loading: false,
          content: res && res.ok ? res.content : '',
          error: res && res.ok ? '' : (res && res.error ? res.error : 'read failed'),
        },
      }))
    }).catch((err) => {
      setFileData((prev) => ({
        ...prev,
        [filePath]: { loading: false, content: '', error: err && err.message ? err.message : String(err) },
      }))
    })
  }

  function saveFile(filePath) {
    const file = fileData[filePath]
    if (!file) return
    setFileData((prev) => ({ ...prev, [filePath]: { ...file, saving: true } }))
    fsWrite(filePath, file.content).then((res) => {
      setFileData((prev) => ({
        ...prev,
        [filePath]: {
          ...prev[filePath],
          saving: false,
          dirty: false,
          error: res && res.ok ? '' : (res && res.error ? res.error : 'save failed'),
        },
      }))
    }).catch((err) => {
      setFileData((prev) => ({
        ...prev,
        [filePath]: {
          ...prev[filePath],
          saving: false,
          dirty: true,
          error: err && err.message ? err.message : String(err),
        },
      }))
    })
  }

  function reorderFiles(from, to) {
    if (from === to || from < 0 || to < 0 || from >= openFiles.length || to >= openFiles.length) return
    setOpenFiles((prev) => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }

  function submitNewWorkspace() {
    const path = newWorkspacePath.trim()
    if (!path || !addWorkspace) return
    addWorkspace(path).then((workspace) => {
      if (workspace) setWorkspaceId(workspace.workspaceId)
      setShowWorkspaceInput(false)
      setNewWorkspacePath('')
    }).catch(() => {})
  }

  function closeTab(filePath) {
    const index = openFiles.findIndex((file) => file.path === filePath)
    const next = openFiles.filter((file) => file.path !== filePath)
    setOpenFiles(next)
    if (activePath === filePath) {
      setActivePath(next.length ? next[Math.min(index, next.length - 1)].path : null)
    }
    setFileData((prev) => {
      const nextData = { ...prev }
      delete nextData[filePath]
      return nextData
    })
  }

  function renderTreeNode(nodePath, entry, depth) {
    const isDir = entry.type === 'directory'
    const isOpen = !!expanded[nodePath]
    const node = tree[nodePath] || {}
    const row = React.createElement('div', {
      className: 'cur-tree-row' + (activePath === nodePath ? ' active' : ''),
      style: { paddingLeft: (depth * 12 + 8) + 'px' },
      onClick: (e) => {
        e.stopPropagation()
        if (isDir) toggleDir(nodePath)
        else openFile(nodePath)
      },
    },
      isDir ? (isOpen ? ChevronD : ChevronR) : FileTypeIcon(entry.name),
      React.createElement('span', { className: 'cur-file-name' }, entry.name),
    )

    let children = null
    if (isDir && isOpen) {
      if (node.loading) {
        children = React.createElement('div', { className: 'cur-tree-loading', style: { paddingLeft: (depth * 12 + 30) + 'px' } }, 'Loading…')
      } else if (node.error) {
        children = React.createElement('div', { className: 'cur-tree-error', style: { paddingLeft: (depth * 12 + 30) + 'px' } }, node.error)
      } else if (node.entries) {
        children = node.entries.map((child) => {
          const childPath = nodePath === '/' ? '/' + child.name : nodePath + '/' + child.name
          return renderTreeNode(childPath, child, depth + 1)
        })
      }
    }

    return React.createElement(React.Fragment, { key: nodePath }, row, children)
  }

  let treeContent
  if (!rootPath) {
    treeContent = React.createElement('div', { className: 'cur-empty' }, 'No workspace')
  } else if (loadingRoot) {
    treeContent = React.createElement('div', { className: 'cur-empty' }, 'Loading workspace…')
  } else {
    const rootNode = tree[rootPath]
    if (rootNode && rootNode.error) {
      treeContent = React.createElement('div', { className: 'cur-empty' }, rootNode.error)
    } else if (rootNode && rootNode.entries) {
      treeContent = rootNode.entries.map((child) => {
        const childPath = rootPath === '/' ? '/' + child.name : rootPath + '/' + child.name
        return renderTreeNode(childPath, child, 0)
      })
    } else {
      treeContent = React.createElement('div', { className: 'cur-empty' }, 'No files')
    }
  }

  const activeFile = activePath ? fileData[activePath] : null
  let previewContent
  if (!activePath) {
    previewContent = React.createElement('div', { className: 'cur-preview-empty' }, 'Select a file to preview')
  } else if (!activeFile || activeFile.loading) {
    previewContent = React.createElement('div', { className: 'cur-preview-empty' }, 'Loading…')
  } else if (activeFile.error) {
    previewContent = React.createElement('div', { className: 'cur-preview-error' }, activeFile.error)
  } else {
    previewContent = React.createElement(CodePreview, {
      key: activePath,
      value: activeFile.content,
      path: activePath,
      onChange: (next) => {
        setFileData((prev) => ({ ...prev, [activePath]: { ...prev[activePath], content: next, dirty: true } }))
      },
      onSave: () => saveFile(activePath),
    })
  }

  const tabBar = React.createElement('div', { className: 'cur-tabs' },
    openFiles.map((file, index) => React.createElement('div', {
      key: file.path,
      draggable: true,
      className: 'cur-tab'
        + (file.path === activePath ? ' active' : '')
        + (fileData[file.path] && fileData[file.path].dirty ? ' dirty' : '')
        + (dragIndex === index ? ' dragging' : ''),
      onClick: () => setActivePath(file.path),
      onDragStart: (e) => {
        e.dataTransfer.effectAllowed = 'move'
        setDragIndex(index)
      },
      onDragOver: (e) => e.preventDefault(),
      onDrop: (e) => {
        e.preventDefault()
        reorderFiles(dragIndex, index)
        setDragIndex(null)
      },
      onDragEnd: () => setDragIndex(null),
      onAuxClick: (e) => {
        if (e.button === 1) {
          e.preventDefault()
          closeTab(file.path)
        }
      },
    },
      React.createElement('span', { className: 'cur-tab-title' }, file.name),
      React.createElement('span', {
        className: 'cur-tab-close',
        onClick: (e) => {
          e.stopPropagation()
          closeTab(file.path)
        },
      }, '×'),
    )),
  )

  const sessionOptions = sessionIds.map((id) => sessionById[id]).filter(Boolean).map((session) =>
    React.createElement('option', { key: session.id, value: session.id }, session.displayTitle || session.id),
  )
  const workspaceOptions = workspaces.map((workspace) =>
    React.createElement('option', {
      key: workspace.workspaceId,
      value: workspace.workspaceId,
    }, workspace.title || basename(workspace.path)),
  )

  return React.createElement('div', {
    className: 'cur-root',
    style: { gridTemplateColumns: `250px minmax(0,1fr) ${rightWidth}px` },
  },
    React.createElement('div', { className: 'cur-left' },
      React.createElement('div', { className: 'cur-pane-title' },
        React.createElement('select', {
          className: 'cur-workspace-select',
          value: selectedWorkspace ? selectedWorkspace.workspaceId : '',
          onChange: (e) => setWorkspaceId(e.target.value),
        },
          React.createElement('option', { value: '' }, 'Select workspace…'),
          workspaceOptions,
        ),
        React.createElement('button', {
          className: 'cur-add-workspace',
          type: 'button',
          title: 'Add workspace',
          onClick: () => setShowWorkspaceInput(!showWorkspaceInput),
        }, '+'),
        showWorkspaceInput ? React.createElement('input', {
          className: 'cur-workspace-input',
          placeholder: 'Workspace path…',
          value: newWorkspacePath,
          autoFocus: true,
          onChange: (e) => setNewWorkspacePath(e.target.value),
          onKeyDown: (e) => {
            if (e.key === 'Enter') submitNewWorkspace()
            if (e.key === 'Escape') {
              setShowWorkspaceInput(false)
              setNewWorkspacePath('')
            }
          },
        }) : null,
      ),
      React.createElement('div', { className: 'cur-tree' }, treeContent),
    ),
    React.createElement('div', { className: 'cur-center' },
      tabBar,
      React.createElement('div', { className: 'cur-preview' }, previewContent),
    ),
    React.createElement('div', { className: 'cur-right' },
      React.createElement('div', { className: 'cur-chat-header' },
        React.createElement('select', {
          className: 'cur-chat-select',
          value: current || '',
          onChange: (e) => openSession(e.target.value),
        },
          React.createElement('option', { value: '' }, 'Select session…'),
          sessionOptions,
        ),
        React.createElement('button', {
          className: 'cur-new-session',
          type: 'button',
          title: 'New session',
          onClick: () => {
            if (!newSession) return
            newSession(selectedWorkspace ? selectedWorkspace.workspaceId : undefined)
          },
        }, '+'),
      ),
      React.createElement('div', { className: 'cur-conversation-wrap' },
        renderSlot('conversation', {}),
      ),
    ),
    React.createElement('div', {
      className: 'cur-drag-handle',
      style: { right: rightWidth - 2 },
      onPointerDown: onResizePointerDown,
      onPointerMove: onResizePointerMove,
      onPointerUp: onResizePointerUp,
    }),
  )
}

export const inject = ['slots', 'sessions', 'workspaces']

export function apply(ctx) {
  ctx.effect(() => {
    const style = document.createElement('style')
    style.textContent = CSS
    document.head.append(style)

    const layout = {
      toggleSidebar() {},
      openDetails() {},
      closeDetails() {},
    }
    const offLayout = ctx.provide('layout', layout)

    const offRoot = ctx.slots.register({
      name: 'root',
      priority: -1,
      children: {
        'sidebar': { kind: 'single', scope: 'root' },
        'conversation': { kind: 'single', scope: 'session-maybe' },
        'details': { kind: 'single', scope: 'session' },
      },
      inject: () => ({
        openSession: (id) => ctx.sessions.open(id),
        addWorkspace: (path) => ctx.workspaces.create({ path }),
        newSession: (workspaceId) => ctx.workspaces.startSession(workspaceId),
      }),
    }, CursorRoot)

    return () => {
      offRoot()
      offLayout()
      style.remove()
    }
  })
}
