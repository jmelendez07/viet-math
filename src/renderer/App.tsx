import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import './AppLayout.css';
import { useState, useEffect } from 'react';
import Graph from './components/Graph';
import ExerciseList, { Exercise } from './components/ExerciseList';
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
  let latex = expr;
  // x^2 -> x^{2}
  latex = latex.replace(/\^(\d+)/g, '^{$1}');
  latex = latex.replace(/\^([a-zA-Z])/g, '^{$1}');
  // Math.sin(x) -> \sin(x)
  latex = latex.replace(/Math\.(sin|cos|tan|log|exp|sqrt)/g, '\\$1');
  // sin(x) -> \sin(x)
  latex = latex.replace(/\b(sin|cos|tan|log|exp|sqrt)\b/g, '\\$1');
  // * -> \cdot
  latex = latex.replace(/\*/g, ' \\cdot ');
  return latex;
}

const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: '1',
    name: 'Parábola simple',
    funcStr: 'x^2',
    funcLatex: 'x^{2}',
    a: '0',
    b: '2',
    n: '12',
    method: 'trapezoidal',
  },
  {
    id: '2',
    name: 'Función seno',
    funcStr: 'Math.sin(x)',
    funcLatex: '\\sin(x)',
    a: '0',
    b: '3.14159',
    n: '12',
    method: 'simpson13',
  },
  {
    id: '3',
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
  
  const [funcStr, setFuncStr] = useState(currentExercise?.funcStr || 'x^2');
  const [a, setA] = useState(currentExercise?.a || '0');
  const [b, setB] = useState(currentExercise?.b || '1');
  const [n, setN] = useState(currentExercise?.n || '12');
  const [method, setMethod] = useState(currentExercise?.method || 'trapezoidal');
  
  const [result, setResult] = useState<number | null>(null);
  const [iterations, setIterations] = useState<Iteration[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  const handleCalculate = () => {
    setResult(null);
    setIterations([]);
    setError(null);

    const numA = parseFloat(a);
    const numB = parseFloat(b);
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
      funcStr: 'x^2',
      funcLatex: 'x^{2}',
      a: '0',
      b: '1',
      n: '12',
      method: 'trapezoidal',
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

  const parsedA = parseFloat(a);
  const parsedB = parseFloat(b);

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
              type="text"
              placeholder="Ej: x^2 or Math.sin(x)"
              value={funcStr}
              onChange={(e) => setFuncStr(e.target.value)}
            />
          </label>
        </div>
        <div className='control-inline'>
          <label>
            a:
            <input type="number" value={a} onChange={(e) => setA(e.target.value)} />
          </label>
          <label>
            b:
            <input type="number" value={b} onChange={(e) => setB(e.target.value)} />
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
                    <td>{iter.x.toFixed(6)}</td>
                    <td>{iter.y.toFixed(6)}</td>
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
