import './SyntaxHighlighter.css'

interface SyntaxHighlighterProps {
  code: string
}

function SyntaxHighlighter({ code }: SyntaxHighlighterProps) {
  if (!code) {
    return <div className="syntax-highlighter empty">结果将显示在这里...</div>
  }

  const highlighted = highlightJSON(code)

  return (
    <pre className="syntax-highlighter">
      <code dangerouslySetInnerHTML={{ __html: highlighted }} />
    </pre>
  )
}

function highlightJSON(json: string): string {
  // Simple syntax highlighting
  // 先进行HTML转义
  let result = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // 使用占位符来标记key，避免被后续的字符串替换匹配到
  const keyPlaceholders: string[] = []
  result = result.replace(/("(?:\\.|[^"\\])*")(\s*:)/g, (_match, p1, p2) => {
    keyPlaceholders.push(`<span class="json-key">${p1}</span><span class="json-colon">${p2}</span>`)
    return `__KEY_PLACEHOLDER_${keyPlaceholders.length - 1}__`
  })

  // 处理剩余的字符串
  result = result.replace(/("(?:\\.|[^"\\])*")/g, '<span class="json-string">$1</span>')

  // 恢复key占位符
  keyPlaceholders.forEach((placeholder, index) => {
    result = result.replace(`__KEY_PLACEHOLDER_${index}__`, placeholder)
  })

  // Numbers
  result = result.replace(/\b(-?\d+\.?\d*)\b/g, '<span class="json-number">$1</span>')
  // Booleans and null
  result = result.replace(/\b(true|false|null)\b/g, '<span class="json-boolean">$1</span>')
  // Brackets and punctuation
  result = result.replace(/([{}[\],])/g, '<span class="json-punctuation">$1</span>')

  return result
}

export default SyntaxHighlighter