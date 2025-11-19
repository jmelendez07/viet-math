import Mexp from 'math-expression-evaluator';

interface BooleInput {
    funcStr: string; // La función como texto, ej: "x^4"
    a: number;       // Límite inferior de integración
    b: number;       // Límite superior de integración
    n: number;       // Número de subintervalos (debe ser múltiplo de 4)
}

const calculateBoole = ({ funcStr, a, b, n }: BooleInput): number => {
    const mexp = new Mexp();

    if (n <= 0 || n % 4 !== 0) {
        throw new Error("El número de subintervalos (n) debe ser un múltiplo de 4 positivo.");
    }

    const h = (b - a) / n;

    // Función para evaluar f(x) en un punto dado
    const f = (x: number): number => {
        const lexed = mexp.lex(funcStr, [{ token: 'x', type: 3, value: 'x', show: 'x', precedence: 11 }]);
        const postfixed = mexp.toPostfix(lexed);
        return mexp.postfixEval(postfixed, { x: x });
    };

    if (n === 4) { // Caso base simple
        let sum = 7 * f(a) + 32 * f(a + h) + 12 * f(a + 2 * h) + 32 * f(a + 3 * h) + 7 * f(b);
        return ((2 * h) / 45) * sum;
    }

    // Regla compuesta extendida
    let sum = 0;
    for (let i = 0; i <= n; i++) {
        const x_i = a + i * h;
        if (i === 0 || i === n) {
            sum += 7 * f(x_i); // Extremos
        } else if (i % 4 === 2) {
            sum += 12 * f(x_i); // Términos f(x_2), f(x_6), ...
        } else if (i % 4 === 0) {
            sum += 14 * f(x_i); // Puntos de unión f(x_4), f(x_8), ...
        } else {
            sum += 32 * f(x_i); // Resto de términos
        }
    }

    const integral = ((2 * h) / 45) * sum;
    return integral;
};

export { calculateBoole, BooleInput };