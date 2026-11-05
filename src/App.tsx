import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { HomeHero } from './components/HomeHero';
import { TheoryModule } from './components/TheoryModule';
import { Calculator } from './components/Calculator';
import { StepByStepVisualizer } from './components/StepByStepVisualizer';
import { ResultsView } from './components/ResultsView';
import { PracticeModule } from './components/PracticeModule';
import { CivilEngineeringModule } from './components/CivilEngineeringModule';
import { HistoryModule } from './components/HistoryModule';
import { CroutResult, HistoryItem, PracticeExercise, Matrix, Vector } from './types/crout';
import { solveCrout } from './utils/croutSolver';
import { PRESET_EXERCISES } from './data/exercises';

const STORAGE_KEY = 'croutsolve_calculations_history';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('inicio');
  const [currentResult, setCurrentResult] = useState<CroutResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage errors
    }

    // Solve mandatory test case on startup so all tabs have real mathematical results immediately
    const mandatory = PRESET_EXERCISES[0];
    const initialRes = solveCrout(mandatory.matrixA, mandatory.vectorB);
    setCurrentResult(initialRes);
  }, []);

  // Save history to localStorage
  const saveHistoryToStorage = (updated: HistoryItem[]) => {
    setHistory(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }
  };

  const handleCalculationSuccess = (result: CroutResult) => {
    setCurrentResult(result);

    if (result.success) {
      // Auto-append to history if not duplicate of very recent entry
      const newItem: HistoryItem = {
        id: `crout-${Date.now()}`,
        title: `Sistema de ${result.dimension}×${result.dimension}`,
        timestamp: Date.now(),
        dimension: result.dimension,
        matrixA: result.matrixA,
        vectorB: result.vectorB,
        vectorX: result.vectorX,
        maxResidue: result.maxResidue,
      };

      const updated = [newItem, ...history.filter((h) => h.id !== newItem.id)].slice(0, 30);
      saveHistoryToStorage(updated);
    }
  };

  const handleManualSaveToHistory = (result: CroutResult) => {
    const newItem: HistoryItem = {
      id: `crout-${Date.now()}`,
      title: `Sistema Guardado de ${result.dimension}×${result.dimension}`,
      timestamp: Date.now(),
      dimension: result.dimension,
      matrixA: result.matrixA,
      vectorB: result.vectorB,
      vectorX: result.vectorX,
      maxResidue: result.maxResidue,
    };
    const updated = [newItem, ...history].slice(0, 30);
    saveHistoryToStorage(updated);
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    saveHistoryToStorage(updated);
  };

  const handleClearAllHistory = () => {
    saveHistoryToStorage([]);
  };

  // Load preset from Home or Practice
  const handleLoadPreset = (presetId: string) => {
    const ex = PRESET_EXERCISES.find((e) => e.id === presetId);
    if (!ex) return;
    const res = solveCrout(ex.matrixA, ex.vectorB);
    setCurrentResult(res);
    setActiveTab('calculadora');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadExercise = (exercise: PracticeExercise) => {
    const res = solveCrout(exercise.matrixA, exercise.vectorB);
    setCurrentResult(res);
    setActiveTab('calculadora');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadSystem = (matrixA: Matrix, vectorB: Vector) => {
    const res = solveCrout(matrixA, vectorB);
    setCurrentResult(res);
    setActiveTab('calculadora');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadFromHistory = (item: HistoryItem) => {
    const res = solveCrout(item.matrixA, item.vectorB);
    setCurrentResult(res);
    setActiveTab('calculadora');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Bar Contract Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasCalculated={!!currentResult?.success}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {activeTab === 'inicio' && (
          <HomeHero
            setActiveTab={setActiveTab}
            onLoadPreset={handleLoadPreset}
          />
        )}

        {activeTab === 'teoria' && (
          <TheoryModule
            onGoToCalculator={() => {
              setActiveTab('calculadora');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'calculadora' && (
          <div className="space-y-8">
            <Calculator
              onCalculationSuccess={handleCalculationSuccess}
              onGoToStepByStep={() => {
                setActiveTab('paso-a-paso');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              result={currentResult}
            />

            {/* Results Section directly embedded below calculator for seamless review */}
            {currentResult && currentResult.success && (
              <div className="pt-8 border-t border-slate-800">
                <ResultsView
                  result={currentResult}
                  onGoToStepByStep={() => {
                    setActiveTab('paso-a-paso');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onSaveToHistory={handleManualSaveToHistory}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'paso-a-paso' && currentResult && (
          <StepByStepVisualizer
            result={currentResult}
            onGoToCalculator={() => {
              setActiveTab('calculadora');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoToEngineering={() => {
              setActiveTab('ingenieria');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'practica' && (
          <PracticeModule onLoadIntoCalculator={handleLoadExercise} />
        )}

        {activeTab === 'ingenieria' && (
          <CivilEngineeringModule
            onLoadSystemIntoCalculator={(mA, vB) => handleLoadSystem(mA, vB)}
          />
        )}

        {activeTab === 'historial' && (
          <HistoryModule
            history={history}
            onLoadFromHistory={handleLoadFromHistory}
            onDeleteItem={handleDeleteHistoryItem}
            onClearAll={handleClearAllHistory}
            onGoToCalculator={() => {
              setActiveTab('calculadora');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Clean, Non-ornamental Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-10 mt-auto text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-xs">
              [A]
            </span>
            <div>
              <span className="text-white font-bold font-display text-sm tracking-tight">
                Crout<span className="text-blue-400">Solve</span>
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Plataforma interactiva para el aprendizaje y resolución del Método de Crout.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
            <button
              onClick={() => {
                setActiveTab('inicio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Inicio
            </button>
            <button
              onClick={() => {
                setActiveTab('teoria');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Teoría LU
            </button>
            <button
              onClick={() => {
                setActiveTab('calculadora');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Calculadora
            </button>
            <button
              onClick={() => {
                setActiveTab('practica');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Ejercicios
            </button>
            <button
              onClick={() => {
                setActiveTab('ingenieria');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Ingeniería Civil
            </button>
            <button
              onClick={() => {
                setActiveTab('historial');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Historial
            </button>
          </div>

          <div className="text-center md:text-right text-[11px] text-slate-500">
            Orientado a estudiantes de Métodos Numéricos & Ingeniería Civil
          </div>
        </div>
      </footer>
    </div>
  );
}
