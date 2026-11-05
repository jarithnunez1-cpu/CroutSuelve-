import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  List,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Building2,
  Sparkles,
} from 'lucide-react';
import { CroutResult, CroutStep } from '../types/crout';
import { formatNum, toFraction } from '../utils/croutSolver';
import { exportResultToPDF } from '../utils/pdfExport';

interface StepByStepVisualizerProps {
  result: CroutResult;
  onGoToCalculator: () => void;
  onGoToEngineering?: () => void;
}

export const StepByStepVisualizer: React.FC<StepByStepVisualizerProps> = ({
  result,
  onGoToCalculator,
  onGoToEngineering,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1500); // ms per step
  const [viewMode, setViewMode] = useState<'stepper' | 'fullList'>('stepper');
  const [numberFormat, setNumberFormat] = useState<'decimal' | 'fraction'>('decimal');
  const [copiedFormula, setCopiedFormula] = useState<boolean>(false);

  const steps = result.steps;
  const currentStep: CroutStep | undefined = steps[currentStepIdx] || steps[0];

  // Auto-play timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playSpeed, steps.length]);

  const handleCopyFormula = () => {
    if (!currentStep) return;
    navigator.clipboard.writeText(`${currentStep.formulaStr} => ${currentStep.calcStr}`);
    setCopiedFormula(true);
    setTimeout(() => setCopiedFormula(false), 2000);
  };

  const jumpToPhase = (phase: CroutStep['phase']) => {
    const idx = steps.findIndex((s) => s.phase === phase);
    if (idx !== -1) {
      setCurrentStepIdx(idx);
    }
  };

  const renderValue = (val: number) => {
    return numberFormat === 'decimal' ? formatNum(val, 4) : toFraction(val);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Visualizer Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-wider">
            <span>Resolución Paso a Paso</span>
            <span aria-hidden="true">·</span>
            <span>Orden {result.dimension}×{result.dimension}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-0.5">
            Trazabilidad Completa del Método de Crout
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Format mode */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs">
            <button
              onClick={() => setNumberFormat('decimal')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                numberFormat === 'decimal' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Decimales
            </button>
            <button
              onClick={() => setNumberFormat('fraction')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                numberFormat === 'fraction' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Fracciones
            </button>
          </div>

          {/* View mode toggle */}
          <button
            onClick={() => setViewMode(viewMode === 'stepper' ? 'fullList' : 'stepper')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <List className="w-3.5 h-3.5 text-blue-400" />
            <span>{viewMode === 'stepper' ? 'Ver Lista Completa' : 'Ver Modo Interactivo'}</span>
          </button>

          {/* PDF Export */}
          <button
            onClick={() => exportResultToPDF(result)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>

      {/* Phase Jump Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs text-slate-400 font-mono whitespace-nowrap mr-2">Fases:</span>
        <button
          onClick={() => jumpToPhase('LU_DECOMPOSITION')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
            currentStep?.phase === 'LU_DECOMPOSITION'
              ? 'bg-blue-600/20 border-blue-500 text-blue-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          1. Factorización LU (A = L · U)
        </button>

        <button
          onClick={() => jumpToPhase('FORWARD_SUBSTITUTION')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
            currentStep?.phase === 'FORWARD_SUBSTITUTION'
              ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          2. Sustitución Adelante (Ly = b)
        </button>

        <button
          onClick={() => jumpToPhase('BACKWARD_SUBSTITUTION')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
            currentStep?.phase === 'BACKWARD_SUBSTITUTION'
              ? 'bg-sky-600/20 border-sky-500 text-sky-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          3. Sustitución Atrás (Ux = y)
        </button>

        <button
          onClick={() => jumpToPhase('VERIFICATION')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
            currentStep?.phase === 'VERIFICATION'
              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          4. Comprobación (Ax = b)
        </button>
      </div>

      {viewMode === 'stepper' && currentStep && (
        <div className="space-y-6">
          {/* Active Step Hero Card */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
            {/* Step Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-blue-600/20 text-blue-400 text-xs font-mono font-bold">
                    Paso {currentStepIdx + 1} de {steps.length}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Variable objetivo: <strong className="text-white font-mono">{currentStep.variable}</strong>
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                  {currentStep.title}
                </h2>
              </div>

              {/* Playback controls */}
              <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <button
                  onClick={() => setCurrentStepIdx(0)}
                  disabled={currentStepIdx === 0}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors cursor-pointer"
                  title="Reiniciar al paso 1"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentStepIdx((prev) => Math.max(0, prev - 1))}
                  disabled={currentStepIdx === 0}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors cursor-pointer"
                  title="Paso anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isPlaying
                      ? 'bg-amber-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                  title={isPlaying ? 'Pausar reproducción' : 'Reproducir automáticamente'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  <span>{isPlaying ? 'Pausa' : 'Auto'}</span>
                </button>

                <button
                  onClick={() => setCurrentStepIdx((prev) => Math.min(steps.length - 1, prev + 1))}
                  disabled={currentStepIdx === steps.length - 1}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors cursor-pointer"
                  title="Siguiente paso"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Speed selector */}
                <select
                  value={playSpeed}
                  onChange={(e) => setPlaySpeed(Number(e.target.value))}
                  aria-label="Velocidad de reproducción"
                  className="text-[11px] bg-slate-900 border border-slate-800 text-slate-300 rounded px-1.5 py-1 focus:outline-none"
                >
                  <option value={2500}>0.5x</option>
                  <option value={1500}>1.0x</option>
                  <option value={800}>2.0x</option>
                </select>
              </div>
            </div>

            {/* Formula and Numerical Operation Spotlight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Formula card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Fórmula Algebraica Aplicada</span>
                  <button
                    onClick={handleCopyFormula}
                    className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                    title="Copiar fórmula"
                  >
                    {copiedFormula ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedFormula ? 'Copiada' : 'Copiar'}</span>
                  </button>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg font-mono text-sm sm:text-base text-blue-300 overflow-x-auto text-center">
                  {currentStep.formulaStr}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {currentStep.description}
                </p>
              </div>

              {/* Substitution & Result card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="text-xs text-slate-400 font-mono">
                  Sustitución Numérica y Valor Calculado
                </div>
                <div className="p-3 bg-slate-900 rounded-lg font-mono text-sm sm:text-base text-emerald-300 overflow-x-auto text-center font-bold">
                  {currentStep.calcStr}
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">Resultado obtenido:</span>
                  <span className="font-mono text-white font-bold text-sm bg-blue-600/30 px-2 py-0.5 rounded border border-blue-500/40">
                    {currentStep.variable} = {renderValue(currentStep.resultValue)}
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Dynamic Matrix Highlight Grid */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300 font-sans">
                  Estado Dinámico de las Matrices en este Paso:
                </span>
                <span className="text-[11px] font-mono text-blue-400">
                  Azul: Celda calculada · Verde: Matriz L · Cian: Matriz U
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. Matrix A */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="text-xs font-semibold text-slate-300 font-mono flex items-center justify-between">
                    <span>Matriz [A] Original</span>
                    <span className="text-[10px] text-slate-500">Coeficientes</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-center font-mono text-xs">
                      <tbody>
                        {result.matrixA.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((val, cIdx) => {
                              const isTarget = currentStep.row === rIdx && currentStep.col === cIdx;
                              return (
                                <td
                                  key={cIdx}
                                  className={`p-2 rounded border transition-all ${
                                    isTarget
                                      ? 'bg-blue-600/40 border-blue-400 text-white font-bold ring-2 ring-blue-500'
                                      : 'border-slate-800/80 text-slate-400'
                                  }`}
                                >
                                  {formatNum(val, 2)}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Matrix L */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="text-xs font-semibold text-emerald-400 font-mono flex items-center justify-between">
                    <span>Matriz [L] (Triangular Inf.)</span>
                    <span className="text-[10px] text-slate-500">l_ij = 0 si j &gt; i</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-center font-mono text-xs">
                      <tbody>
                        {currentStep.matrixLState.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((val, cIdx) => {
                              const isCurrentCell =
                                currentStep.phase === 'LU_DECOMPOSITION' &&
                                currentStep.row === rIdx &&
                                currentStep.col === cIdx;
                              const isUpperZero = cIdx > rIdx;

                              return (
                                <td
                                  key={cIdx}
                                  className={`p-2 rounded border transition-all ${
                                    isCurrentCell
                                      ? 'bg-emerald-600/50 border-emerald-400 text-white font-bold ring-2 ring-emerald-500'
                                      : isUpperZero
                                      ? 'border-slate-900 text-slate-700 bg-slate-950'
                                      : val !== 0
                                      ? 'border-emerald-950 bg-emerald-950/20 text-emerald-300'
                                      : 'border-slate-800/60 text-slate-500'
                                  }`}
                                >
                                  {renderValue(val)}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. Matrix U */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="text-xs font-semibold text-sky-400 font-mono flex items-center justify-between">
                    <span>Matriz [U] (Diagonal Unitaria)</span>
                    <span className="text-[10px] text-slate-500">u_ii = 1</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-center font-mono text-xs">
                      <tbody>
                        {currentStep.matrixUState.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((val, cIdx) => {
                              const isCurrentCell =
                                currentStep.phase === 'LU_DECOMPOSITION' &&
                                currentStep.row === rIdx &&
                                currentStep.col === cIdx;
                              const isDiagonal = rIdx === cIdx;
                              const isLowerZero = rIdx > cIdx;

                              return (
                                <td
                                  key={cIdx}
                                  className={`p-2 rounded border transition-all ${
                                    isCurrentCell
                                      ? 'bg-sky-600/50 border-sky-400 text-white font-bold ring-2 ring-sky-500'
                                      : isDiagonal
                                      ? 'border-sky-900/60 bg-sky-950/40 text-sky-200 font-bold'
                                      : isLowerZero
                                      ? 'border-slate-900 text-slate-700 bg-slate-950'
                                      : val !== 0
                                      ? 'border-sky-950 bg-sky-950/20 text-sky-300'
                                      : 'border-slate-800/60 text-slate-500'
                                  }`}
                                >
                                  {renderValue(val)}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full List View Mode */}
      {viewMode === 'fullList' && (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Lista Completa de Pasos Matemáticos ({steps.length} operaciones)
          </div>

          <div className="space-y-3">
            {steps.map((st, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 text-xs font-mono font-bold flex items-center justify-center">
                      {st.stepNumber}
                    </span>
                    <span className="text-xs font-bold text-white">{st.title}</span>
                    <span className="text-[11px] font-mono text-blue-400">({st.variable})</span>
                  </div>
                  <div className="text-xs font-mono text-slate-400 pl-8">
                    Fórmula: <span className="text-slate-300">{st.formulaStr}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pl-8 md:pl-0">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300">
                    {st.calcStr}
                  </div>
                  <button
                    onClick={() => {
                      setCurrentStepIdx(idx);
                      setViewMode('stepper');
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 whitespace-nowrap cursor-pointer underline"
                  >
                    Examinar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <button
          onClick={onGoToCalculator}
          className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          &larr; Volver a la Calculadora
        </button>

        {onGoToEngineering && (
          <button
            onClick={onGoToEngineering}
            className="px-4 py-2 text-xs font-medium text-blue-300 hover:text-white bg-blue-950/60 hover:bg-blue-900/60 border border-blue-900/80 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Ver cómo se aplica esto en Ingeniería Civil &rarr;</span>
          </button>
        )}
      </div>
    </div>
  );
};
