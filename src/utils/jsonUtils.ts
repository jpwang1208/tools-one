interface JSONResult {
  success: boolean
  data?: string
  error?: string
}

export function formatJSON(json: string, indent: number = 2): JSONResult {
  try {
    const parsed = JSON.parse(json)
    const indentStr = indent === 0 ? '\t' : ' '.repeat(indent)
    const formatted = JSON.stringify(parsed, null, indentStr)
    return { success: true, data: formatted }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Invalid JSON' 
    }
  }
}

export function validateJSON(json: string): JSONResult {
  try {
    JSON.parse(json)
    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Invalid JSON' 
    }
  }
}

export function minifyJSON(json: string): JSONResult {
  try {
    const parsed = JSON.parse(json)
    const minified = JSON.stringify(parsed)
    return { success: true, data: minified }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Invalid JSON' 
    }
  }
}

export function sortJSON(json: string, indent: number = 2): JSONResult {
  try {
    const parsed = JSON.parse(json)
    const sorted = sortObjectKeys(parsed)
    const indentStr = indent === 0 ? '\t' : ' '.repeat(indent)
    const formatted = JSON.stringify(sorted, null, indentStr)
    return { success: true, data: formatted }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Invalid JSON' 
    }
  }
}

function sortObjectKeys(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys)
  }
  
  const sorted: { [key: string]: any } = {}
  Object.keys(obj).sort().forEach(key => {
    sorted[key] = sortObjectKeys(obj[key])
  })
  return sorted
}

export function escapeJSON(json: string): JSONResult {
  try {
    const escaped = JSON.stringify(json).slice(1, -1)
    return { success: true, data: escaped }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Escape failed' 
    }
  }
}

export function unescapeJSON(escaped: string): JSONResult {
  try {
    const unescaped = JSON.parse('"' + escaped + '"')
    return { success: true, data: unescaped }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unescape failed' 
    }
  }
}

export function toUnicode(text: string): string {
  return text.replace(/[\u007f-\uffff]/g, (char) => {
    return '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4)
  })
}

export function fromUnicode(unicode: string): string {
  return unicode.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
    return String.fromCharCode(parseInt(hex, 16))
  })
}

export function parseJSONSafely(json: string): any | null {
  try {
    return JSON.parse(json)
  } catch {
    return null
  }
}
