import { useState, useCallback, forwardRef, useImperativeHandle, useRef } from 'react'
import './JSONTreeView.css'

interface JSONTreeViewProps {
  data: any
}

export interface JSONTreeViewRef {
  expandAll: () => void
  collapseAll: () => void
}

interface TreeNodeState {
  [key: string]: boolean
}

function collectAllPaths(data: any, nodeKey: string | number = 'root', path: string = ''): string[] {
  const paths: string[] = []
  const currentPath = path ? `${path}.${nodeKey}` : String(nodeKey)

  if (data === null || typeof data !== 'object') {
    return paths
  }

  if (Array.isArray(data)) {
    if (data.length > 0) {
      paths.push(currentPath)
      data.forEach((item, idx) => {
        paths.push(...collectAllPaths(item, idx, currentPath))
      })
    }
  } else {
    const keys = Object.keys(data)
    if (keys.length > 0) {
      paths.push(currentPath)
      keys.forEach((key) => {
        paths.push(...collectAllPaths(data[key], key, currentPath))
      })
    }
  }

  return paths
}

const JSONTreeView = forwardRef<JSONTreeViewRef, JSONTreeViewProps>(function JSONTreeView({ data }, ref) {
  const [expandedNodes, setExpandedNodes] = useState<TreeNodeState>({})
  const allPathsRef = useRef<string[]>([])

  allPathsRef.current = collectAllPaths(data, 'root', '')

  const expandAll = useCallback(() => {
    const allExpanded: TreeNodeState = {}
    allPathsRef.current.forEach((p) => {
      allExpanded[p] = true
    })
    setExpandedNodes(allExpanded)
  }, [])

  const collapseAll = useCallback(() => {
    const allCollapsed: TreeNodeState = {}
    allPathsRef.current.forEach((p) => {
      allCollapsed[p] = false
    })
    setExpandedNodes(allCollapsed)
  }, [])

  useImperativeHandle(ref, () => ({
    expandAll,
    collapseAll
  }))

  const toggleNode = useCallback((nodePath: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodePath]: !prev[nodePath]
    }))
  }, [])

  const isExpanded = useCallback(
    (nodePath: string, defaultValue: boolean = true) => {
      if (nodePath in expandedNodes) {
        return expandedNodes[nodePath]
      }
      return defaultValue
    },
    [expandedNodes]
  )

  return (
    <div className="json-tree-view">
      <TreeNode
        data={data}
        nodeKey="root"
        level={0}
        path=""
        isLast={true}
        expandedNodes={expandedNodes}
        toggleNode={toggleNode}
        isExpanded={isExpanded}
      />
    </div>
  )
})

interface TreeNodeProps {
  data: any
  nodeKey: string | number
  level: number
  path: string
  isLast: boolean
  expandedNodes: TreeNodeState
  toggleNode: (path: string) => void
  isExpanded: (path: string, defaultVal?: boolean) => boolean
}

function TreeNode({
  data,
  nodeKey,
  level,
  path,
  isLast,
  expandedNodes,
  toggleNode,
  isExpanded
}: TreeNodeProps) {
  const currentPath = path ? `${path}.${nodeKey}` : String(nodeKey)
  const indent = level * 16

  if (data === null) {
    return (
      <div className="tree-row">
        <div className="tree-indent" style={{ width: indent }} />
        <div className="tree-content">
          {typeof nodeKey === 'string' && nodeKey !== 'root' && (
            <>
              <span className="json-key">"{nodeKey}"</span>
              <span className="json-colon">: </span>
            </>
          )}
          {typeof nodeKey === 'number' && (
            <>
              <span className="json-index">{nodeKey}:</span>
              <span className="json-colon"> </span>
            </>
          )}
          <span className="json-null">null</span>
          {!isLast && <span className="json-comma">,</span>}
        </div>
      </div>
    )
  }

  if (typeof data === 'boolean') {
    return (
      <div className="tree-row">
        <div className="tree-indent" style={{ width: indent }} />
        <div className="tree-content">
          {typeof nodeKey === 'string' && nodeKey !== 'root' && (
            <>
              <span className="json-key">"{nodeKey}"</span>
              <span className="json-colon">: </span>
            </>
          )}
          {typeof nodeKey === 'number' && (
            <>
              <span className="json-index">{nodeKey}:</span>
              <span className="json-colon"> </span>
            </>
          )}
          <span className="json-boolean">{data.toString()}</span>
          {!isLast && <span className="json-comma">,</span>}
        </div>
      </div>
    )
  }

  if (typeof data === 'number') {
    return (
      <div className="tree-row">
        <div className="tree-indent" style={{ width: indent }} />
        <div className="tree-content">
          {typeof nodeKey === 'string' && nodeKey !== 'root' && (
            <>
              <span className="json-key">"{nodeKey}"</span>
              <span className="json-colon">: </span>
            </>
          )}
          {typeof nodeKey === 'number' && (
            <>
              <span className="json-index">{nodeKey}:</span>
              <span className="json-colon"> </span>
            </>
          )}
          <span className="json-number">{data}</span>
          {!isLast && <span className="json-comma">,</span>}
        </div>
      </div>
    )
  }

  if (typeof data === 'string') {
    return (
      <div className="tree-row">
        <div className="tree-indent" style={{ width: indent }} />
        <div className="tree-content">
          {typeof nodeKey === 'string' && nodeKey !== 'root' && (
            <>
              <span className="json-key">"{nodeKey}"</span>
              <span className="json-colon">: </span>
            </>
          )}
          {typeof nodeKey === 'number' && (
            <>
              <span className="json-index">{nodeKey}:</span>
              <span className="json-colon"> </span>
            </>
          )}
          <span className="json-string">"{data}"</span>
          {!isLast && <span className="json-comma">,</span>}
        </div>
      </div>
    )
  }

  if (Array.isArray(data)) {
    const expanded = isExpanded(currentPath, level < 2)
    const itemCount = data.length

  if (itemCount === 0) {
    return (
      <div className="tree-row">
        <div className="tree-indent" style={{ width: indent }} />
        <div className="tree-content">
          {typeof nodeKey === 'string' && nodeKey !== 'root' && (
            <>
              <span className="json-key">"{nodeKey}"</span>
              <span className="json-colon">: </span>
            </>
          )}
          {typeof nodeKey === 'number' && (
            <>
              <span className="json-index">{nodeKey}:</span>
              <span className="json-colon"> </span>
            </>
          )}
          <span className="json-bracket">[]</span>
          {!isLast && <span className="json-comma">,</span>}
        </div>
      </div>
    )
  }

    return (
      <div className="tree-node">
        <div className="tree-row">
          <div className="tree-indent" style={{ width: indent }} />
          <div className="tree-content">
            <button className="expand-btn" onClick={() => toggleNode(currentPath)}>
              {expanded ? '−' : '+'}
            </button>
            {typeof nodeKey === 'string' && nodeKey !== 'root' && (
              <>
                <span className="json-key">"{nodeKey}"</span>
                <span className="json-colon">: </span>
              </>
            )}
            {typeof nodeKey === 'number' && (
              <>
                <span className="json-index">{nodeKey}:</span>
                <span className="json-colon"> </span>
              </>
            )}
            {!expanded && <span className="collapsed-indicator">[{itemCount}]</span>}
            <span className="json-bracket">[</span>
            {!expanded && (
              <>
                <span className="json-bracket">]</span>
                {!isLast && <span className="json-comma">,</span>}
              </>
            )}
          </div>
        </div>

        {expanded && (
          <>
            <div className="tree-children">
              {data.map((item: any, idx: number) => (
                <TreeNode
                  key={`${currentPath}[${idx}]`}
                  data={item}
                  nodeKey={idx}
                  level={level + 1}
                  path={currentPath}
                  isLast={idx === data.length - 1}
                  expandedNodes={expandedNodes}
                  toggleNode={toggleNode}
                  isExpanded={isExpanded}
                />
              ))}
            </div>
            <div className="tree-row">
              <div className="tree-indent" style={{ width: indent }} />
              <div className="tree-content">
                <span className="json-bracket">]</span>
                {!isLast && <span className="json-comma">,</span>}
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  const keys = Object.keys(data)
  const expanded = isExpanded(currentPath, level < 2)
  const keyCount = keys.length

  if (keyCount === 0) {
    return (
      <div className="tree-row">
        <div className="tree-indent" style={{ width: indent }} />
        <div className="tree-content">
          {typeof nodeKey === 'string' && nodeKey !== 'root' && (
            <>
              <span className="json-key">"{nodeKey}"</span>
              <span className="json-colon">: </span>
            </>
          )}
          {typeof nodeKey === 'number' && (
            <>
              <span className="json-index">{nodeKey}:</span>
              <span className="json-colon"> </span>
            </>
          )}
          <span className="json-bracket">{'{}'}</span>
          {!isLast && <span className="json-comma">,</span>}
        </div>
      </div>
    )
  }

  return (
    <div className="tree-node">
      <div className="tree-row">
        <div className="tree-indent" style={{ width: indent }} />
        <div className="tree-content">
          <button className="expand-btn" onClick={() => toggleNode(currentPath)}>
            {expanded ? '−' : '+'}
          </button>
          {typeof nodeKey === 'string' && nodeKey !== 'root' && (
            <>
              <span className="json-key">"{nodeKey}"</span>
              <span className="json-colon">: </span>
            </>
          )}
          {typeof nodeKey === 'number' && (
            <>
              <span className="json-index">{nodeKey}:</span>
              <span className="json-colon"> </span>
            </>
          )}
          {!expanded && (
            <span className="collapsed-indicator">
              {'{'}{keyCount}{'}'}
            </span>
          )}
          <span className="json-bracket">{'{'}</span>
          {!expanded && (
            <>
              <span className="json-bracket">{'}'}</span>
              {!isLast && <span className="json-comma">,</span>}
            </>
          )}
        </div>
      </div>

      {expanded && (
        <>
          <div className="tree-children">
            {keys.map((k, idx) => (
              <TreeNode
                key={`${currentPath}.${k}`}
                data={data[k]}
                nodeKey={k}
                level={level + 1}
                path={currentPath}
                isLast={idx === keys.length - 1}
                expandedNodes={expandedNodes}
                toggleNode={toggleNode}
                isExpanded={isExpanded}
              />
            ))}
          </div>
          <div className="tree-row">
            <div className="tree-indent" style={{ width: indent }} />
            <div className="tree-content">
              <span className="json-bracket">{'}'}</span>
              {!isLast && <span className="json-comma">,</span>}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default JSONTreeView
