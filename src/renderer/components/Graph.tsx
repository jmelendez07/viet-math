import React, { useMemo } from 'react';
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

function parseFunction(expr: string) {
  if (!expr || expr.trim() === '') return (x: number) => 0;
  let safe = expr.replace(/\^/g, '**');
  safe = safe.replace(/\b(sin|cos|tan|log|exp|sqrt|abs|max|min|pow)\b/g, 'Math.$1');
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function('x', `with (Math) { return ${safe}; }`);
    return (x: number) => {
      try {
        const v = fn(x);
        if (typeof v === 'number' && isFinite(v)) return v;
        return NaN;
      } catch {
        return NaN;
      }
    };
  } catch (e) {
    return (x: number) => NaN;
  }
}

const Graph: React.FC<Props> = ({ funcStr, funcLatex, a, b, iterations, method }) => {
  // Trigger MathJax typesetting when content changes
  React.useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).MathJax) {
      (window as any).MathJax.typesetPromise?.().catch((err: any) => console.log('MathJax error:', err));
    }
  }, [funcStr, funcLatex]);

  const chartData = useMemo(() => {
    const f = parseFunction(funcStr);
    const SAMPLE = 200;
    const functionData: Array<{ x: number; fx: number; approx?: number }> = [];

    // Generate smooth function curve
    for (let i = 0; i <= SAMPLE; i++) {
      const t = i / SAMPLE;
      const x = a + (b - a) * t;
      const fx = f(x);
      functionData.push({ x: Number(x.toFixed(6)), fx: Number(fx.toFixed(6)) });
    }

    // Add ALL iteration points to the data
    if (iterations.length > 0) {
      // Create a map of existing x values to avoid duplicates
      const existingX = new Set(functionData.map(p => p.x));
      
      iterations.forEach(it => {
        const x = Number(it.x.toFixed(6));
        const y = Number(it.y.toFixed(6));
        
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

    return functionData;
  }, [funcStr, a, b, iterations]);

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
              f(x) = <code>{funcStr}</code> en [{a.toFixed(2)}, {b.toFixed(2)}]
            </>
          )}
        </p>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="x"
            type="number"
            domain={['dataMin', 'dataMax']}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            label={{ value: 'x', position: 'insideBottom', offset: -10, style: { fill: '#374151' } }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            label={{ value: 'f(x)', angle: -90, position: 'insideLeft', style: { fill: '#374151' } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            labelStyle={{ color: '#374151', fontWeight: 600 }}
            formatter={(value: any) => [Number(value).toFixed(6), '']}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          <ReferenceLine y={0} stroke="#9ca3af" strokeWidth={1.5} />
          
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
    </div>
  );
};

export default Graph;
