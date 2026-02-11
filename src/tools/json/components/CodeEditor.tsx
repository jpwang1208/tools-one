import { useRef, useEffect, forwardRef } from 'react'
import './CodeEditor.css'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

function highlightJSON(json: string): string {
  if (!json) return ''

  // 先进行HTML转义
  let result = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // 使用占位符来标记key，避免被后续的字符串替换匹配到
  const keyPlaceholders: string[] = []
  result = result.replace(/("(?:\\.|[^"\\])*")(\s*:)/g, (_match, p1, p2) => {
    keyPlaceholders.push(`<span class="editor-key">${p1}</span><span class="editor-colon">${p2}</span>`)
    return `__KEY_PLACEHOLDER_${keyPlaceholders.length - 1}__`
  })

  // 处理剩余的字符串
  result = result.replace(/("(?:\\.|[^"\\])*")/g, '<span class="editor-string">$1</span>')

  // 恢复key占位符
  keyPlaceholders.forEach((placeholder, index) => {
    result = result.replace(`__KEY_PLACEHOLDER_${index}__`, placeholder)
  })

  // Numbers
  result = result.replace(/\b(-?\d+\.?\d*)\b/g, '<span class="editor-number">$1</span>')
  // Booleans and null
  result = result.replace(/\b(true|false|null)\b/g, '<span class="editor-boolean">$1</span>')
  // Brackets and punctuation
  result = result.replace(/([{}[\],])/g, '<span class="editor-punctuation">$1</span>')

  return result
}

const CodeEditor = forwardRef<HTMLTextAreaElement, CodeEditorProps>(
  function CodeEditor({ value, onChange, placeholder }, ref) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const highlightRef = useRef<HTMLPreElement>(null)

    useEffect(() => {
      if (highlightRef.current) {
        highlightRef.current.innerHTML =
          highlightJSON(value) || '<span class="editor-placeholder">' + (placeholder || '') + '</span>'
      }
    }, [value, placeholder])

    const handleScroll = () => {
      if (textareaRef.current && highlightRef.current) {
        highlightRef.current.scrollTop = textareaRef.current.scrollTop
      }
    }

    return (
      <div className="code-editor">
        <pre 
          ref={highlightRef} 
          className="code-editor-highlight" 
          aria-hidden="true"
        />
        <textarea
          ref={(el) => {
            textareaRef.current = el
            if (typeof ref === 'function') {
              ref(el)
            } else if (ref) {
              ref.current = el
            }
          }}
          className="code-editor-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          spellCheck={false}
        />
      </div>
    )
  }
)

export default CodeEditor
