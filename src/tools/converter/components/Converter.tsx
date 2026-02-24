import { useState } from 'react'
import './Converter.css'

interface ConversionType {
  id: string
  name: string
  units: { id: string; name: string; rate: number }[]
}

const conversionTypes: ConversionType[] = [
  {
    id: 'length',
    name: '长度',
    units: [
      { id: 'm', name: '米 (m)', rate: 1 },
      { id: 'km', name: '千米 (km)', rate: 1000 },
      { id: 'cm', name: '厘米 (cm)', rate: 0.01 },
      { id: 'mm', name: '毫米 (mm)', rate: 0.001 },
      { id: 'inch', name: '英寸 (in)', rate: 0.0254 },
      { id: 'ft', name: '英尺 (ft)', rate: 0.3048 },
      { id: 'yd', name: '码 (yd)', rate: 0.9144 },
      { id: 'mi', name: '英里 (mi)', rate: 1609.344 }
    ]
  },
  {
    id: 'weight',
    name: '重量',
    units: [
      { id: 'kg', name: '千克 (kg)', rate: 1 },
      { id: 'g', name: '克 (g)', rate: 0.001 },
      { id: 'mg', name: '毫克 (mg)', rate: 0.000001 },
      { id: 'lb', name: '磅 (lb)', rate: 0.45359237 },
      { id: 'oz', name: '盎司 (oz)', rate: 0.02834952 },
      { id: 't', name: '吨 (t)', rate: 1000 }
    ]
  },
  {
    id: 'temperature',
    name: '温度',
    units: [
      { id: 'c', name: '摄氏度 (°C)', rate: 1 },
      { id: 'f', name: '华氏度 (°F)', rate: 1 },
      { id: 'k', name: '开尔文 (K)', rate: 1 }
    ]
  },
  {
    id: 'area',
    name: '面积',
    units: [
      { id: 'm2', name: '平方米 (m²)', rate: 1 },
      { id: 'km2', name: '平方千米 (km²)', rate: 1000000 },
      { id: 'cm2', name: '平方厘米 (cm²)', rate: 0.0001 },
      { id: 'ha', name: '公顷 (ha)', rate: 10000 },
      { id: 'acre', name: '英亩 (acre)', rate: 4046.8564224 },
      { id: 'ft2', name: '平方英尺 (ft²)', rate: 0.09290304 }
    ]
  },
  {
    id: 'volume',
    name: '体积',
    units: [
      { id: 'l', name: '升 (L)', rate: 1 },
      { id: 'ml', name: '毫升 (mL)', rate: 0.001 },
      { id: 'm3', name: '立方米 (m³)', rate: 1000 },
      { id: 'gal', name: '加仑 (gal)', rate: 3.78541178 },
      { id: 'qt', name: '夸脱 (qt)', rate: 0.946352946 },
      { id: 'pt', name: '品脱 (pt)', rate: 0.473176473 }
    ]
  }
]

function Converter() {
  const [activeType, setActiveType] = useState('length')
  const [inputValue, setInputValue] = useState('1')
  const [fromUnit, setFromUnit] = useState('m')
  const [toUnit, setToUnit] = useState('km')
  const [result, setResult] = useState('0.001')

  const currentType = conversionTypes.find(t => t.id === activeType) || conversionTypes[0]

  const convert = (value: number, from: string, to: string, type: string) => {
    if (type === 'temperature') {
      if (from === 'c' && to === 'f') return (value * 9/5) + 32
      if (from === 'c' && to === 'k') return value + 273.15
      if (from === 'f' && to === 'c') return (value - 32) * 5/9
      if (from === 'f' && to === 'k') return (value - 32) * 5/9 + 273.15
      if (from === 'k' && to === 'c') return value - 273.15
      if (from === 'k' && to === 'f') return (value - 273.15) * 9/5 + 32
      return value
    }

    const fromRate = currentType.units.find(u => u.id === from)?.rate || 1
    const toRate = currentType.units.find(u => u.id === to)?.rate || 1
    return (value * fromRate) / toRate
  }

  const handleConvert = () => {
    const value = parseFloat(inputValue) || 0
    const converted = convert(value, fromUnit, toUnit, activeType)
    setResult(converted.toFixed(6).replace(/\.?0+$/, ''))
  }

  const handleSwap = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    handleConvert()
  }

  return (
    <div className="converter-tool">
      <div className="converter-header">
        <h2>单位换算</h2>
        <p>长度、重量、温度、面积、体积等单位转换</p>
      </div>

      <div className="converter-tabs">
        {conversionTypes.map(type => (
          <button
            key={type.id}
            className={`tab-btn ${activeType === type.id ? 'active' : ''}`}
            onClick={() => {
              setActiveType(type.id)
              setFromUnit(type.units[0].id)
              setToUnit(type.units[1].id)
              handleConvert()
            }}
          >
            {type.name}
          </button>
        ))}
      </div>

      <div className="converter-content">
        <div className="input-group">
          <label>数值</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              const val = parseFloat(e.target.value) || 0
              const converted = convert(val, fromUnit, toUnit, activeType)
              setResult(converted.toFixed(6).replace(/\.?0+$/, ''))
            }}
            className="number-input"
          />
        </div>

        <div className="unit-selectors">
          <div className="unit-group">
            <label>从</label>
            <select
              value={fromUnit}
              onChange={(e) => {
                setFromUnit(e.target.value)
                const val = parseFloat(inputValue) || 0
                const converted = convert(val, e.target.value, toUnit, activeType)
                setResult(converted.toFixed(6).replace(/\.?0+$/, ''))
              }}
            >
              {currentType.units.map(unit => (
                <option key={unit.id} value={unit.id}>{unit.name}</option>
              ))}
            </select>
          </div>

          <button className="swap-btn" onClick={handleSwap} title="交换单位">
            ⇄
          </button>

          <div className="unit-group">
            <label>到</label>
            <select
              value={toUnit}
              onChange={(e) => {
                setToUnit(e.target.value)
                const val = parseFloat(inputValue) || 0
                const converted = convert(val, fromUnit, e.target.value, activeType)
                setResult(converted.toFixed(6).replace(/\.?0+$/, ''))
              }}
            >
              {currentType.units.map(unit => (
                <option key={unit.id} value={unit.id}>{unit.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="result-section">
          <label>转换结果</label>
          <div className="result-display">
            <span className="result-value">{result}</span>
            <span className="result-unit">{currentType.units.find(u => u.id === toUnit)?.name}</span>
          </div>
        </div>

        <button 
          className="copy-btn"
          onClick={() => {
            navigator.clipboard.writeText(result)
          }}
        >
          📋 复制结果
        </button>
      </div>
    </div>
  )
}

export default Converter
