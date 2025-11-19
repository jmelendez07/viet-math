import Mexp from 'math-expression-evaluator';

interface Simpson13Input {
    funcStr: string; // La función como texto
    a: number;       // Límite inferior de integración
    b: number;       // Límite superior de integración
    n: number;       // Número de subintervalos (debe ser par)
}

const calculateSimpson13 = ({ funcStr, a, b, n }: Simpson13Input): number => {
    const mexp = new Mexp();

    if (n <= 0 || n % 2 !== 0) {
        throw new Error("El número de subintervalos (n) debe ser un número par positivo.");
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
        if (i % 2 !== 0) {
            sum += 4 * f(x_i); // Coeficiente 4 para los términos impares
        } else {
            sum += 2 * f(x_i); // Coeficiente 2 para los términos pares
        }
    }

    const integral = (h / 3) * sum;
    return integral;
};

export { calculateSimpson13, Simpson13Input };