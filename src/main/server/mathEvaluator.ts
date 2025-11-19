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
  
  // Agregar Math. a las funciones matemáticas si no lo tienen
  // Lista de funciones matemáticas comunes
  const mathFunctions = [
    'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'atan2',
    'sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh',
    'log', 'log10', 'log2', 'log1p',
    'exp', 'expm1',
    'sqrt', 'cbrt',
    'abs', 'sign',
    'ceil', 'floor', 'round', 'trunc',
    'max', 'min',
    'pow',
    'random'
  ];
  
  // Reemplazar cada función sin Math. por Math.función
  mathFunctions.forEach(func => {
    // Patrón: buscar la función que NO esté precedida por "Math."
    // Usa word boundary \b para evitar reemplazar en medio de palabras
    const regex = new RegExp(`(?<!Math\\.)\\b${func}\\b`, 'g');
    processed = processed.replace(regex, `Math.${func}`);
  });
  
  // Agregar constantes matemáticas
  processed = processed.replace(/\bPI\b/g, 'Math.PI');
  processed = processed.replace(/\bE\b/g, 'Math.E');
  
  // Agregar multiplicación implícita donde sea necesario
  // Por ejemplo: 2x -> 2*x, 2(x+1) -> 2*(x+1)
  processed = processed.replace(/(\d)([a-zA-Z(])/g, '$1*$2');
  processed = processed.replace(/(\))(\d)/g, '$1*$2');
  processed = processed.replace(/(\))(\()/g, '$1*$2');
  
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
    
    // Crear una función que evalúa la expresión
    // eslint-disable-next-line no-new-func
    const fn = new Function('x', `
      with (Math) {
        try {
          return ${processed};
        } catch (e) {
          return NaN;
        }
      }
    `);
    
    const result = fn(x);
    
    // Verificar que el resultado sea un número válido
    if (typeof result !== 'number' || !isFinite(result)) {
      return NaN;
    }
    
    return result;
  } catch (error) {
    console.error(`Error evaluando expresión "${expr}" con x=${x}:`, error);
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
    // Intentar crear la función
    // eslint-disable-next-line no-new-func
    new Function('x', `with (Math) { return ${processed}; }`);
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
    const fn = new Function('x', `
      with (Math) {
        try {
          return ${processed};
        } catch (e) {
          return NaN;
        }
      }
    `);
    
    return (x: number) => {
      try {
        const result = fn(x);
        if (typeof result === 'number' && isFinite(result)) {
          return result;
        }
        return NaN;
      } catch {
        return NaN;
      }
    };
  } catch (error) {
    console.error(`Error creando evaluador para "${expr}":`, error);
    return () => NaN;
  }
}
