import { useState } from 'react'
import '../../common/ToolStyles.css'

const currencies = [
  { code: 'CNY', name: '人民币', symbol: '¥', rate: 1 },
  { code: 'USD', name: '美元', symbol: '$', rate: 0.14 },
  { code: 'EUR', name: '欧元', symbol: '€', rate: 0.13 },
  { code: 'JPY', name: '日元', symbol: '¥', rate: 20.5 },
  { code: 'GBP', name: '英镑', symbol: '£', rate: 0.11 },
  { code: 'KRW', name: '韩元', symbol: '₩', rate: 182.5 },
  { code: 'HKD', name: '港币', symbol: '$', rate: 1.09 },
  { code: 'TWD', name: '新台币', symbol: 'NT$', rate: 4.35 }
]

function CurrencyConverter() {
  const [amount, setAmount] = useState('100')
  const [fromCurrency, setFromCurrency] = useState('CNY')
  const [toCurrency, setToCurrency] = useState('USD')
  
  const fromRate = currencies.find(c => c.code === fromCurrency)?.rate || 1
  const toRate = currencies.find(c => c.code === toCurrency)?.rate || 1
  const result = (parseFloat(amount) || 0) * (toRate / fromRate)
  const toSymbol = currencies.find(c => c.code === toCurrency)?.symbol || ''
  
  return (
    <div className="tool-page">
      <div className="tool-header">
        <div className="tool-header-icon">💱</div>
        <h2>汇率换算</h2>
        <p>实时汇率货币转换</p>
      </div>
      
      <div className="tool-card-container">
        <div className="tool-input-group">
          <label>金额</label>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="输入金额"
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', marginBottom: '20px' }}>
          <div className="tool-input-group">
            <label>从</label>
            <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
              {currencies.map(c => (
                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '8px' }}>
            <button 
              className="tool-button secondary"
              onClick={() => {
                setFromCurrency(toCurrency)
                setToCurrency(fromCurrency)
              }}
            >
              ⇄
            </button>
          </div>
          
          <div className="tool-input-group">
            <label>到</label>
            <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
              {currencies.map(c => (
                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="tool-result">
          <div className="tool-result-label">换算结果</div>
          <div className="tool-result-value" style={{ fontSize: '28px', fontWeight: 600 }}>
            {toSymbol}{result.toFixed(2)}
          </div>
        </div>
        
        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '12px', textAlign: 'center' }}>
          汇率仅供参考，实际以银行成交价为准
        </p>
      </div>
    </div>
  )
}

export default CurrencyConverter
