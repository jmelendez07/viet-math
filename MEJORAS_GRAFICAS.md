# Mejoras en la Visualización de Gráficas

## 🎨 Cambios Implementados

### 1. **Soporte para Todos los Cuadrantes**

Ahora la gráfica muestra automáticamente los cuadrantes correctos basándose en el intervalo [a, b]:

- **Cuadrante I (x > 0, y > 0)**: Cuando a ≥ 0
- **Cuadrante II (x < 0, y > 0)**: Cuando a < 0 y b ≤ 0
- **Cuadrantes I y II**: Cuando a < 0 y b > 0 (cruza el eje Y)
- **Cuadrantes III y IV**: Cuando la función tiene valores negativos

### 2. **Ejes Cartesianos Mejorados**

#### Eje Y (Vertical)
- Se muestra automáticamente cuando el intervalo cruza x = 0
- Línea más gruesa y visible (strokeWidth: 2)
- Color oscuro (#374151) para mejor contraste
- **Condición**: Solo aparece si a ≤ 0 y b ≥ 0

#### Eje X (Horizontal)
- Siempre visible en y = 0
- Línea más gruesa (strokeWidth: 2)
- Ayuda a identificar valores positivos y negativos

### 3. **Ajuste Automático del Dominio Y**

La gráfica ahora calcula automáticamente el rango óptimo del eje Y:

```typescript
// Encuentra los valores mínimo y máximo de la función
minY y maxY

// Agrega 10% de padding para mejor visualización
yPadding = (maxY - minY) * 0.1

// Dominio final
yDomain = [minY - yPadding, maxY + yPadding]
```

**Ventajas**:
- ✅ Aprovecha mejor el espacio disponible
- ✅ Evita que la gráfica se vea "aplastada"
- ✅ Muestra claramente valores negativos
- ✅ Se ajusta automáticamente a cada función

### 4. **Manejo Mejorado de Valores Infinitos**

El código ahora valida que todos los valores sean finitos:

```typescript
if (isFinite(fxValue)) {
  minY = Math.min(minY, fxValue);
  maxY = Math.max(maxY, fxValue);
}
```

Esto previene errores cuando la función tiene:
- Asíntotas verticales
- Divisiones por cero
- Valores indefinidos

### 5. **Tooltip Mejorado**

El tooltip ahora maneja correctamente valores especiales:

```typescript
formatter={(value: any) => {
  if (typeof value === 'number' && isFinite(value)) {
    return [value.toFixed(6), ''];
  }
  return [value, ''];
}}
```

## 📊 Ejemplos de Uso

### Ejemplo 1: Función en el Segundo Cuadrante
```
Función: x^3 - 2*x
Intervalo: [-1, 2]
```
**Resultado**: Muestra los cuadrantes II, I, III y IV con el eje Y visible en x = 0

### Ejemplo 2: Función Solo en el Segundo Cuadrante
```
Función: sin(x)
Intervalo: [-3.14159, 0]
```
**Resultado**: Muestra el segundo cuadrante completo sin el eje Y

### Ejemplo 3: Función con Valores Negativos
```
Función: x^2 - 4
Intervalo: [-3, 3]
```
**Resultado**: Muestra parábola que cruza el eje X, con valores negativos claramente visibles

### Ejemplo 4: Función Coseno
```
Función: cos(x)
Intervalo: [0, 6.28]
```
**Resultado**: Muestra la curva completa del coseno con valores entre -1 y 1, bien centrada

## 🎯 Características Visuales

### Colores por Método
- **Trapezoidal**: Rojo (#ef4444)
- **Boole**: Naranja (#f59e0b)
- **Simpson 3/8**: Púrpura (#8b5cf6)
- **Simpson 1/3**: Rosa (#ec4899)
- **Simpson Abierto**: Verde (#10b981)

### Elementos Gráficos
1. **Área bajo la curva**: Color suave con 15% de opacidad
2. **Curva de la función**: Línea gruesa (3px) del color del método
3. **Puntos de aproximación**: Puntos rojos (5px de radio) en las iteraciones
4. **Línea de aproximación**: Línea roja (2.5px) conectando los puntos

### Grid y Referencias
- **Grid**: Líneas punteadas grises (#e5e7eb)
- **Eje X**: Línea sólida oscura en y = 0
- **Eje Y**: Línea sólida oscura en x = 0 (cuando aplica)

## 🔍 Comparación Antes/Después

### Antes
- ❌ Solo mostraba el primer cuadrante
- ❌ Dominio Y no optimizado
- ❌ Ejes poco visibles
- ❌ Funciones con valores negativos se veían mal

### Después
- ✅ Muestra todos los cuadrantes necesarios
- ✅ Dominio Y ajustado automáticamente con padding
- ✅ Ejes X e Y claramente marcados
- ✅ Visualización óptima para cualquier función
- ✅ Manejo robusto de valores infinitos/indefinidos

## 💡 Recomendaciones

1. **Para funciones en x < 0**: Usa intervalos como [-2, 0] o [-3, 1]
2. **Para visualizar mejor**: El padding automático del 10% da un buen margen
3. **Funciones con discontinuidades**: El código maneja valores NaN/Infinity automáticamente
4. **Funciones simétricas**: Usa intervalos como [-a, a] para ver ambos lados

## 🧪 Pruebas Sugeridas

| Función | Intervalo | Cuadrantes Visibles |
|---------|-----------|-------------------|
| `x^2` | [-2, 2] | I, II |
| `x^3` | [-2, 2] | II, I, IV, III |
| `sin(x)` | [-3.14, 3.14] | II, I, IV, III |
| `cos(x)` | [0, 6.28] | I, IV |
| `-x^2` | [-2, 2] | III, IV |
| `x^2 - 4` | [-3, 3] | Todos |

---

**Implementado**: Noviembre 19, 2025  
**Versión**: 1.1
