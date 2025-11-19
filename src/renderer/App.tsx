import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { useState } from 'react';
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

function Calculator() {
  const [funcStr, setFuncStr] = useState('x^2');
  const [a, setA] = useState('0');
  const [b, setB] = useState('1');
  const [n, setN] = useState('12'); // Múltiplo de 2, 3 y 4 para que todos los métodos funcionen
  const [result, setResult] = useState<number | null>(null);
  const [iterations, setIterations] = useState<Iteration[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState('trapezoidal');

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

  return (
    <div>
      <div>
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
      <div>
        <label>
          Función f(x):
          <input
            type="text"
            placeholder="Ej: x^2"
            value={funcStr}
            onChange={(e) => setFuncStr(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Límite inferior (a):
          <input
            type="number"
            placeholder="a"
            value={a}
            onChange={(e) => setA(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Límite superior (b):
          <input
            type="number"
            placeholder="b"
            value={b}
            onChange={(e) => setB(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Número de subintervalos (n):
          <input
            type="number"
            placeholder="n"
            value={n}
            onChange={(e) => setN(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleCalculate}>Calcular Integral</button>
      {result !== null && <div>Resultado: {result}</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      {iterations.length > 0 && (
        <div>
          <h3>Tabla de Iteraciones</h3>
          <table border={1} style={{ width: '100%', marginTop: '10px' }}>
            <thead>
              <tr>
                <th>Iteración (i)</th>
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
