import { useState } from 'react'
import './BMICalculator.css'

function BMICalculator() {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [bmi, setBmi] = useState<number | null>(null)
  const [category, setCategory] = useState('')

  const calculateBMI = () => {
    const h = parseFloat(height) / 100
    const w = parseFloat(weight)
    
    if (h > 0 && w > 0) {
      const bmiValue = w / (h * h)
      setBmi(parseFloat(bmiValue.toFixed(1)))
      
      if (bmiValue < 18.5) {
        setCategory('偏瘦')
      } else if (bmiValue < 24) {
        setCategory('正常')
      } else if (bmiValue < 28) {
        setCategory('偏胖')
      } else {
        setCategory('肥胖')
      }
    }
  }

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case '偏瘦': return '#f59e0b'
      case '正常': return '#10b981'
      case '偏胖': return '#f97316'
      case '肥胖': return '#ef4444'
      default: return '#9ca3af'
    }
  }

  return (
    <div className="bmi-tool">
      <div className="bmi-header">
        <h2>BMI 计算器</h2>
        <p>计算您的身体质量指数</p>
      </div>

      <div className="bmi-content">
        <div className="input-group">
          <label>身高 (cm)</label>
          <input
            type="number"
            placeholder="例如: 175"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>体重 (kg)</label>
          <input
            type="number"
            placeholder="例如: 70"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>

        <button className="calculate-btn" onClick={calculateBMI}>
          计算 BMI
        </button>

        {bmi !== null && (
          <div className="result-card">
            <div className="bmi-value" style={{ color: getCategoryColor(category) }}>
              {bmi}
            </div>
            <div className="bmi-category" style={{ color: getCategoryColor(category) }}>
              {category}
            </div>
            <div className="bmi-scale">
              <div className="scale-bar">
                <div 
                  className="scale-indicator" 
                  style={{ 
                    left: `${Math.min(Math.max((bmi - 15) / 20 * 100, 0), 100)}%`,
                    backgroundColor: getCategoryColor(category)
                  }}
                />
              </div>
              <div className="scale-labels">
                <span>偏瘦</span>
                <span>正常</span>
                <span>偏胖</span>
                <span>肥胖</span>
              </div>
            </div>
          </div>
        )}

        <div className="reference-table">
          <h3>BMI 参考标准</h3>
          <table>
            <tbody>
              <tr>
                <td style={{ color: '#f59e0b' }}>偏瘦</td>
                <td>&lt; 18.5</td>
              </tr>
              <tr>
                <td style={{ color: '#10b981' }}>正常</td>
                <td>18.5 - 23.9</td>
              </tr>
              <tr>
                <td style={{ color: '#f97316' }}>偏胖</td>
                <td>24.0 - 27.9</td>
              </tr>
              <tr>
                <td style={{ color: '#ef4444' }}>肥胖</td>
                <td>≥ 28.0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default BMICalculator
