import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { useState } from 'react';
import { calculateTrapezoidal } from '../main/server/Trapezoidal';
import { calculateBoole } from '../main/server/Boole';
import { calculateSimpson } from '../main/server/Simpson';
import { calculateSimpson13 } from '../main/server/Simpson13';
import { calculateSimpsonAbierto } from '../main/server/SimpsonAbierto';

function Calculator() {
  const [funcStr, setFuncStr] = useState('x^2');
  const [a, setA] = useState('0');
  const [b, setB] = useState('1');
  const [n, setN] = useState('12'); // Múltiplo de 2, 3 y 4 para que todos los métodos funcionen
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState('trapezoidal');

  const handleCalculate = () => {
    setResult(null);
    setError(null);

    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numN = parseInt(n, 10);

    if (isNaN(numA) || isNaN(numB) || isNaN(numN)) {
      setError('Por favor, introduce valores numéricos válidos para a, b y n.');
      return;
    }

    try {
      let calculatedResult: number | undefined;
      if (method === 'trapezoidal') {
        calculatedResult = calculateTrapezoidal({
          funcStr,
          a: numA,
          b: numB,
          n: numN,
        });
      } else if (method === 'boole') {
        calculatedResult = calculateBoole({
          funcStr,
          a: numA,
          b: numB,
          n: numN,
        });
      } else if (method === 'simpson') {
        calculatedResult = calculateSimpson({
          funcStr,
          a: numA,
          b: numB,
          n: numN,
        });
      } else if (method === 'simpson13') {
        calculatedResult = calculateSimpson13({
          funcStr,
          a: numA,
          b: numB,
          n: numN,
        });
      } else if (method === 'simpsonAbierto') {
        calculatedResult = calculateSimpsonAbierto({
          funcStr,
          a: numA,
          b: numB,
          n: numN,
        });
      }
      setResult(calculatedResult ?? null);
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
