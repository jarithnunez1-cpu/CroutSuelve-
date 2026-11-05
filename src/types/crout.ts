export type Matrix = number[][];
export type Vector = number[];

export interface CroutStep {
  stepNumber: number;
  phase: 'LU_DECOMPOSITION' | 'FORWARD_SUBSTITUTION' | 'BACKWARD_SUBSTITUTION' | 'VERIFICATION';
  title: string;
  description: string;
  variable: string; // e.g. "l_{21}", "u_{12}", "y_1", "x_2"
  row: number; // 0-indexed
  col: number; // 0-indexed (-1 for vector)
  formulaStr: string;
  calcStr: string;
  resultValue: number;
  matrixLState: Matrix;
  matrixUState: Matrix;
  vectorState?: Vector;
  involvedCells?: {
    lCells?: [number, number][];
    uCells?: [number, number][];
    aCell?: [number, number];
  };
}

export interface SubstitutionStep {
  index: number; // 0-indexed equation
  variable: string; // "y_1", "x_2"
  formulaStr: string;
  calcStr: string;
  resultValue: number;
  explanation: string;
}

export interface VerificationRow {
  row: number;
  equationStr: string;
  calculatedValue: number;
  expectedValue: number;
  difference: number;
  isSatisfied: boolean;
}

export interface CroutResult {
  success: boolean;
  error?: string;
  errorType?: 'SINGULAR' | 'ZERO_PIVOT' | 'INVALID_INPUT' | 'NON_SQUARE' | 'UNKNOWN';
  errorDetails?: {
    pivotRow?: number;
    pivotCol?: number;
    pivotValue?: number;
    suggestion?: string;
  };
  dimension: number;
  matrixA: Matrix;
  vectorB: Vector;
  matrixL: Matrix;
  matrixU: Matrix;
  vectorY: Vector;
  vectorX: Vector;
  residue: Vector;
  maxResidue: number;
  steps: CroutStep[];
  forwardSteps: SubstitutionStep[];
  backwardSteps: SubstitutionStep[];
  verificationRows: VerificationRow[];
  timestamp?: number;
}

export interface HistoryItem {
  id: string;
  title: string;
  timestamp: number;
  dimension: number;
  matrixA: Matrix;
  vectorB: Vector;
  vectorX: Vector;
  maxResidue: number;
  category?: string;
}

export interface PracticeExercise {
  id: string;
  title: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Ingeniería Civil';
  description: string;
  physicalContext?: string;
  dimension: number;
  matrixA: Matrix;
  vectorB: Vector;
  expectedL: Matrix;
  expectedU: Matrix;
  expectedY: Vector;
  expectedX: Vector;
  hints: string[];
}
