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
    { label: 'sin', value: 'sin(', tooltip: 'sin(x)' },
    { label: 'cos', value: 'cos(', tooltip: 'cos(x)' },
    { label: 'tan', value: 'tan(', tooltip: 'tan(x)' },
    { label: 'sin⁻¹', value: 'asin(', tooltip: 'asin(x) - arcoseno' },
    { label: 'cos⁻¹', value: 'acos(', tooltip: 'acos(x) - arcocoseno' },
    { label: 'tan⁻¹', value: 'atan(', tooltip: 'atan(x) - arcotangente' },
  ];

  const hyperbolic = [
    { label: 'sinh', value: 'sinh(', tooltip: 'sinh(x) - seno hiperbólico' },
    { label: 'cosh', value: 'cosh(', tooltip: 'cosh(x) - coseno hiperbólico' },
    { label: 'tanh', value: 'tanh(', tooltip: 'tanh(x) - tangente hiperbólica' },
    { label: 'sinh⁻¹', value: 'asinh(', tooltip: 'asinh(x) - arcoseno hiperbólico' },
    { label: 'cosh⁻¹', value: 'acosh(', tooltip: 'acosh(x) - arcocoseno hiperbólico' },
    { label: 'tanh⁻¹', value: 'atanh(', tooltip: 'atanh(x) - arcotangente hiperbólica' },
  ];

  const advanced = [
    { label: 'log', value: 'log(', tooltip: 'log₁₀(x) - logaritmo base 10' },
    { label: 'ln', value: 'ln(', tooltip: 'ln(x) - logaritmo natural' },
    { label: 'eˣ', value: 'exp(', tooltip: 'exp(x) - exponencial' },
    { label: '√', value: 'sqrt(', tooltip: 'sqrt(x) - raíz cuadrada' },
    { label: 'xʸ', value: 'pow(', tooltip: 'pow(base,exp) - potencia' },
    { label: 'ⁿ√', value: 'root(', tooltip: 'root(x,n) - raíz n-ésima' },
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
