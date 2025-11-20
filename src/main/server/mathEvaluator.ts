/**
 * Evaluador de expresiones matemáticas mejorado
 * Maneja funciones trigonométricas, exponenciales y otras funciones matemáticas
 */

/**
 * Preprocesa una expresión matemática para hacerla evaluable
 * @param expr - La expresión matemática como string
 * @returns La expresión procesada lista para ser evaluada
 */
export function preprocessExpression(expr: string): string {
  let processed = expr;

  // Reemplazar ^ con ** para exponenciación
  processed = processed.replace(/\^/g, '**');
  
  // PRIMERO: Procesar logaritmos con marcadores temporales para evitar conflictos
  // Reemplazar ln(  por _NATURAL_LOG_(  
  processed = processed.replace(/\bln\s*\(/g, '_NATURAL_LOG_(');
  // Reemplazar log(  por _LOG_BASE_10_(  
  processed = processed.replace(/\blog\s*\(/g, '_LOG_BASE_10_(');
  
  // Agregar constantes matemáticas
  processed = processed.replace(/\b(PI|pi)\b/g, 'Math.PI');
  processed = processed.replace(/\be\b(?!xp)/g, 'Math.E');
  
  // Agregar Math. a las funciones matemáticas si no lo tienen
  const mathFunctions = [
    'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'atan2',
    'sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh',
    'exp', 'expm1',
    'sqrt', 'cbrt',
    'abs', 'sign',
    'ceil', 'floor', 'round', 'trunc',
    'max', 'min',
    'pow'
  ];
  
  mathFunctions.forEach(func => {
    const regex = new RegExp(`(?<!Math\\.)\\b${func}\\b`, 'g');
    processed = processed.replace(regex, `Math.${func}`);
  });
  
  // Agregar multiplicación implícita donde sea necesario
  // IMPORTANTE: Hacer esto ANTES de reemplazar los marcadores temporales para evitar conflictos
  // No agregar * si hay un punto (para Math.xxx) o guion bajo
  processed = processed.replace(/(\d)([a-zA-Z](?![a-zA-Z0-9]*\())/g, '$1*$2');  // 2x -> 2*x
  processed = processed.replace(/(\))(\d)/g, '$1*$2');  // )2 -> )*2
  // Solo agregar * después de dígitos si NO están seguidos de un marcador temporal
  processed = processed.replace(/(\d)\s*(\()(?!.*_)/g, '$1*$2');  // 2( -> 2*(, pero no en _LOG_BASE_10_(
  processed = processed.replace(/(\))(\()/g, '$1*$2');  // )( -> )*(
  
  // Convertir los marcadores temporales a las funciones correctas de JavaScript
  // Hacer esto AL FINAL para evitar que las reglas de multiplicación los afecten
  processed = processed.replace(/_NATURAL_LOG_/g, 'Math.log');
  processed = processed.replace(/_LOG_BASE_10_/g, 'Math.log10');
  
  console.log('[mathEvaluator] Original:', expr);
  console.log('[mathEvaluator] Procesada:', processed);
  
  return processed;
}

/**
 * Evalúa una expresión matemática para un valor dado de x
 * @param expr - La expresión matemática como string
 * @param x - El valor de x
 * @returns El resultado de la evaluación
 */
export function evaluateExpression(expr: string, x: number): number {
  try {
    const processed = preprocessExpression(expr);
    
    // Crear una función que evalúa la expresión SIN usar with(Math)
    // para evitar conflictos con las funciones Math.log10, etc.
    // eslint-disable-next-line no-new-func
    const fn = new Function('x', 'Math', `
      try {
        return ${processed};
      } catch (e) {
        console.error('[mathEvaluator] Error en evaluación:', e);
        return NaN;
      }
    `);
    
    const result = fn(x, Math);
    
    // Verificar que el resultado sea un número válido
    if (typeof result !== 'number' || !isFinite(result)) {
      console.error('[mathEvaluator] Resultado inválido:', result, 'para x =', x);
      return NaN;
    }
    
    return result;
  } catch (error) {
    console.error(`[mathEvaluator] Error evaluando expresión "${expr}" con x=${x}:`, error);
    return NaN;
  }
}

/**
 * Valida si una expresión es válida
 * @param expr - La expresión a validar
 * @returns true si la expresión es válida, false en caso contrario
 */
export function validateExpression(expr: string): boolean {
  try {
    const processed = preprocessExpression(expr);
    // Intentar crear la función sin with(Math)
    // eslint-disable-next-line no-new-func
    new Function('x', 'Math', `return ${processed};`);
    return true;
  } catch {
    return false;
  }
}

/**
 * Crea una función evaluable a partir de una expresión
 * @param expr - La expresión matemática como string
 * @returns Una función que toma x y devuelve el resultado
 */
export function createEvaluator(expr: string): (x: number) => number {
  const processed = preprocessExpression(expr);
  
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function('x', 'Math', `
      try {
        return ${processed};
      } catch (e) {
        console.error('[mathEvaluator] Error en createEvaluator:', e);
        return NaN;
      }
    `);
    
    return (x: number) => {
      try {
        const result = fn(x, Math);
        if (typeof result === 'number' && isFinite(result)) {
          return result;
        }
        return NaN;
      } catch {
        return NaN;
      }
    };
  } catch (error) {
    console.error(`[mathEvaluator] Error creando evaluador para "${expr}":`, error);
    return () => NaN;
  }
}
