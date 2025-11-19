import Mexp from 'math-expression-evaluator';

interface TrapezoidalInput {
    funcStr: string; // La función como texto, ej: "x^2"
    a: number;       // Límite inferior de integración
    b: number;       // Límite superior de integración
    n: number;       // Número de trapecios (subintervalos)
}

const calculateTrapezoidal = ({ funcStr, a, b, n }: TrapezoidalInput): number => {

    const mexp = new Mexp();

    if (n <= 0) {
        throw new Error("El número de trapecios (n) debe ser un entero positivo.");
    }

    const h = (b - a) / n;

    // Función para evaluar f(x) en un punto dado
    const f = (x: number): number => {
        // Reemplaza 'x' en la función de texto y la evalúa
        const lexed = mexp.lex(funcStr, [{ token: 'x', type: 3, value: 'x', show: 'x', precedence: 11 }]);
        const postfixed = mexp.toPostfix(lexed);
        return mexp.postfixEval(postfixed, { x: x });
    };

    let sum = f(a) + f(b); // Suma f(x₀) y f(xₙ)

    for (let i = 1; i < n; i++) {
        const x_i = a + i * h;
        sum += 2 * f(x_i);
    }

    const integral = (h / 2) * sum;
    return integral;
};

export { calculateTrapezoidal, TrapezoidalInput };