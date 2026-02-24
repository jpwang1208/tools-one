import { useState } from 'react'
import './Calculator.css'

function Calculator() {
  const [display, setDisplay] = useState('0')
  const [prevValue, setPrevValue] = useState<string | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? num : display + num)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }

  const clear = () => {
    setDisplay('0')
    setPrevValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display)

    if (prevValue === null) {
      setPrevValue(display)
    } else if (operation) {
      const currentValue = parseFloat(prevValue) || 0
      const newValue = calculate(currentValue, inputValue, operation)
      
      setDisplay(String(newValue))
      setPrevValue(String(newValue))
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '×':
        return firstValue * secondValue
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0
      case '%':
        return firstValue % secondValue
      default:
        return secondValue
    }
  }

  const performCalculation = () => {
    const inputValue = parseFloat(display)

    if (prevValue !== null && operation) {
      const currentValue = parseFloat(prevValue) || 0
      const newValue = calculate(currentValue, inputValue, operation)
      
      setDisplay(String(newValue))
      setPrevValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const buttons = [
    { label: 'C', type: 'clear', action: clear },
    { label: '⌫', type: 'backspace', action: () => setDisplay(display.length > 1 ? display.slice(0, -1) : '0') },
    { label: '%', type: 'operator', action: () => performOperation('%') },
    { label: '÷', type: 'operator', action: () => performOperation('÷') },
    { label: '7', type: 'number', action: () => inputNumber('7') },
    { label: '8', type: 'number', action: () => inputNumber('8') },
    { label: '9', type: 'number', action: () => inputNumber('9') },
    { label: '×', type: 'operator', action: () => performOperation('×') },
    { label: '4', type: 'number', action: () => inputNumber('4') },
    { label: '5', type: 'number', action: () => inputNumber('5') },
    { label: '6', type: 'number', action: () => inputNumber('6') },
    { label: '-', type: 'operator', action: () => performOperation('-') },
    { label: '1', type: 'number', action: () => inputNumber('1') },
    { label: '2', type: 'number', action: () => inputNumber('2') },
    { label: '3', type: 'number', action: () => inputNumber('3') },
    { label: '+', type: 'operator', action: () => performOperation('+') },
    { label: '0', type: 'number zero', action: () => inputNumber('0') },
    { label: '.', type: 'number', action: inputDecimal },
    { label: '=', type: 'equals', action: performCalculation },
  ]

  return (
    <div className="calculator-tool">
      <div className="calculator-header">
        <h2>计算器</h2>
        <p>科学计算器</p>
      </div>

      <div className="calculator-container">
        <div className="calculator-display">
          <div className="display-operation">
            {prevValue} {operation}
          </div>
          <div className="display-value">{display}</div>
        </div>

        <div className="calculator-buttons">
          {buttons.map((btn, index) => (
            <button
              key={index}
              className={`calc-btn ${btn.type} ${btn.type === 'zero' ? 'zero' : ''}`}
              onClick={btn.action}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Calculator
