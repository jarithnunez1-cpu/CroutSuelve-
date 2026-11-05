import React, { useState } from 'react';
import { Play, RotateCcw, Sparkles, AlertCircle, ArrowRight, FileText, Check, HelpCircle, Layers } from 'lucide-react';
import { Matrix, Vector, CroutResult } from '../types/crout';
import { solveCrout, formatNum, toFraction } from '../utils/croutSolver';
import { PRESET_EXERCISES } from '../data/exercises';

interface CalculatorProps {
  onCalculationSuccess: (result: CroutResult) => void;
  onGoToStepByStep: () => void;
  initialPresetId?: string;
  result: CroutResult | null;
}

export const Calculator: React.FC<CalculatorProps> = ({
  onCalculationSuccess,
  onGoToStepByStep,
  initialPresetId,
  result,
}) => {
  const [dimension, setDimension] = useState<number>(2);
  const [matrixAInput, setMatrixAInput] = useState<string[][]>([
    ['2', '1'],
    ['4', '3'],
  ]);
  const [vectorBInput, setVectorBInput] = useState<string[]>(['5', '11']);
  const [formatMode, setFormatMode] = useState<'decimal' | 'fraction'>('decimal');
  const [precision, setPrecision] = useState<number>(4);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Resize matrix
  const handleDimensionChange = (newDim: number) => {
    if (newDim < 2 || newDim > 6) return;
    setDimension(newDim);
    setValidationError(null);

    // Create new matrix inputs preserving existing values if available
    const newA: string[][] = Array.from({ length: newDim }, (_, i) =>
      Array.from({ length: newDim }, (_, j) => {
        if (i < matrixAInput.length && j < (matrixAInput[i]?.length || 0)) {
          return matrixAInput[i][j] || '0';
        }
        return i === j ? '4' : '1';
      })
    );

    const newB: string[] = Array.from({ length: newDim }, (_, i) => {
      if (i < vectorBInput.length) {
        return vectorBInput[i] || '0';
      }
      return '10';
    });

    setMatrixAInput(newA);
    setVectorBInput(newB);
  };

  // Cell change handler
  const handleCellChange = (i: number, j: number, val: string) => {
    setValidationError(null);
    const updated = matrixAInput.map((row, rIdx) =>
      row.map((cell, cIdx) => (rIdx === i && cIdx === j ? val : cell))
    );
    setMatrixAInput(updated);
  };

  const handleVectorChange = (i: number, val: string) => {
    setValidationError(null);
    const updated = [...vectorBInput];
    updated[i] = val;
    setVectorBInput(updated);
  };

  // Helper to parse input strings (allowing expressions or fractions like "3/4" or "-2.5")
  const parseVal = (str: string): number => {
    const trimmed = str.trim();
    if (!trimmed) return NaN;
    if (trimmed.includes('/')) {
      const parts = trimmed.split('/');
      if (parts.length === 2) {
        const num = parseFloat(parts[0]);
        const den = parseFloat(parts[1]);
        if (!isNaN(num) && !isNaN(den) && den !== 0) {
          return num / den;
        }
      }
    }
    return parseFloat(trimmed);
  };

  // Clear inputs
  const handleClear = () => {
    setMatrixAInput(Array.from({ length: dimension }, () => Array(dimension).fill('')));
    setVectorBInput(Array(dimension).fill(''));
    setValidationError(null);
  };

  // Randomize realistic well-conditioned system
  const handleRandomize = () => {
    const newA: string[][] = [];
    const newB: string[] = [];

    for (let i = 0; i < dimension; i++) {
      const row: string[] = [];
      let diagSum = 0;
      for (let j = 0; j < dimension; j++) {
        if (i !== j) {
          const val = Math.floor(Math.random() * 7) - 3; // -3 to 3
          diagSum += Math.abs(val);
          row.push(val.toString());
        } else {
          row.push('0'); // placeholder for diagonal
        }
      }
      // Strictly diagonally dominant to ensure successful Crout decomposition without zero pivots
      const diagVal = diagSum + Math.floor(Math.random() * 5) + 2;
      row[i] = diagVal.toString();
      newA.push(row);
      newB.push((Math.floor(Math.random() * 25) + 5).toString());
    }

    setMatrixAInput(newA);
    setVectorBInput(newB);
    setValidationError(null);
  };

  // Load a preset
  const handleLoadPreset = (presetId: string) => {
    const exercise = PRESET_EXERCISES.find((e) => e.id === presetId);
    if (!exercise) return;

    setDimension(exercise.dimension);
    setMatrixAInput(exercise.matrixA.map((row) => row.map((v) => v.toString())));
    setVectorBInput(exercise.vectorB.map((v) => v.toString()));
    setValidationError(null);

    // Auto-solve the loaded preset for an instantaneous pleasant experience
    const numA: Matrix = exercise.matrixA;
    const numB: Vector = exercise.vectorB;
    const res = solveCrout(numA, numB);
    onCalculationSuccess(res);
  };

  // Special Demo: Zero Pivot Matrix to show genuine error handling
  const handleLoadZeroPivotDemo = () => {
    setDimension(2);
    setMatrixAInput([
      ['0', '2'],
      ['3', '4'],
    ]);
    setVectorBInput(['4', '10']);
    setValidationError(null);
  };

  // Execute solve
  const handleSolve = () => {
    setValidationError(null);

    // Parse matrix A
    const parsedA: Matrix = [];
    for (let i = 0; i < dimension; i++) {
      const row: number[] = [];
      for (let j = 0; j < dimension; j++) {
        const raw = matrixAInput[i]?.[j] ?? '';
        if (raw.trim() === '') {
          setValidationError(`La celda A[${i + 1}, ${j + 1}] está vacía. Por favor ingresa un número.`);
          return;
        }
        const val = parseVal(raw);
        if (isNaN(val) || !isFinite(val)) {
          setValidationError(`El valor ingresado en A[${i + 1}, ${j + 1}] ("${raw}") no es un número válido.`);
          return;
        }
        row.push(val);
      }
      parsedA.push(row);
    }

    // Parse vector b
    const parsedB: Vector = [];
    for (let i = 0; i < dimension; i++) {
      const raw = vectorBInput[i] ?? '';
      if (raw.trim() === '') {
        setValidationError(`El término independiente b[${i + 1}] está vacío.`);
        return;
      }
      const val = parseVal(raw);
      if (isNaN(val) || !isFinite(val)) {
        setValidationError(`El término independiente b[${i + 1}] ("${raw}") no es válido.`);
        return;
      }
      parsedB.push(val);
    }

    // Call the exact Crout mathematical solver
    const calcResult = solveCrout(parsedA, parsedB);

    if (!calcResult.success) {
      setValidationError(calcResult.error || 'Ocurrió un error matemático durante la factorización.');
      onCalculationSuccess(calcResult);
      return;
    }

    onCalculationSuccess(calcResult);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Calculadora Matemática del Método de Crout
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Ingresa los coeficientes de la matriz <span className="font-mono text-blue-300">A</span> y los términos independientes <span className="font-mono text-blue-300">b</span> para resolver el sistema mediante <span className="font-mono text-white">A = L · U</span>.
          </p>
        </div>

        {/* Display formatting toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-900 border border-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setFormatMode('decimal')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              formatMode === 'decimal' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Decimales
          </button>
          <button
            onClick={() => setFormatMode('fraction')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              formatMode === 'fraction' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Fracciones
          </button>
        </div>
      </div>

      {/* Preset Quick Loader Strip */}
      <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Cargar Ejemplos y Casos Típicos
          </span>
          <span className="text-[11px] text-slate-500 font-sans">
            Selecciona un caso para probar instantáneamente
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESET_EXERCISES.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleLoadPreset(preset.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-700/80 hover:border-blue-500 text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="font-mono text-blue-400 font-bold">{preset.dimension}×{preset.dimension}</span>
              <span>{preset.title.split('(')[0].trim()}</span>
            </button>
          ))}

          {/* Zero Pivot Error demonstration button */}
          <button
            onClick={handleLoadZeroPivotDemo}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-950/30 border border-rose-900/50 hover:border-rose-500 text-rose-300 hover:text-rose-200 transition-all cursor-pointer flex items-center gap-1.5"
            title="Matriz no invertible sin pivoteo: prueba la detección de errores reales"
          >
            <span className="font-mono font-bold text-rose-400">2×2</span>
            <span>Demostrar Pivote Nulo (Error)</span>
          </button>
        </div>
      </div>

      {/* Control Strip: Dimension selector & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        {/* Dimension buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-300 whitespace-nowrap">
            Orden de la matriz:
          </span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {[2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                onClick={() => handleDimensionChange(n)}
                className={`w-8 h-7 text-xs font-mono font-semibold rounded-md transition-colors cursor-pointer ${
                  dimension === n
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {n}×{n}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRandomize}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            title="Genera coeficientes con dominancia diagonal"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Aleatoria</span>
          </button>

          <button
            onClick={handleClear}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Limpiar</span>
          </button>

          {formatMode === 'decimal' && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 ml-2 border-l border-slate-700 pl-3">
              <span>Decimales:</span>
              <select
                value={precision}
                onChange={(e) => setPrecision(Number(e.target.value))}
                aria-label="Precisión de decimales"
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded px-1.5 py-1 focus:outline-none focus:border-blue-500"
              >
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={6}>6</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Validation Error Message Banner */}
      {validationError && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-200 text-xs sm:text-sm flex items-start gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-rose-300">Atención Matemática:</div>
            <p className="leading-relaxed">{validationError}</p>
          </div>
        </div>
      )}

      {/* Main Matrix Inputs Grid */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="font-semibold text-white font-sans text-sm">
            Matriz de Coeficientes [A] y Términos Independientes &#123;b&#125;
          </span>
          <span className="hidden sm:inline">Acepta enteros, decimales y fracciones (ej: -3/2, 4.5)</span>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="inline-block min-w-full">
            {/* Headers for columns x_1, x_2, ..., b */}
            <div
              className="grid gap-3 mb-2 font-mono text-xs text-center text-slate-400 font-semibold"
              style={{
                gridTemplateColumns: `repeat(${dimension}, minmax(70px, 1fr)) 40px minmax(80px, 1fr)`,
              }}
            >
              {Array.from({ length: dimension }).map((_, colIdx) => (
                <div key={colIdx} className="text-blue-300">
                  x_{colIdx + 1}
                </div>
              ))}
              <div className="text-slate-500 flex items-center justify-center">=</div>
              <div className="text-sky-400">b</div>
            </div>

            {/* Matrix Rows */}
            <div className="space-y-3">
              {Array.from({ length: dimension }).map((_, rowIdx) => (
                <div
                  key={rowIdx}
                  className="grid gap-3 items-center"
                  style={{
                    gridTemplateColumns: `repeat(${dimension}, minmax(70px, 1fr)) 40px minmax(80px, 1fr)`,
                  }}
                >
                  {/* Cells for matrix A */}
                  {Array.from({ length: dimension }).map((_, colIdx) => (
                    <div key={colIdx} className="relative">
                      <input
                        type="text"
                        value={matrixAInput[rowIdx]?.[colIdx] ?? ''}
                        onChange={(e) => handleCellChange(rowIdx, colIdx, e.target.value)}
                        placeholder={`a${rowIdx + 1}${colIdx + 1}`}
                        className={`w-full py-2.5 px-3 rounded-lg text-center font-mono text-sm font-semibold transition-all focus:outline-none border ${
                          rowIdx === colIdx
                            ? 'bg-slate-950 border-blue-500/40 text-blue-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400'
                            : 'bg-slate-950/80 border-slate-800 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                        }`}
                      />
                      {rowIdx === colIdx && (
                        <span
                          className="absolute -top-1.5 -right-1 text-[9px] text-blue-400 font-mono"
                          title="Elemento Diagonal"
                        >
                          *
                        </span>
                      )}
                    </div>
                  ))}

                  {/* Equal sign */}
                  <div className="text-center font-mono text-slate-500 font-bold">=</div>

                  {/* Cell for vector b */}
                  <div>
                    <input
                      type="text"
                      value={vectorBInput[rowIdx] ?? ''}
                      onChange={(e) => handleVectorChange(rowIdx, e.target.value)}
                      placeholder={`b${rowIdx + 1}`}
                      className="w-full py-2.5 px-3 rounded-lg text-center font-mono text-sm font-semibold bg-sky-950/30 border border-sky-800/60 text-sky-200 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Big Action: Solve button */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Convención Crout: A = L · U con diagonal unitaria en U</span>
          </div>

          <button
            onClick={handleSolve}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Resolver con Método de Crout</span>
          </button>
        </div>
      </div>

      {/* Results Teaser if a calculation is ready */}
      {result && result.success && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-900/50 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Check className="w-4 h-4" />
              <span>Sistema Resuelto con Éxito</span>
            </div>
            <div className="text-lg font-bold text-white font-display">
              Vector Solución Encontrado: [ {result.vectorX.map((v, i) => `x_${i + 1} = ${formatMode === 'decimal' ? formatNum(v, precision) : toFraction(v)}`).join(', ')} ]
            </div>
            <div className="text-xs text-slate-400">
              Residuo máximo ||Ax - b|| = {result.maxResidue.toExponential(3)}
            </div>
          </div>

          <button
            onClick={onGoToStepByStep}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Layers className="w-4 h-4" />
            <span>Ver Resolución Paso a Paso</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
