import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import './AppLayout.css';
import './MathKeyboard.css';
import { useState, useEffect, useRef } from 'react';
import Graph from './components/Graph';
import ExerciseList, { Exercise } from './components/ExerciseList';
import MathKeyboard from './components/MathKeyboard';
import { calculateTrapezoidal, TrapezoidalOutput } from '../main/server/Trapezoidal';
import { calculateBoole, BooleOutput } from '../main/server/Boole';
import { calculateSimpson, SimpsonOutput } from '../main/server/Simpson';
import { calculateSimpson13, Simpson13Output } from '../main/server/Simpson13';
import { calculateSimpsonAbierto, SimpsonAbiertoOutput } from '../main/server/SimpsonAbierto';

// Interfaz genérica para una iteración, ya que todas son iguales
interface Iteration {
  x: number;
  y: number;
}

// Convertir expresión matemática simple a LaTeX
function toLatex(expr: string): string {
  if (!expr || expr.trim() === '') return '';
  
  let latex = expr;
  
  // Remover Math. antes de las funciones
  latex = latex.replace(/Math\./g, '');
  
  // Funciones trigonométricas y matemáticas -> LaTeX
  const mathFuncs = [
    'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
    'asin', 'acos', 'atan',
    'sinh', 'cosh', 'tanh',
    'ln', 'exp', 'sqrt'
  ];
  
  mathFuncs.forEach(func => {
    const regex = new RegExp(`\\b${func}\\b`, 'g');
    latex = latex.replace(regex, `\\${func}`);
  });

  // Manejar log y log10 específicamente
  latex = latex.replace(/\blog10\b/g, '\\log_{10}');
  latex = latex.replace(/\blog\b/g, '\\log_{10}');
  
  // Exponenciación ANTES de división: x^2 -> x^{2}, x^(a+b) -> x^{a+b}
  latex = latex.replace(/\^(\d+)/g, '^{$1}');
  latex = latex.replace(/\^(\([^)]+\))/g, '^{$1}');
  latex = latex.replace(/\^([a-zA-Z])/g, '^{$1}');
  
  // Multiplicación: * -> \cdot (pero no en operaciones implícitas)
  latex = latex.replace(/\s*\*\s*/g, ' \\cdot ');
  
  // División: Convertir a/b a \frac{a}{b}
  // Función auxiliar para encontrar paréntesis balanceados
  const convertDivisionToFrac = (str: string): string => {
    let result = str;
    let changed = true;
    
    while (changed) {
      changed = false;
      // Buscar patrón: (expresión)/(expresión) o número/expresión o expresión/número
      const divRegex = /(\d+(?:\.\d+)?|[a-zA-Z]+(?:\{[^}]*\})?|\([^()]*(?:\([^()]*\)[^()]*)*\))\s*\/\s*(\d+(?:\.\d+)?|[a-zA-Z]+(?:\{[^}]*\})?|\([^()]*(?:\([^()]*\)[^()]*)*\)|\\[a-z]+\([^)]*\))/;
      
      if (divRegex.test(result)) {
        result = result.replace(divRegex, '\\frac{$1}{$2}');
        changed = true;
      }
    }
    
    return result;
  };
  
  latex = convertDivisionToFrac(latex);
  
  return latex;
}

const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: '1',
    name: 'Función seno',
    funcStr: 'sin(x)',
    funcLatex: '\\sin(x)',
    a: '0',
    b: '3.14159',
    n: '12',
    method: 'simpson13',
  },
  {
    id: '2',
    name: 'Cúbica',
    funcStr: 'x^3 - 2*x',
    funcLatex: 'x^{3} - 2 \\cdot x',
    a: '-1',
    b: '2',
    n: '12',
    method: 'simpson',
  },
];

function Calculator() {
  const [exercises, setExercises] = useState<Exercise[]>(DEFAULT_EXERCISES);
  const [currentExerciseId, setCurrentExerciseId] = useState<string | null>('1');
  
  const currentExercise = exercises.find((ex) => ex.id === currentExerciseId);
  
  const [funcStr, setFuncStr] = useState(currentExercise?.funcStr || 'sin(x)');
  const [a, setA] = useState(currentExercise?.a || '0');
  const [b, setB] = useState(currentExercise?.b || '1');
  const [n, setN] = useState(currentExercise?.n || '12');
  const [method, setMethod] = useState(currentExercise?.method || 'trapezoidal');
  
  const [result, setResult] = useState<number | null>(null);
  const [iterations, setIterations] = useState<Iteration[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  
  const funcInputRef = useRef<HTMLInputElement>(null);

  // Update form when exercise changes
  useEffect(() => {
    if (currentExercise) {
      setFuncStr(currentExercise.funcStr);
      setA(currentExercise.a);
      setB(currentExercise.b);
      setN(currentExercise.n);
      setMethod(currentExercise.method);
      setResult(null);
      setIterations([]);
      setError(null);
    }
  }, [currentExerciseId]);

  // Save current state to exercise when inputs change
  useEffect(() => {
    if (currentExerciseId) {
      setExercises((prev) =>
        prev.map((ex) =>
          ex.id === currentExerciseId
            ? { ...ex, funcStr, funcLatex: toLatex(funcStr), a, b, n, method }
            : ex
        )
      );
    }
  }, [funcStr, a, b, n, method, currentExerciseId]);

  // Trigger MathJax when funcStr changes
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).MathJax) {
      (window as any).MathJax.typesetPromise?.().catch((err: any) => console.log('MathJax error:', err));
    }
  }, [funcStr]);

  // Clear results when function or parameters change
  useEffect(() => {
    setResult(null);
    setIterations([]);
    setError(null);
  }, [funcStr, a, b, n, method]);

  // Helper function to parse values that may contain 'pi', 'sqrt', etc.
  const parseValue = (value: string): number => {
    if (!value) return NaN;
    
    let processedValue = value.trim().toLowerCase();
    
    // Replace 'pi' with Math.PI value
    processedValue = processedValue.replace(/\bpi\b/g, 'Math.PI');
    processedValue = processedValue.replace(/\be\b/g, 'Math.E');
    
    // Add Math. prefix to mathematical functions
    const mathFunctions = ['sqrt', 'cbrt', 'abs', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 
                          'sinh', 'cosh', 'tanh', 'exp', 'log', 'log10', 'pow', 'ceil', 'floor', 'round'];
    
    mathFunctions.forEach(func => {
      const regex = new RegExp(`(?<!Math\\.)\\b${func}\\b`, 'g');
      processedValue = processedValue.replace(regex, `Math.${func}`);
    });
    
    // Handle log as log10
    processedValue = processedValue.replace(/\bMath\.log\b(?!\d)/g, 'Math.log10');
    
    // Evaluate expressions like '2*pi', 'pi/2', 'sqrt(3)', etc.
    try {
      // Allow numbers, operators, parentheses, dots, letters (for Math functions), and whitespace
      if (/[^0-9+\-*/().a-zA-Z\s]/g.test(processedValue)) {
        return NaN;
      }
      // Additional security: ensure it only contains Math. prefixed functions
      if (!/^[\d+\-*/().\s]*$/.test(processedValue) && !/Math\./i.test(processedValue)) {
        return NaN;
      }
      // Use Function constructor to safely evaluate mathematical expressions
      return Function(`'use strict'; return (${processedValue})`)();
    } catch {
      return NaN;
    }
  };

  const handleCalculate = () => {
    setResult(null);
    setIterations([]);
    setError(null);

    const numA = parseValue(a);
    const numB = parseValue(b);
    const numN = parseInt(n, 10);

    if (isNaN(numA) || isNaN(numB) || isNaN(numN)) {
      setError('Por favor, introduce valores numéricos válidos para a, b y n.');
      return;
    }

    try {
      let output: TrapezoidalOutput | BooleOutput | SimpsonOutput | Simpson13Output | SimpsonAbiertoOutput;

      const input = {
        funcStr,
        a: numA,
        b: numB,
        n: numN,
      };

      switch (method) {
        case 'trapezoidal':
          output = calculateTrapezoidal(input);
          break;
        case 'boole':
          output = calculateBoole(input);
          break;
        case 'simpson':
          output = calculateSimpson(input);
          break;
        case 'simpson13':
          output = calculateSimpson13(input);
          break;
        case 'simpsonAbierto':
          output = calculateSimpsonAbierto(input);
          break;
        default:
          throw new Error('Método de integración no reconocido.');
      }

      setResult(output.integral);
      setIterations(output.iterations);

    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleAddExercise = () => {
    const newId = Date.now().toString();
    const newExercise: Exercise = {
      id: newId,
      name: `Ejercicio ${exercises.length + 1}`,
      funcStr: 'sin(x)',
      funcLatex: '\\sin(x)',
      a: '0',
      b: '1',
      n: '12',
      method: 'simpson13',
    };
    setExercises([...exercises, newExercise]);
    setCurrentExerciseId(newId);
  };

  const handleDeleteExercise = (id: string) => {
    if (exercises.length === 1) {
      alert('No puedes eliminar el último ejercicio');
      return;
    }
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
    if (currentExerciseId === id) {
      setCurrentExerciseId(exercises[0].id === id ? exercises[1].id : exercises[0].id);
    }
  };

  const handleRenameExercise = (id: string, newName: string) => {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, name: newName } : ex))
    );
  };

  const handleKeyboardInsert = (value: string) => {
    const input = funcInputRef.current;
    if (!input) return;

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const newValue = funcStr.substring(0, start) + value + funcStr.substring(end);
    
    setFuncStr(newValue);
    
    // Set cursor position after inserted text
    setTimeout(() => {
      const newPos = start + value.length;
      // For () move cursor inside parenthesis
      if (value === '()') {
        input.setSelectionRange(start + 1, start + 1);
      } else {
        input.setSelectionRange(newPos, newPos);
      }
      input.focus();
    }, 0);
  };

  const parsedA = parseValue(a);
  const parsedB = parseValue(b);

  return (
    <div className="app-layout">
      <div className="sidebar">
        <ExerciseList
          exercises={exercises}
          currentExerciseId={currentExerciseId}
          onSelectExercise={setCurrentExerciseId}
          onAddExercise={handleAddExercise}
          onDeleteExercise={handleDeleteExercise}
          onRenameExercise={handleRenameExercise}
        />
        
        <div className="config-section">
          <h2>Configuración</h2>
          <div className='control'>
          <label>
            Método de Integración:
            <select value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="trapezoidal">Método Trapezoidal</option>
              <option value="boole">Método de Boole</option>
              <option value="simpson">Método de Simpson 3/8</option>
              <option value="simpson13">Método de Simpson 1/3</option>
              <option value="simpsonAbierto">Método de Simpson Abierto</option>
            </select>
          </label>
        </div>
        <div className='control'>
          <label>
            Función f(x):
            <input
              ref={funcInputRef}
              type="text"
              placeholder="Ej: sin(x), x^2, cos(x)*x, tan(x)"
              value={funcStr}
              onChange={(e) => setFuncStr(e.target.value)}
            />
          </label>
          {funcStr && (
            <div className="latex-preview">
              <span className="latex-preview-label">Vista previa:</span>
              <span className="latex-preview-content">
                {`\\(${toLatex(funcStr)}\\)`}
              </span>
            </div>
          )}
          <button 
            className={`keyboard-toggle-btn ${showKeyboard ? 'active' : ''}`}
            onClick={() => setShowKeyboard(!showKeyboard)}
          >
            <span className="keyboard-icon">⌨️</span>
            {showKeyboard ? 'Ocultar Teclado' : 'Mostrar Teclado Matemático'}
          </button>
          {showKeyboard && <MathKeyboard onInsert={handleKeyboardInsert} />}
        </div>
        <div className='control-inline'>
          <label>
            a:
            <input type="text" placeholder="Ej: 0, pi, 2*pi" value={a} onChange={(e) => setA(e.target.value)} />
          </label>
          <label>
            b:
            <input type="text" placeholder="Ej: pi, pi/2, 2*pi" value={b} onChange={(e) => setB(e.target.value)} />
          </label>
        </div>
        <div className='control'>
          <label>
            n (subintervalos):
            <input type="number" value={n} onChange={(e) => setN(e.target.value)} />
          </label>
        </div>
        <div className='control'>
          <button className='btn-primary' onClick={handleCalculate}>Calcular Integral</button>
        </div>

        {result !== null && <div className='result'>Resultado: {result}</div>}
        {error && <div className='error'>Error: {error}</div>}

        {iterations.length > 0 && (
          <div className='iterations'>
            <h3>Tabla de Iteraciones</h3>
            <table>
              <thead>
                <tr>
                  <th>i</th>
                  <th>x</th>
                  <th>f(x)</th>
                </tr>
              </thead>
              <tbody>
                {iterations.map((iter, index) => (
                  <tr key={index}>
                    <td>{index}</td>
                    <td>{iter.x.toFixed(10)}</td>
                    <td>{iter.y.toFixed(10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </div>

      <div className="graph-area">
        <Graph 
          funcStr={funcStr} 
          funcLatex={toLatex(funcStr)}
          a={isNaN(parsedA) ? 0 : parsedA} 
          b={isNaN(parsedB) ? 1 : parsedB} 
          iterations={iterations} 
          method={method} 
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Calculator />} />
      </Routes>
    </Router>
  );
}
