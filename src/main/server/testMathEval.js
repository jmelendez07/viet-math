// Quick test for math evaluator
const { evaluateExpression, preprocessExpression } = require('./mathEvaluator');

console.log('=== Test de cos(pi * x^2) ===\n');

const testCases = [
  { expr: 'cos(pi * x^2)', x: 0, expected: 1 },
  { expr: 'cos(pi * x^2)', x: 1, expected: Math.cos(Math.PI) },
  { expr: 'cos(PI * x^2)', x: 1, expected: Math.cos(Math.PI) },
  { expr: 'pi', x: 0, expected: Math.PI },
  { expr: 'PI', x: 0, expected: Math.PI },
  { expr: 'e', x: 0, expected: Math.E },
  { expr: 'sin(pi)', x: 0, expected: Math.sin(Math.PI) },
  { expr: 'cos(pi)', x: 0, expected: Math.cos(Math.PI) },
];

console.log('Pruebas de evaluación:\n');
testCases.forEach(({ expr, x, expected }, i) => {
  const result = evaluateExpression(expr, x);
  const passed = Math.abs(result - expected) < 0.0001;
  console.log(`${i + 1}. ${expr} con x=${x}`);
  console.log(`   Preprocesado: ${preprocessExpression(expr)}`);
  console.log(`   Resultado: ${result}`);
  console.log(`   Esperado: ${expected}`);
  console.log(`   ${passed ? '✅ PASS' : '❌ FAIL'}\n`);
});

console.log('=== Pruebas completadas ===');
