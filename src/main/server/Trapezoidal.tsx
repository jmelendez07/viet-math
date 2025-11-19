import Mexp from 'math-expression-evaluator';

interface TrapezoidalInput {
    funcStr: string; // La función como texto, ej: "x^2"
    a: number;       // Límite inferior de integración
    b: number;       // Límite superior de integración
    n: number;       // Número de trapecios (subintervalos)
}

// Define la estructura de cada punto de iteración
export interface TrapezoidalIteration {
    x: number;
    y: number;
}

// Define la nueva estructura del valor de retorno
export interface TrapezoidalOutput {
    integral: number;
    iterations: TrapezoidalIteration[];
}

const calculateTrapezoidal = ({ funcStr, a, b, n }: TrapezoidalInput): TrapezoidalOutput => {

    const mexp = new Mexp();

    if (n <= 0) {
        throw new Error("El número de trapecios (n) debe ser un entero positivo.");
    }

    const h = (b - a) / n;
    const iterations: TrapezoidalIteration[] = [];
    let sum = 0;

    // Función para evaluar f(x) en un punto dado
    const f = (x: number): number => {
        // Reemplaza 'x' en la función de texto y la evalúa
        const lexed = mexp.lex(funcStr, [{ token: 'x', type: 3, value: 'x', show: 'x', precedence: 11 }]);
        const postfixed = mexp.toPostfix(lexed);
        return mexp.postfixEval(postfixed, { x: x });
    };

    for (let i = 0; i <= n; i++) {
        const x_i = a + i * h;
        const y_i = f(x_i);
        iterations.push({ x: x_i, y: y_i });

        if (i === 0 || i === n) {
            sum += y_i; // Coeficiente 1 para los extremos
        } else {
            sum += 2 * y_i; // Coeficiente 2 para los puntos intermedios
        }
    }

    const integral = (h / 2) * sum;
    
    return { integral, iterations };
};

export { calculateTrapezoidal, TrapezoidalInput };