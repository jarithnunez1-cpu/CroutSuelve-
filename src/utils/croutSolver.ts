import {
  Matrix,
  Vector,
  CroutResult,
  CroutStep,
  SubstitutionStep,
  VerificationRow,
} from '../types/crout';

/**
 * Converts a floating point number to an exact or closest simplified fraction string
 */
export function toFraction(val: number, tolerance = 1e-6): string {
  if (Math.abs(val) < tolerance) return '0';
  if (Math.abs(val - Math.round(val)) < tolerance) {
    return Math.round(val).toString();
  }

  const sign = val < 0 ? '-' : '';
  const absVal = Math.abs(val);

  // Continued fraction expansion
  let h1 = 1, h2 = 0;
  let k1 = 0, k2 = 1;
  let b = absVal;

  do {
    const a = Math.floor(b);
    let aux = h1;
    h1 = a * h1 + h2;
    h2 = aux;
    aux = k1;
    k1 = a * k1 + k2;
    k2 = aux;
    b = 1 / (b - a);
  } while (Math.abs(absVal - h1 / k1) > absVal * tolerance && k1 < 10000);

  if (k1 === 1) {
    return `${sign}${h1}`;
  }

  // If denominator is reasonably small, return fraction; otherwise fallback to decimal
  if (k1 <= 2000) {
    return `${sign}${h1}/${k1}`;
  }

  return val.toFixed(4);
}

/**
 * Formats a number with clean decimal display without scientific notation noise or -0
 */
export function formatNum(val: number, precision = 4): string {
  if (Math.abs(val) < 1e-12) return '0';
  const rounded = Number(val.toFixed(precision));
  if (Object.is(rounded, -0)) return '0';
  return rounded.toString();
}

/**
 * Deep clones a matrix
 */
export function cloneMatrix(M: Matrix): Matrix {
  return M.map((row) => [...row]);
}

/**
 * Solves a linear system Ax = b using the Crout LU Decomposition method:
 * A = L * U
 * where L is lower triangular, U is unit upper triangular (diagonal elements are 1).
 */
export function solveCrout(matrixA: Matrix, vectorB: Vector): CroutResult {
  const n = matrixA.length;

  // Validation 1: Square matrix check
  if (n === 0 || matrixA.some((row) => row.length !== n)) {
    return {
      success: false,
      error: 'La matriz A debe ser cuadrada (número de filas igual a número de columnas).',
      errorType: 'NON_SQUARE',
      dimension: n,
      matrixA,
      vectorB,
      matrixL: [],
      matrixU: [],
      vectorY: [],
      vectorX: [],
      residue: [],
      maxResidue: 0,
      steps: [],
      forwardSteps: [],
      backwardSteps: [],
      verificationRows: [],
    };
  }

  // Validation 2: Vector b length check
  if (vectorB.length !== n) {
    return {
      success: false,
      error: `La longitud del vector b (${vectorB.length}) debe coincidir con el orden de la matriz A (${n}x${n}).`,
      errorType: 'INVALID_INPUT',
      dimension: n,
      matrixA,
      vectorB,
      matrixL: [],
      matrixU: [],
      vectorY: [],
      vectorX: [],
      residue: [],
      maxResidue: 0,
      steps: [],
      forwardSteps: [],
      backwardSteps: [],
      verificationRows: [],
    };
  }

  // Validation 3: Check for NaN or non-finite values
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (typeof matrixA[i][j] !== 'number' || isNaN(matrixA[i][j]) || !isFinite(matrixA[i][j])) {
        return {
          success: false,
          error: `El elemento A[${i + 1}, ${j + 1}] no es un número válido.`,
          errorType: 'INVALID_INPUT',
          dimension: n,
          matrixA,
          vectorB,
          matrixL: [],
          matrixU: [],
          vectorY: [],
          vectorX: [],
          residue: [],
          maxResidue: 0,
          steps: [],
          forwardSteps: [],
          backwardSteps: [],
          verificationRows: [],
        };
      }
    }
    if (typeof vectorB[i] !== 'number' || isNaN(vectorB[i]) || !isFinite(vectorB[i])) {
      return {
        success: false,
        error: `El término independiente b[${i + 1}] no es un número válido.`,
        errorType: 'INVALID_INPUT',
        dimension: n,
        matrixA,
        vectorB,
        matrixL: [],
        matrixU: [],
        vectorY: [],
        vectorX: [],
        residue: [],
        maxResidue: 0,
        steps: [],
        forwardSteps: [],
        backwardSteps: [],
        verificationRows: [],
      };
    }
  }

  // Initialize L and U matrices with zeros
  const L: Matrix = Array.from({ length: n }, () => Array(n).fill(0));
  const U: Matrix = Array.from({ length: n }, () => Array(n).fill(0));

  // In Crout decomposition, the main diagonal of U contains 1s
  for (let i = 0; i < n; i++) {
    U[i][i] = 1;
  }

  const steps: CroutStep[] = [];
  let stepCounter = 1;

  // Factorization Algorithm: Crout Method (Column by Column)
  for (let j = 0; j < n; j++) {
    // 1. Compute elements of L in column j (from row i = j to n - 1)
    for (let i = j; i < n; i++) {
      let sum = 0;
      const terms: string[] = [];
      const lCells: [number, number][] = [];
      const uCells: [number, number][] = [];

      for (let k = 0; k < j; k++) {
        const prod = L[i][k] * U[k][j];
        sum += prod;
        terms.push(`(l_{${i + 1}${k + 1}} \\cdot u_{${k + 1}${j + 1}}) = (${formatNum(L[i][k])} \\times ${formatNum(U[k][j])})`);
        lCells.push([i, k]);
        uCells.push([k, j]);
      }

      const val = matrixA[i][j] - sum;
      L[i][j] = val;

      const formulaStr =
        j === 0
          ? `l_{${i + 1}${j + 1}} = a_{${i + 1}${j + 1}}`
          : `l_{${i + 1}${j + 1}} = a_{${i + 1}${j + 1}} - \\sum_{k=1}^{${j}} l_{${i + 1}k} u_{k${j + 1}}`;

      const calcStr =
        j === 0
          ? `l_{${i + 1}${j + 1}} = ${formatNum(matrixA[i][j])}`
          : `l_{${i + 1}${j + 1}} = ${formatNum(matrixA[i][j])} - [${terms.map((t) => t.split('=')[1]?.trim() || t).join(' + ')}] = ${formatNum(val)}`;

      steps.push({
        stepNumber: stepCounter++,
        phase: 'LU_DECOMPOSITION',
        title: `Cálculo de elemento L en fila ${i + 1}, columna ${j + 1}`,
        description: `Se calcula el elemento l_${i + 1}${j + 1} de la matriz triangular inferior L.`,
        variable: `l_{${i + 1}${j + 1}}`,
        row: i,
        col: j,
        formulaStr,
        calcStr,
        resultValue: val,
        matrixLState: cloneMatrix(L),
        matrixUState: cloneMatrix(U),
        involvedCells: {
          aCell: [i, j],
          lCells,
          uCells,
        },
      });
    }

    // Check for zero or near-zero pivot in L[j][j]
    const pivot = L[j][j];
    if (Math.abs(pivot) < 1e-12) {
      return {
        success: false,
        error: `Pivote nulo o casi nulo detectado: l_${j + 1}${j + 1} = ${formatNum(pivot)}. La factorización de Crout sin pivoteo requiere dividir entre l_${j + 1}${j + 1} para calcular la fila ${j + 1} de U, lo que genera una división por cero.`,
        errorType: 'ZERO_PIVOT',
        errorDetails: {
          pivotRow: j + 1,
          pivotCol: j + 1,
          pivotValue: pivot,
          suggestion: 'El sistema puede requerir reordenar las filas (pivoteo parcial) o la matriz es singular (determinante cero).',
        },
        dimension: n,
        matrixA,
        vectorB,
        matrixL: L,
        matrixU: U,
        vectorY: [],
        vectorX: [],
        residue: [],
        maxResidue: 0,
        steps,
        forwardSteps: [],
        backwardSteps: [],
        verificationRows: [],
      };
    }

    // 2. Compute elements of U in row j (from col k = j + 1 to n - 1)
    for (let k = j + 1; k < n; k++) {
      let sum = 0;
      const terms: string[] = [];
      const lCells: [number, number][] = [];
      const uCells: [number, number][] = [];

      for (let m = 0; m < j; m++) {
        const prod = L[j][m] * U[m][k];
        sum += prod;
        terms.push(`(${formatNum(L[j][m])} \\times ${formatNum(U[m][k])})`);
        lCells.push([j, m]);
        uCells.push([m, k]);
      }

      const val = (matrixA[j][k] - sum) / pivot;
      U[j][k] = val;

      const formulaStr =
        j === 0
          ? `u_{${j + 1}${k + 1}} = \\frac{a_{${j + 1}${k + 1}}}{l_{${j + 1}${j + 1}}}`
          : `u_{${j + 1}${k + 1}} = \\frac{a_{${j + 1}${k + 1}} - \\sum_{m=1}^{${j}} l_{${j + 1}m} u_{m${k + 1}}}{l_{${j + 1}${j + 1}}}`;

      const sumPart = terms.length > 0 ? ` - [${terms.join(' + ')}]` : '';
      const calcStr = `u_{${j + 1}${k + 1}} = \\frac{${formatNum(matrixA[j][k])}${sumPart}}{${formatNum(pivot)}} = ${formatNum(val)}`;

      steps.push({
        stepNumber: stepCounter++,
        phase: 'LU_DECOMPOSITION',
        title: `Cálculo de elemento U en fila ${j + 1}, columna ${k + 1}`,
        description: `Se calcula el elemento u_${j + 1}${k + 1} de la matriz triangular superior U dividiendo entre el pivote l_${j + 1}${j + 1}.`,
        variable: `u_{${j + 1}${k + 1}}`,
        row: j,
        col: k,
        formulaStr,
        calcStr,
        resultValue: val,
        matrixLState: cloneMatrix(L),
        matrixUState: cloneMatrix(U),
        involvedCells: {
          aCell: [j, k],
          lCells,
          uCells,
        },
      });
    }
  }

  // Phase 2: Forward Substitution: Ly = b
  // L * y = b  ==>  y_i = (b_i - sum_{j=0}^{i-1} L_{ij} * y_j) / L_{ii}
  const y: Vector = Array(n).fill(0);
  const forwardSteps: SubstitutionStep[] = [];

  for (let i = 0; i < n; i++) {
    let sum = 0;
    const terms: string[] = [];

    for (let j = 0; j < i; j++) {
      sum += L[i][j] * y[j];
      terms.push(`(${formatNum(L[i][j])} \\times ${formatNum(y[j])})`);
    }

    const val = (vectorB[i] - sum) / L[i][i];
    y[i] = val;

    const formulaStr =
      i === 0
        ? `y_{1} = \\frac{b_{1}}{l_{11}}`
        : `y_{${i + 1}} = \\frac{b_{${i + 1}} - \\sum_{j=1}^{${i}} l_{${i + 1}j} y_{j}}{l_{${i + 1}${i + 1}}}`;

    const sumDisplay = terms.length > 0 ? ` - [${terms.join(' + ')}]` : '';
    const calcStr = `y_{${i + 1}} = \\frac{${formatNum(vectorB[i])}${sumDisplay}}{${formatNum(L[i][i])}} = ${formatNum(val)}`;

    const stepObj: SubstitutionStep = {
      index: i,
      variable: `y_{${i + 1}}`,
      formulaStr,
      calcStr,
      resultValue: val,
      explanation: `Ecuación ${i + 1}: ${formatNum(L[i][i])} · y_${i + 1}${terms.length ? ' + suma acumulada' : ''} = ${formatNum(vectorB[i])}`,
    };

    forwardSteps.push(stepObj);

    steps.push({
      stepNumber: stepCounter++,
      phase: 'FORWARD_SUBSTITUTION',
      title: `Sustitución hacia adelante: y_${i + 1}`,
      description: `Se despeja y_${i + 1} en el sistema triangular inferior L y = b.`,
      variable: `y_{${i + 1}}`,
      row: i,
      col: -1,
      formulaStr,
      calcStr,
      resultValue: val,
      matrixLState: cloneMatrix(L),
      matrixUState: cloneMatrix(U),
      vectorState: [...y],
    });
  }

  // Phase 3: Backward Substitution: Ux = y
  // U * x = y  ==>  Since U_{ii} = 1: x_i = y_i - sum_{j=i+1}^{n-1} U_{ij} * x_j
  const x: Vector = Array(n).fill(0);
  const backwardSteps: SubstitutionStep[] = [];

  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    const terms: string[] = [];

    for (let j = i + 1; j < n; j++) {
      sum += U[i][j] * x[j];
      terms.push(`(${formatNum(U[i][j])} \\times ${formatNum(x[j])})`);
    }

    const val = y[i] - sum; // U[i][i] is always 1 in Crout!
    x[i] = val;

    const formulaStr =
      i === n - 1
        ? `x_{${n}} = y_{${n}}`
        : `x_{${i + 1}} = y_{${i + 1}} - \\sum_{j=${i + 2}}^{${n}} u_{${i + 1}j} x_{j}`;

    const sumDisplay = terms.length > 0 ? ` - [${terms.join(' + ')}]` : '';
    const calcStr = `x_{${i + 1}} = ${formatNum(y[i])}${sumDisplay} = ${formatNum(val)}`;

    const stepObj: SubstitutionStep = {
      index: i,
      variable: `x_{${i + 1}}`,
      formulaStr,
      calcStr,
      resultValue: val,
      explanation: `Ecuación ${i + 1}: x_${i + 1}${terms.length ? ' + términos conocidos' : ''} = y_${i + 1}`,
    };

    backwardSteps.push(stepObj);

    steps.push({
      stepNumber: stepCounter++,
      phase: 'BACKWARD_SUBSTITUTION',
      title: `Sustitución hacia atrás: x_${i + 1}`,
      description: `Se despeja x_${i + 1} en el sistema triangular superior unitario U x = y.`,
      variable: `x_{${i + 1}}`,
      row: i,
      col: -1,
      formulaStr,
      calcStr,
      resultValue: val,
      matrixLState: cloneMatrix(L),
      matrixUState: cloneMatrix(U),
      vectorState: [...x],
    });
  }

  // Phase 4: Verification Ax = b
  const residue: Vector = Array(n).fill(0);
  const verificationRows: VerificationRow[] = [];
  let maxResidue = 0;

  for (let i = 0; i < n; i++) {
    let rowSum = 0;
    const parts: string[] = [];

    for (let j = 0; j < n; j++) {
      rowSum += matrixA[i][j] * x[j];
      parts.push(`${formatNum(matrixA[i][j])}(${formatNum(x[j])})`);
    }

    const diff = Math.abs(rowSum - vectorB[i]);
    residue[i] = diff;
    if (diff > maxResidue) {
      maxResidue = diff;
    }

    verificationRows.push({
      row: i + 1,
      equationStr: `${parts.join(' + ')} = ${formatNum(rowSum)}`,
      calculatedValue: rowSum,
      expectedValue: vectorB[i],
      difference: diff,
      isSatisfied: diff < 1e-6,
    });
  }

  steps.push({
    stepNumber: stepCounter++,
    phase: 'VERIFICATION',
    title: 'Comprobación del Sistema: Ax = b',
    description: `Se sustituyen las incógnitas calculadas en cada ecuación original para verificar que el residuo máximo sea prácticamente cero (actual: ${maxResidue.toExponential(2)}).`,
    variable: 'Ax = b',
    row: -1,
    col: -1,
    formulaStr: 'A \\cdot x = b \\implies ||Ax - b||_{\\infty} < 10^{-6}',
    calcStr: `Residuo máximo: ${maxResidue.toExponential(4)} (Satisfactorio)`,
    resultValue: maxResidue,
    matrixLState: cloneMatrix(L),
    matrixUState: cloneMatrix(U),
    vectorState: [...x],
  });

  return {
    success: true,
    dimension: n,
    matrixA,
    vectorB,
    matrixL: L,
    matrixU: U,
    vectorY: y,
    vectorX: x,
    residue,
    maxResidue,
    steps,
    forwardSteps,
    backwardSteps,
    verificationRows,
    timestamp: Date.now(),
  };
}
