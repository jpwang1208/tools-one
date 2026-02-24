import { useState } from 'react'
import '../../common/ToolStyles.css'

function TaxCalculator() {
  const [salary, setSalary] = useState('10000')
  const [deduction, setDeduction] = useState('5000')
  
  const taxableIncome = Math.max(0, (parseFloat(salary) || 0) - (parseFloat(deduction) || 0))
  
  const calculateTax = (income: number) => {
    if (income <= 0) return 0
    if (income <= 3000) return income * 0.03
    if (income <= 12000) return income * 0.1 - 210
    if (income <= 25000) return income * 0.2 - 1410
    if (income <= 35000) return income * 0.25 - 2660
    if (income <= 55000) return income * 0.3 - 4410
    if (income <= 80000) return income * 0.35 - 7160
    return income * 0.45 - 15160
  }
  
  const tax = calculateTax(taxableIncome)
  const netIncome = (parseFloat(salary) || 0) - tax
  
  return (
    <div className="tool-page">
      <div className="tool-header">
        <div className="tool-header-icon">💰</div>
        <h2>个税计算器</h2>
        <p>工资个人所得税计算</p>
      </div>
      
      <div className="tool-card-container">
        <div className="tool-input-group">
          <label>税前工资 (元)</label>
          <input 
            type="number" 
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="输入税前工资"
          />
        </div>
        
        <div className="tool-input-group">
          <label>五险一金等扣除 (元)</label>
          <input 
            type="number" 
            value={deduction}
            onChange={(e) => setDeduction(e.target.value)}
            placeholder="输入扣除金额"
          />
        </div>
        
        <div className="tool-result">
          <div className="tool-result-label">应纳税所得额</div>
          <div className="tool-result-value">¥{taxableIncome.toFixed(2)}</div>
        </div>
        
        <div className="tool-result">
          <div className="tool-result-label">应缴个税</div>
          <div className="tool-result-value" style={{ color: '#ef4444' }}>¥{tax.toFixed(2)}</div>
        </div>
        
        <div className="tool-result">
          <div className="tool-result-label">税后收入</div>
          <div className="tool-result-value" style={{ color: '#10b981' }}>¥{netIncome.toFixed(2)}</div>
        </div>
      </div>
    </div>
  )
}

export default TaxCalculator
