import { PracticeExercise } from '../types/crout';

export const PRESET_EXERCISES: PracticeExercise[] = [
  {
    id: 'crout-mandatory-demo',
    title: 'Sistema de Prueba Oficial (2×2)',
    level: 'Principiante',
    description:
      'Sistema canónico de 2 variables para comprender los conceptos esenciales de la matriz triangular inferior L y la matriz triangular superior con diagonal unitaria U.',
    physicalContext: 'Equilibrio estático simplificado de una barra biarticulada con dos incógnitas de reacción.',
    dimension: 2,
    matrixA: [
      [2, 1],
      [4, 3],
    ],
    vectorB: [5, 11],
    expectedL: [
      [2, 0],
      [4, 1],
    ],
    expectedU: [
      [1, 0.5],
      [0, 1],
    ],
    expectedY: [2.5, 1],
    expectedX: [2, 1],
    hints: [
      'Primera columna de L: l₁₁ = a₁₁ = 2, l₂₁ = a₂₁ = 4',
      'Elemento de U: u₁₂ = a₁₂ / l₁₁ = 1 / 2 = 0.5',
      'Elemento de L: l₂₂ = a₂₂ - l₂₁ · u₁₂ = 3 - (4 · 0.5) = 1',
    ],
  },
  {
    id: 'civil-beam-3x3',
    title: 'Viga Continua de 3 Apoyos (3×3)',
    level: 'Intermedio',
    description:
      'Ecuación de los Tres Momentos de Clapeyron aplicada a una viga continua de hormigón armado sometida a carga uniforme.',
    physicalContext:
      'En ingeniería civil, las vigas continuas hiperestáticas generan matrices tridiagonales estrictamente dominantes donde los momentos flectores en los apoyos M₁, M₂, M₃ son las incógnitas.',
    dimension: 3,
    matrixA: [
      [4, 1, 0],
      [1, 4, 1],
      [0, 1, 4],
    ],
    vectorB: [18, 24, 18],
    expectedL: [
      [4, 0, 0],
      [1, 3.75, 0],
      [0, 1, 3.7333],
    ],
    expectedU: [
      [1, 0.25, 0],
      [0, 1, 0.2667],
      [0, 0, 1],
    ],
    expectedY: [4.5, 5.2, 3.4286],
    expectedX: [3.4286, 4.2857, 3.4286],
    hints: [
      'La estructura tridiagonal reduce los cálculos de sumatoria ya que muchos elementos fuera de banda son 0.',
      'Comienza con l₁₁ = 4, l₂₁ = 1, l₃₁ = 0.',
    ],
  },
  {
    id: 'civil-truss-3x3',
    title: 'Equilibrio de Nudos en Armadura Plana (3×3)',
    level: 'Intermedio',
    description:
      'Determinación simultánea de esfuerzos axiales (tracción y compresión) en barras concurrentes de una cercha tipo Pratt.',
    physicalContext:
      'Las ecuaciones de equilibrio estático ΣFx = 0 y ΣFy = 0 para nudos estructurales se ensamblan en un sistema lineal donde el vector b representa las cargas puntuales externas en kilonewtons (kN).',
    dimension: 3,
    matrixA: [
      [3, -1, 2],
      [1, 2, 3],
      [2, -2, -1],
    ],
    vectorB: [12, 11, 2],
    expectedL: [
      [3, 0, 0],
      [1, 2.3333, 0],
      [2, -1.3333, -3.8571],
    ],
    expectedU: [
      [1, -0.3333, 0.6667],
      [0, 1, 1],
      [0, 0, 1],
    ],
    expectedY: [4, 3, 1],
    expectedX: [3, 2, 1],
    hints: [
      'Calcula la primera columna de L directamente desde A.',
      'Obtén u₁₂ y u₁₃ dividiendo entre el pivote l₁₁ = 3.',
    ],
  },
  {
    id: 'civil-frame-4x4',
    title: 'Pórtico Estructural Multipiso (4×4)',
    level: 'Avanzado',
    description:
      'Matriz de rigidez lateral de un pórtico de 4 niveles sometido a fuerzas sísmicas horizontales por piso.',
    physicalContext:
      'En el Método de Rigidez Directa, [K]{u} = {F}, los desplazamientos laterales relativos entre entrepisos {u} se obtienen factorizando la matriz de rigidez global [K].',
    dimension: 4,
    matrixA: [
      [5, -2, 0, 0],
      [-2, 6, -3, 0],
      [0, -3, 7, -2],
      [0, 0, -2, 4],
    ],
    vectorB: [10, 15, 20, 8],
    expectedL: [
      [5, 0, 0, 0],
      [-2, 5.2, 0, 0],
      [0, -3, 5.2692, 0],
      [0, 0, -2, 3.2409],
    ],
    expectedU: [
      [1, -0.4, 0, 0],
      [0, 1, -0.5769, 0],
      [0, 0, 1, -0.3796],
      [0, 0, 0, 1],
    ],
    expectedY: [2, 3.6538, 5.8759, 6.2422],
    expectedX: [4.6976, 6.744, 8.2435, 6.2422],
    hints: [
      'Al ser una matriz de rigidez de banda simétrica, los elementos distantes a la diagonal son cero.',
      'Sigue rigurosamente la secuencia de columnas.',
    ],
  },
  {
    id: 'hydraulics-pipe-3x3',
    title: 'Red de Distribución Hidráulica (3×3)',
    level: 'Avanzado',
    description:
      'Cálculo de caudales y pérdidas de carga piezométrica en un circuito mallado cerrado de abastecimiento de agua potable.',
    physicalContext:
      'Linealización del balance de presiones en anillos hidráulicos interconectados mediante la ecuación de Hazen-Williams/Colebrook-White.',
    dimension: 3,
    matrixA: [
      [2, 1, -1],
      [-3, -1, 2],
      [-2, 1, 2],
    ],
    vectorB: [8, -11, -3],
    expectedL: [
      [2, 0, 0],
      [-3, 0.5, 0],
      [-2, 2, -3],
    ],
    expectedU: [
      [1, 0.5, -0.5],
      [0, 1, 1],
      [0, 0, 1],
    ],
    expectedY: [4, 2, 3],
    expectedX: [2, 3, -1],
    hints: [
      'Presta especial atención a los signos negativos al multiplicar los productos en la suma acumulada.',
      'El pivote l₂₂ = -1 - (-3 · 0.5) = 0.5.',
    ],
  },
];
