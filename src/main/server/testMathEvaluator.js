/**
 * Pruebas para el nuevo evaluador matemático
 * Ejecuta este archivo con: node testMathEvaluator.js
 */

const { evaluateExpression, preprocessExpression, validateExpression } = require('./mathEvaluator');

console.log('=== Pruebas del Evaluador Matemático ===\n');

// Pruebas de funciones trigonométricas
console.log('1. Funciones Trigonométricas:');
console.log(`   sin(0) = ${evaluateExpression('sin(x)', 0)} (esperado: 0)`);
console.log(`   sin(π/2) = ${evaluateExpression('sin(x)', Math.PI/2)} (esperado: 1)`);
console.log(`   cos(0) = ${evaluateExpression('cos(x)', 0)} (esperado: 1)`);
console.log(`   cos(π) = ${evaluateExpression('cos(x)', Math.PI)} (esperado: -1)`);
console.log(`   tan(0) = ${evaluateExpression('tan(x)', 0)} (esperado: 0)`);
console.log(`   tan(π/4) = ${evaluateExpression('tan(x)', Math.PI/4)} (esperado: ~1)`);

console.log('\n2. Funciones con Math. explícito:');
console.log(`   Math.sin(π/2) = ${evaluateExpression('Math.sin(x)', Math.PI/2)} (esperado: 1)`);
console.log(`   Math.cos(0) = ${evaluateExpression('Math.cos(x)', 0)} (esperado: 1)`);

console.log('\n3. Exponenciación:');
console.log(`   x^2 con x=3 = ${evaluateExpression('x^2', 3)} (esperado: 9)`);
console.log(`   x^3 con x=2 = ${evaluateExpression('x^3', 2)} (esperado: 8)`);

console.log('\n4. Expresiones complejas:');
console.log(`   x^2 - 2*x con x=3 = ${evaluateExpression('x^2 - 2*x', 3)} (esperado: 3)`);
console.log(`   sin(x)*cos(x) con x=π/4 = ${evaluateExpression('sin(x)*cos(x)', Math.PI/4)} (esperado: ~0.5)`);

console.log('\n5. Funciones logarítmicas y exponenciales:');
console.log(`   exp(0) = ${evaluateExpression('exp(x)', 0)} (esperado: 1)`);
console.log(`   exp(1) = ${evaluateExpression('exp(x)', 1)} (esperado: ~2.718)`);
console.log(`   log(1) = ${evaluateExpression('log(x)', 1)} (esperado: 0)`);
console.log(`   log(E) = ${evaluateExpression('log(x)', Math.E)} (esperado: 1)`);

console.log('\n6. Raíces:');
console.log(`   sqrt(4) = ${evaluateExpression('sqrt(x)', 4)} (esperado: 2)`);
console.log(`   sqrt(9) = ${evaluateExpression('sqrt(x)', 9)} (esperado: 3)`);

console.log('\n7. Preprocesamiento:');
console.log(`   "sin(x)" → "${preprocessExpression('sin(x)')}"`);
console.log(`   "x^2" → "${preprocessExpression('x^2')}"`);
console.log(`   "2x" → "${preprocessExpression('2x')}"`);
console.log(`   "Math.sin(x)" → "${preprocessExpression('Math.sin(x)')}"`);

console.log('\n8. Validación:');
console.log(`   "sin(x)" es válida: ${validateExpression('sin(x)')}`);
console.log(`   "x^2" es válida: ${validateExpression('x^2')}`);
console.log(`   "invalid###" es válida: ${validateExpression('invalid###')}`);

console.log('\n=== Pruebas Completadas ===');
