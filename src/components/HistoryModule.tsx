import React from 'react';
import {
  History,
  Trash2,
  Download,
  Calculator,
  Calendar,
  Layers,
  ArrowRight,
  FileJson,
} from 'lucide-react';
import { HistoryItem, CroutResult } from '../types/crout';
import { formatNum, solveCrout } from '../utils/croutSolver';
import { exportResultToPDF } from '../utils/pdfExport';

interface HistoryModuleProps {
  history: HistoryItem[];
  onLoadFromHistory: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
  onGoToCalculator: () => void;
}

export const HistoryModule: React.FC<HistoryModuleProps> = ({
  history,
  onLoadFromHistory,
  onDeleteItem,
  onClearAll,
  onGoToCalculator,
}) => {
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `CroutSolve_Historial_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportItemToPDF = (item: HistoryItem) => {
    // Solve on the fly to get full steps and generate complete PDF
    const result = solveCrout(item.matrixA, item.vectorB);
    exportResultToPDF(result, item.title);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-semibold uppercase tracking-wider">
            <History className="w-4 h-4" />
            <span>Almacenamiento Local Persistente</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-0.5">
            Historial de Cálculos Realizados
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Consulta los sistemas de ecuaciones lineales resueltos anteriormente en tu navegador, recupéralos o expórtalos a PDF.
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
              title="Descargar copia de seguridad en JSON"
            >
              <FileJson className="w-3.5 h-3.5 text-blue-400" />
              <span>Exportar JSON</span>
            </button>

            <button
              onClick={onClearAll}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-900/60 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar Historial</span>
            </button>
          </div>
        )}
      </div>

      {/* History Items List or Empty State */}
      {history.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
            <History className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">No hay cálculos guardados todavía</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Cada vez que resuelvas un sistema en la calculadora o hagas clic en "Guardar", tus resultados se registrarán automáticamente aquí.
            </p>
          </div>
          <button
            onClick={onGoToCalculator}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            <span>Ir a la Calculadora</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-blue-950/60 text-blue-400 border border-blue-900/60 font-bold">
                    {item.dimension}×{item.dimension}
                  </span>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1 font-sans">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {new Date(item.timestamp).toLocaleString('es-ES', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                  <span>·</span>
                  <span>
                    Solución: [ {item.vectorX.map((v, i) => `x_${i + 1}=${formatNum(v, 2)}`).join(', ')} ]
                  </span>
                  <span>·</span>
                  <span className="text-emerald-400 font-sans">
                    Residuo: {item.maxResidue.toExponential(2)}
                  </span>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2 self-start md:self-auto">
                <button
                  onClick={() => onLoadFromHistory(item)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Cargar este sistema en la calculadora"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Cargar</span>
                </button>

                <button
                  onClick={() => handleExportItemToPDF(item)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Descargar reporte PDF oficial"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">PDF</span>
                </button>

                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                  title="Eliminar este registro"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
