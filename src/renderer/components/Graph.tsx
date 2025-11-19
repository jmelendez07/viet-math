import React, { useMemo, useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { createEvaluator } from '../../main/server/mathEvaluator';

interface Iteration {
  x: number;
  y: number;
}

interface Props {
  funcStr: string;
  funcLatex?: string;
  a: number;
  b: number;
  iterations: Iteration[];
  method: string;
}

const Graph: React.FC<Props> = ({ funcStr, funcLatex, a, b, iterations, method }) => {
  // Image URLs for rotation
  const images = [
    'https://res.cloudinary.com/dvibz13t8/image/upload/v1763594303/rambo_xtbgcx.png',
    'https://res.cloudinary.com/dvibz13t8/image/upload/v1763594570/rambo-3_etv0z3.png'
  ];
  
  // Image rotation state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Rotate images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Trigger MathJax typesetting when content changes
  React.useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).MathJax) {
      (window as any).MathJax.typesetPromise?.().catch((err: any) => console.log('MathJax error:', err));
    }
  }, [funcStr, funcLatex]);

  // Check if function string is empty or invalid
  const isEmpty = !funcStr || funcStr.trim() === '';

  const { chartData, yDomain, hasValidData } = useMemo(() => {
    // If empty, return empty data
    if (isEmpty) {
      return { 
        chartData: [], 
        yDomain: [0, 1], 
        hasValidData: false 
      };
    }

    const f = createEvaluator(funcStr);
    const SAMPLE = 200;
    const functionData: Array<{ x: number; fx: number; approx?: number }> = [];
    
    let minY = Infinity;
    let maxY = -Infinity;
    let hasFiniteValues = false;

    // Generate smooth function curve
    for (let i = 0; i <= SAMPLE; i++) {
      const t = i / SAMPLE;
      const x = a + (b - a) * t;
      const fx = f(x);
      const fxValue = Number(fx.toFixed(10));
      
      if (isFinite(fxValue)) {
        minY = Math.min(minY, fxValue);
        maxY = Math.max(maxY, fxValue);
        hasFiniteValues = true;
      }
      
      functionData.push({ x: Number(x.toFixed(10)), fx: fxValue });
    }

    // Add ALL iteration points to the data
    if (iterations.length > 0) {
      // Create a map of existing x values to avoid duplicates
      const existingX = new Set(functionData.map(p => p.x));
      
      iterations.forEach(it => {
        const x = Number(it.x.toFixed(10));
        const y = Number(it.y.toFixed(10));
        
        if (isFinite(y)) {
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
          hasFiniteValues = true;
        }
        
        if (existingX.has(x)) {
          // If point exists in function data, add approx value
          const point = functionData.find(p => p.x === x);
          if (point) point.approx = y;
        } else {
          // If point doesn't exist, add it with both fx and approx
          functionData.push({ x, fx: y, approx: y });
        }
      });
      
      // Sort by x to maintain order
      functionData.sort((a, b) => a.x - b.x);
    }

    // If no valid data, return empty
    if (!hasFiniteValues) {
      return { 
        chartData: [], 
        yDomain: [0, 1], 
        hasValidData: false 
      };
    }

    // Calculate Y domain with padding
    const yRange = maxY - minY;
    const yPadding = yRange * 0.1; // 10% padding
    const calculatedYDomain = [
      minY - yPadding,
      maxY + yPadding
    ];

    return { 
      chartData: functionData, 
      yDomain: calculatedYDomain,
      hasValidData: true
    };
  }, [funcStr, a, b, iterations, isEmpty]);

  const methodColors: Record<string, string> = {
    trapezoidal: '#ef4444',
    boole: '#f59e0b',
    simpson: '#8b5cf6',
    simpson13: '#ec4899',
    simpsonAbierto: '#10b981',
  };

  const methodNames: Record<string, string> = {
    trapezoidal: 'Trapezoidal',
    boole: 'Boole',
    simpson: 'Simpson 3/8',
    simpson13: 'Simpson 1/3',
    simpsonAbierto: 'Simpson Abierto',
  };

  const primaryColor = methodColors[method] || '#ef4444';

  return (
    <div className="graph-container">
      <div className="graph-header">
        <h3>Visualización: {methodNames[method]}</h3>
        <p className="graph-subtitle">
          {funcLatex ? (
            <>
              f(x) = <span className="latex-inline">{`\\(${funcLatex}\\)`}</span> en [{a.toFixed(2)}, {b.toFixed(2)}]
            </>
          ) : (
            <>
              f(x) = <code>{funcStr || '(sin función)'}</code> en [{a.toFixed(2)}, {b.toFixed(2)}]
            </>
          )}
        </p>
      </div>
      {!hasValidData ? (
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '12px',
          color: '#6b7280',
          padding: '40px'
        }}>
          <img 
            src={images[currentImageIndex]} 
            alt="No graph" 
            style={{
              width: '600px',
              height: '300px',
              filter: 'grayscale(100%)',
              opacity: 0.6,
              objectFit: 'cover',
              transition: 'opacity 0.5s ease-in-out'
            }}
          />
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#374151' }}>
            {isEmpty ? 'Ingresa una función' : 'Sin datos para graficar'}
          </div>
          <div style={{ fontSize: '14px', textAlign: 'center', maxWidth: '300px' }}>
            {isEmpty 
              ? 'Escribe una función matemática en el campo "Función f(x)" para visualizar su gráfica.'
              : 'La función no genera valores válidos en el intervalo especificado.'}
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="x"
            type="number"
            domain={['dataMin', 'dataMax']}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            label={{ value: 'x', position: 'insideBottom', offset: -10, style: { fill: '#374151' } }}
            allowDataOverflow={false}
          />
          <YAxis
            type="number"
            domain={yDomain}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            label={{ value: 'f(x)', angle: -90, position: 'insideLeft', style: { fill: '#374151' } }}
            allowDataOverflow={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            labelStyle={{ color: '#374151', fontWeight: 600 }}
            formatter={(value: any) => {
              if (typeof value === 'number' && isFinite(value)) {
                  return [value.toFixed(10), ''];
                }
              return [value, ''];
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          {/* Eje Y (línea vertical en x=0) - solo si 0 está en el rango */}
          {a <= 0 && b >= 0 && (
            <ReferenceLine x={0} stroke="#374151" strokeWidth={2} />
          )}
          {/* Eje X (línea horizontal en y=0) - siempre visible */}
          <ReferenceLine y={0} stroke="#374151" strokeWidth={2} />
          
          {/* Area under curve with vivid color */}
          <Area
            type="monotone"
            dataKey="fx"
            fill={primaryColor}
            fillOpacity={0.15}
            stroke="none"
            name="Área"
            isAnimationActive={true}
            animationDuration={800}
          />
          
          {/* Function curve */}
          <Line
            type="monotone"
            dataKey="fx"
            stroke={primaryColor}
            strokeWidth={3}
            dot={false}
            name="f(x)"
            isAnimationActive={true}
            animationDuration={800}
          />
          
          {/* Approximation line - only render when we have calculated points */}
          {iterations.length > 0 && (
            <Line
              type="linear"
              dataKey="approx"
              stroke="#dc2626"
              strokeWidth={2.5}
              dot={{ fill: '#dc2626', r: 5, strokeWidth: 0 }}
              name="Aproximación"
              isAnimationActive={true}
              animationDuration={1000}
              connectNulls={false}
            />
          )}
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Graph;
