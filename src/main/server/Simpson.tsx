import Mexp from 'math-expression-evaluator';

interface SimpsonInput {
    funcStr: string; // La función como texto
    a: number;       // Límite inferior de integración
    b: number;       // Límite superior de integración
    n: number;       // Número de subintervalos (debe ser múltiplo de 3)
}

const calculateSimpson = ({ funcStr, a, b, n }: SimpsonInput): number => {
    const mexp = new Mexp();

    if (n <= 0 || n % 3 !== 0) {
        throw new Error("El número de subintervalos (n) debe ser un múltiplo de 3 positivo.");
    }

    const h = (b - a) / n;

    // Función para evaluar f(x) en un punto dado
    const f = (x: number): number => {
        const lexed = mexp.lex(funcStr, [{ token: 'x', type: 3, value: 'x', show: 'x', precedence: 11 }]);
        const postfixed = mexp.toPostfix(lexed);
        return mexp.postfixEval(postfixed, { x: x });
    };

    let sum = f(a) + f(b); // Suma el primer y último término

    for (let i = 1; i < n; i++) {
        const x_i = a + i * h;
        if (i % 3 === 0) {
            sum += 2 * f(x_i); // Coeficiente 2 para los múltiplos de 3
        } else {
            sum += 3 * f(x_i); // Coeficiente 3 para los demás
        }
    }

    const integral = ((3 * h) / 8) * sum;
    return integral;
};

export { calculateSimpson, SimpsonInput };