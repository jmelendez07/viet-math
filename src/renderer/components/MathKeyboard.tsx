import React from 'react';
import '../MathKeyboard.css';

interface MathKeyboardProps {
  onInsert: (value: string) => void;
}

const MathKeyboard: React.FC<MathKeyboardProps> = ({ onInsert }) => {
  const basicOperators = [
    { label: '+', value: '+' },
    { label: '−', value: '-' },
    { label: '×', value: '*' },
    { label: '÷', value: '/' },
    { label: '^', value: '^' },
    { label: '( )', value: '()' },
  ];

  const functions = [
    { label: 'sin', value: 'sin(' },
    { label: 'cos', value: 'cos(' },
    { label: 'tan', value: 'tan(' },
    { label: 'asin', value: 'asin(' },
    { label: 'acos', value: 'acos(' },
    { label: 'atan', value: 'atan(' },
  ];

  const hyperbolic = [
    { label: 'sinh', value: 'sinh(' },
    { label: 'cosh', value: 'cosh(' },
    { label: 'tanh', value: 'tanh(' },
    { label: 'asinh', value: 'asinh(' },
    { label: 'acosh', value: 'acosh(' },
    { label: 'atanh', value: 'atanh(' },
  ];

  const advanced = [
    { label: 'log', value: 'log(' },
    { label: 'ln', value: 'ln(' },
    { label: 'exp', value: 'exp(' },
    { label: 'sqrt', value: 'sqrt(' },
    { label: 'pow', value: 'pow(', tooltip: 'pow(base,exp)' },
    { label: 'root', value: 'root(' },
  ];

  const constants = [
    { label: 'π', value: 'pi' },
    { label: 'e', value: 'e' },
    { label: 'x', value: 'x' },
    { label: 'n', value: 'n' },
  ];

  const special = [
    { label: 'Mod', value: ' Mod ' },
    { label: '!', value: '!' },
    { label: 'Σ', value: 'Sigma(', tooltip: 'Sigma(from,to,n)' },
    { label: 'Π', value: 'Pi(', tooltip: 'Pi(from,to,n)' },
    { label: 'C', value: 'C', tooltip: 'nCr: 4C2' },
    { label: 'P', value: 'P', tooltip: 'nPr: 4P2' },
  ];

  return (
    <div className="math-keyboard">
      <div className="keyboard-section">
        <div className="section-title">Operadores Básicos</div>
        <div className="keyboard-row">
          {basicOperators.map((op, index) => (
            <button
              key={index}
              className="keyboard-btn"
              onClick={() => onInsert(op.value)}
              title={op.value}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      <div className="keyboard-section">
        <div className="section-title">Funciones Trigonométricas</div>
        <div className="keyboard-row">
          {functions.map((fn, index) => (
            <button
              key={index}
              className="keyboard-btn keyboard-btn-function"
              onClick={() => onInsert(fn.value)}
            >
              {fn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="keyboard-section">
        <div className="section-title">Funciones Hiperbólicas</div>
        <div className="keyboard-row">
          {hyperbolic.map((fn, index) => (
            <button
              key={index}
              className="keyboard-btn keyboard-btn-function"
              onClick={() => onInsert(fn.value)}
            >
              {fn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="keyboard-section">
        <div className="section-title">Funciones Avanzadas</div>
        <div className="keyboard-row">
          {advanced.map((fn, index) => (
            <button
              key={index}
              className="keyboard-btn keyboard-btn-advanced"
              onClick={() => onInsert(fn.value)}
              title={fn.tooltip}
            >
              {fn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="keyboard-section">
        <div className="section-title">Constantes y Variables</div>
        <div className="keyboard-row">
          {constants.map((c, index) => (
            <button
              key={index}
              className="keyboard-btn keyboard-btn-constant"
              onClick={() => onInsert(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="keyboard-section">
        <div className="section-title">Especiales</div>
        <div className="keyboard-row">
          {special.map((sp, index) => (
            <button
              key={index}
              className="keyboard-btn keyboard-btn-special"
              onClick={() => onInsert(sp.value)}
              title={sp.tooltip}
            >
              {sp.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MathKeyboard;
