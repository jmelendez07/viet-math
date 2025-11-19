import Mexp from 'math-expression-evaluator';

interface SimpsonAbiertoInput {
    funcStr: string; // La función como texto
    a: number;       // Límite inferior de integración
    b: number;       // Límite superior de integración
    n: number;       // Número de subintervalos (debe ser par)
}

// Define la estructura de cada punto de iteración
export interface SimpsonAbiertoIteration {
    x: number;
    y: number;
}

// Define la nueva estructura del valor de retorno
export interface SimpsonAbiertoOutput {
    integral: number;
    iterations: SimpsonAbiertoIteration[];
}

const calculateSimpsonAbierto = ({ funcStr, a, b, n }: SimpsonAbiertoInput): SimpsonAbiertoOutput => {
    const mexp = new Mexp();

    if (n <= 0 || n % 2 !== 0) {
        throw new Error("El número de subintervalos (n) debe ser un número par positivo.");
    }

    const h = (b - a) / n;
    const iterations: SimpsonAbiertoIteration[] = [];
    let sum = 0;

    // Función para evaluar f(x) en un punto dado
    const f = (x: number): number => {
        const lexed = mexp.lex(funcStr, [{ token: 'x', type: 3, value: 'x', show: 'x', precedence: 11 }]);
        const postfixed = mexp.toPostfix(lexed);
        return mexp.postfixEval(postfixed, { x: x });
    };

    // El bucle va de 1 a n-1, ya que las fórmulas abiertas no usan los puntos finales a y b.
    for (let i = 1; i < n; i++) {
        const x_i = a + i * h;
        const y_i = f(x_i);
        iterations.push({ x: x_i, y: y_i });

        if (i % 2 !== 0) {
            sum += 4 * y_i; // Coeficiente 4 para los términos impares
        } else {
            sum += 2 * y_i; // Coeficiente 2 para los términos pares
        }
    }

    const integral = (h / 3) * sum;
    
    // Retorna el objeto con la integral y el array de iteraciones
    return { integral, iterations };
};

export { calculateSimpsonAbierto, SimpsonAbiertoInput };