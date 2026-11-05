import React, { useState } from 'react';
import {
  GraduationCap,
  Play,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calculator,
  ChevronDown,
  ChevronUp,
  Lightbulb,
} from 'lucide-react';
import { PracticeExercise } from '../types/crout';
import { PRESET_EXERCISES } from '../data/exercises';
import { formatNum } from '../utils/croutSolver';

interface PracticeModuleProps {
  onLoadIntoCalculator: (exercise: PracticeExercise) => void;
}

export const PracticeModule: React.FC<PracticeModuleProps> = ({ onLoadIntoCalculator }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(PRESET_EXERCISES[0].id);
  const [studentInputs, setStudentInputs] = useState<Record<string, string[]>>({});
  const [feedback, setFeedback] = useState<Record<string, { isCorrect: boolean; message: string; diffs: number[] }>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  const categories = ['Todos', 'Principiante', 'Intermedio', 'Avanzado', 'Ingeniería Civil'];

  const filteredExercises =
    selectedCategory === 'Todos'
      ? PRESET_EXERCISES
      : PRESET_EXERCISES.filter((e) => e.level === selectedCategory);

  const activeExercise =
    PRESET_EXERCISES.find((e) => e.id === selectedExerciseId) || PRESET_EXERCISES[0];

  const currentInputs =
    studentInputs[activeExercise.id] || Array(activeExercise.dimension).fill('');

  const handleInputChange = (idx: number, val: string) => {
    const updated = [...currentInputs];
    updated[idx] = val;
    setStudentInputs({
      ...studentInputs,
      [activeExercise.id]: updated,
    });
  };

  const handleVerifyStudentAnswer = () => {
    const expected = activeExercise.expectedX;
    const diffs: number[] = [];
    let allValid = true;

    for (let i = 0; i < expected.length; i++) {
      const raw = currentInputs[i]?.trim() || '';
      const num = parseFloat(raw);
      if (isNaN(num)) {
        allValid = false;
        diffs.push(999);
      } else {
        const diff = Math.abs(num - expected[i]);
        diffs.push(diff);
      }
    }

    const isCorrect = allValid && diffs.every((d) => d < 0.05);

    setFeedback({
      ...feedback,
      [activeExercise.id]: {
        isCorrect,
        message: isCorrect
          ? '¡Excelente trabajo! Has calculado correctamente el vector solución x mediante el Método de Crout.'
          : 'Alguna(s) incógnita(s) difieren de la solución matemática esperada. Revisa la sustitución hacia atrás o prueba cargar el ejercicio en la calculadora paso a paso.',
        diffs,
      },
    });
  };

  const toggleRevealSolution = (id: string) => {
    setRevealedSolutions({
      ...revealedSolutions,
      [id]: !revealedSolutions[id],
    });
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 font-mono uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" />
          <span>Módulo de Práctica y Autoevaluación</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
          Ejercicios Prácticos del Método de Crout
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          Pon a prueba tus habilidades de cálculo manual. Resuelve problemas reales extraídos de la ingeniería estructural y los métodos numéricos, valida tus respuestas con el motor matemático y analiza las soluciones detalladas.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Exercise Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map((ex) => {
          const isSelected = activeExercise.id === ex.id;
          return (
            <div
              key={ex.id}
              onClick={() => setSelectedExerciseId(ex.id)}
              className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                isSelected
                  ? 'bg-blue-950/30 border-blue-500 shadow-md ring-1 ring-blue-500'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-blue-300 border border-slate-800 font-semibold">
                    {ex.dimension}×{ex.dimension}
                  </span>
                  <span className="text-xs text-slate-400">{ex.level}</span>
                </div>
                <h3 className="text-base font-bold text-white font-display">{ex.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {ex.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  {isSelected ? 'Ejercicio Activo' : 'Seleccionar'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLoadIntoCalculator(ex);
                  }}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium transition-colors"
                  title="Cargar este ejercicio directamente en la calculadora"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Cargar en Calculadora</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Exercise Interactive Workspace */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
              <span>{activeExercise.level}</span>
              <span aria-hidden="true">·</span>
              <span>Orden {activeExercise.dimension}×{activeExercise.dimension}</span>
            </div>
            <h2 className="text-2xl font-bold text-white font-display mt-0.5">
              {activeExercise.title}
            </h2>
          </div>

          <button
            onClick={() => onLoadIntoCalculator(activeExercise)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Calculator className="w-4 h-4" />
            <span>Cargar en Calculadora</span>
          </button>
        </div>

        {/* Physical Context Description */}
        {activeExercise.physicalContext && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
            <span className="font-semibold text-blue-300 flex items-center gap-1.5 font-sans">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Contexto en Ingeniería:
            </span>
            <p className="leading-relaxed text-slate-400 pl-5">
              {activeExercise.physicalContext}
            </p>
          </div>
        )}

        {/* Matrix System Display */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Sistema a Resolver (A x = b):
          </span>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto text-xs font-mono">
            <div className="flex items-center gap-4">
              {/* Matrix A */}
              <div>
                <div className="text-[10px] font-sans text-slate-400 mb-1">Matriz [A]</div>
                <div className="p-2 border border-slate-800 rounded bg-slate-900/80 space-y-1 text-blue-200">
                  {activeExercise.matrixA.map((row, rIdx) => (
                    <div key={rIdx} className="flex gap-4">
                      {row.map((val, cIdx) => (
                        <span key={cIdx} className="w-10 text-right">
                          {formatNum(val, 2)}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <span className="text-slate-500 text-base">·</span>

              {/* Incognitas x */}
              <div>
                <div className="text-[10px] font-sans text-slate-400 mb-1">Vector &#123;x&#125;</div>
                <div className="p-2 border border-slate-800 rounded bg-slate-900/80 space-y-1 text-slate-300">
                  {Array.from({ length: activeExercise.dimension }).map((_, i) => (
                    <div key={i} className="text-center font-bold">
                      x_{i + 1}
                    </div>
                  ))}
                </div>
              </div>

              <span className="text-slate-500 text-base">=</span>

              {/* Vector b */}
              <div>
                <div className="text-[10px] font-sans text-slate-400 mb-1">Vector &#123;b&#125;</div>
                <div className="p-2 border border-sky-900/40 rounded bg-slate-900/80 space-y-1 text-sky-300">
                  {activeExercise.vectorB.map((val, i) => (
                    <div key={i} className="w-12 text-right">
                      {formatNum(val, 2)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hints */}
        {activeExercise.hints && activeExercise.hints.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300 font-mono">Pistas Matemáticas:</span>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 pl-2">
              {activeExercise.hints.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Student Solution Inputs Area */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Tu Solución para el Vector de Incógnitas &#123;x&#125;:
            </span>
            <span className="text-[11px] text-slate-400">
              Calcula a mano o con borrador y valida tu resultado
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {Array.from({ length: activeExercise.dimension }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-300 font-semibold">x_{idx + 1} =</span>
                <input
                  type="number"
                  step="any"
                  value={currentInputs[idx] || ''}
                  onChange={(e) => handleInputChange(idx, e.target.value)}
                  placeholder="ej. 2"
                  className="w-24 py-2 px-3 rounded-lg text-center font-mono text-xs font-semibold bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            ))}

            <button
              onClick={handleVerifyStudentAnswer}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              Verificar mi respuesta
            </button>
          </div>

          {/* Feedback message */}
          {feedback[activeExercise.id] && (
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 animate-fadeIn ${
                feedback[activeExercise.id].isCorrect
                  ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
                  : 'bg-amber-950/40 border-amber-800/80 text-amber-200'
              }`}
            >
              {feedback[activeExercise.id].isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-semibold text-white">
                  {feedback[activeExercise.id].isCorrect ? '¡Respuesta Correcta!' : 'Revisión Necesaria'}
                </div>
                <p>{feedback[activeExercise.id].message}</p>
              </div>
            </div>
          )}
        </div>

        {/* Toggle Solution Guide */}
        <div className="pt-2">
          <button
            onClick={() => toggleRevealSolution(activeExercise.id)}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {revealedSolutions[activeExercise.id] ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>Ocultar solución oficial completa</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>Ver solución oficial completa y matrices L y U</span>
              </>
            )}
          </button>

          {revealedSolutions[activeExercise.id] && (
            <div className="mt-4 p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 animate-fadeIn">
              <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Solución Analítica por Crout:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                {/* L Matrix */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-emerald-400 font-sans font-semibold text-[11px]">Matriz L:</div>
                  {activeExercise.expectedL.map((r, i) => (
                    <div key={i} className="flex gap-4 text-emerald-300">
                      {r.map((v, j) => (
                        <span key={j} className="w-12 text-right">
                          {formatNum(v, 2)}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>

                {/* U Matrix */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-sky-400 font-sans font-semibold text-[11px]">Matriz U (Unit):</div>
                  {activeExercise.expectedU.map((r, i) => (
                    <div key={i} className="flex gap-4 text-sky-300">
                      {r.map((v, j) => (
                        <span key={j} className="w-12 text-right">
                          {formatNum(v, 2)}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Vectors */}
              <div className="flex flex-wrap gap-4 text-xs font-mono pt-2 border-t border-slate-800">
                <div>
                  <span className="text-slate-400 font-sans">Vector intermedio y: </span>
                  <span className="text-emerald-300">
                    [ {activeExercise.expectedY.map((v) => formatNum(v, 2)).join(', ')} ]
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">Vector solución x: </span>
                  <span className="text-white font-bold">
                    [ {activeExercise.expectedX.map((v) => formatNum(v, 2)).join(', ')} ]
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
