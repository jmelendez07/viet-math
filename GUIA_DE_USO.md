# Guía de Uso - Funciones Matemáticas

## ✅ Funciones Soportadas

### Funciones Trigonométricas
```
sin(x)      // Seno
cos(x)      // Coseno
tan(x)      // Tangente
asin(x)     // Arco seno
acos(x)     // Arco coseno
atan(x)     // Arco tangente
```

### Funciones Hiperbólicas
```
sinh(x)     // Seno hiperbólico
cosh(x)     // Coseno hiperbólico
tanh(x)     // Tangente hiperbólica
```

### Funciones Exponenciales y Logarítmicas
```
exp(x)      // e^x
log(x)      // Logaritmo natural (ln)
log10(x)    // Logaritmo base 10
log2(x)     // Logaritmo base 2
```

### Otras Funciones
```
sqrt(x)     // Raíz cuadrada
abs(x)      // Valor absoluto
ceil(x)     // Redondeo hacia arriba
floor(x)    // Redondeo hacia abajo
round(x)    // Redondeo al entero más cercano
pow(x, n)   // Potencia x^n
```

### Constantes
```
PI          // π ≈ 3.14159265...
E           // e ≈ 2.71828182...
```

## 📝 Sintaxis

### Operadores Básicos
```
+           // Suma
-           // Resta
*           // Multiplicación
/           // División
^           // Potencia (x^2 significa x²)
```

### Ejemplos de Expresiones

#### Expresiones Simples
```
x^2                 // x al cuadrado
x^3                 // x al cubo
2*x                 // 2 multiplicado por x
x/2                 // x dividido por 2
```

#### Funciones Trigonométricas
```
sin(x)              // Seno de x
cos(x)              // Coseno de x
tan(x)              // Tangente de x
sin(x) * cos(x)     // Producto de seno y coseno
```

#### Expresiones Complejas
```
x^2 - 2*x           // Polinomio
x^3 + 3*x^2 - x     // Polinomio cúbico
sin(x)^2            // Seno al cuadrado
cos(x)*x            // Coseno multiplicado por x
exp(-x^2)           // Función gaussiana
1/(1+x^2)           // Función racional
```

#### Con Coeficientes
```
2*sin(x)            // 2 multiplicado por seno
3*x^2               // 3 multiplicado por x²
0.5*cos(x)          // 0.5 multiplicado por coseno
```

## 💡 Consejos

1. **No necesitas escribir `Math.`** - Las funciones `sin`, `cos`, `tan`, etc. funcionan directamente
2. **Usa `^` para potencias** - Escribe `x^2` en lugar de `x**2`
3. **Multiplica explícitamente** - Escribe `2*x` en lugar de `2x` (aunque `2x` también funciona)
4. **Para π usa el número** - Escribe `3.14159` o usa `PI` en la expresión
5. **Paréntesis para claridad** - Usa paréntesis para agrupar: `(x+1)^2`

## 📊 Ejemplos de Integrales Comunes

### Funciones Trigonométricas

| Función | Intervalo | Método Recomendado | Resultado Esperado |
|---------|-----------|-------------------|-------------------|
| `sin(x)` | [0, 3.14159] | Simpson 1/3 | ≈ 2.0 |
| `cos(x)` | [0, 1.5708] | Simpson 1/3 | ≈ 1.0 |
| `sin(x)^2` | [0, 3.14159] | Simpson 1/3 | ≈ 1.57 |

### Funciones Polinómicas

| Función | Intervalo | Método Recomendado | Resultado Esperado |
|---------|-----------|-------------------|-------------------|
| `x^2` | [0, 1] | Trapezoidal | ≈ 0.333 |
| `x^3` | [0, 2] | Simpson 3/8 | = 4.0 |
| `x^2 - 2*x` | [-1, 2] | Simpson 1/3 | ≈ -1.5 |

### Funciones Exponenciales

| Función | Intervalo | Método Recomendado | Resultado Esperado |
|---------|-----------|-------------------|-------------------|
| `exp(x)` | [0, 1] | Simpson 1/3 | ≈ 1.718 |
| `exp(-x^2)` | [-1, 1] | Simpson 3/8 | ≈ 1.493 |

## 🔧 Solución de Problemas

### Error: "Resultado NaN"
- **Causa**: La función no está bien definida para los valores dados
- **Solución**: Verifica que la función sea válida en todo el intervalo [a, b]

### Error: "El número de subintervalos debe ser par/múltiplo de 3/4"
- **Causa**: El método seleccionado requiere un número específico de subintervalos
- **Solución**: 
  - Simpson 1/3: n debe ser par (12, 24, 36...)
  - Simpson 3/8: n debe ser múltiplo de 3 (12, 15, 18...)
  - Boole: n debe ser múltiplo de 4 (12, 16, 20...)

### La gráfica no se muestra correctamente
- **Causa**: Valores muy grandes o muy pequeños
- **Solución**: Ajusta el intervalo [a, b] o cambia la función

## 🎯 Mejores Prácticas

1. **Empieza con n=12** - Es un buen valor por defecto
2. **Aumenta n para más precisión** - Pero ten en cuenta que más puntos = más tiempo de cálculo
3. **Verifica el intervalo** - Asegúrate de que a < b
4. **Funciones periódicas** - Para funciones como sin/cos, usa múltiplos de π
5. **Funciones con discontinuidades** - Evita puntos donde la función no está definida

---

¿Necesitas ayuda? Revisa el archivo `CAMBIOS_TRIGONOMETRIA.md` para más información técnica.
