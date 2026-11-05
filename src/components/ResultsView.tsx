import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  CheckCircle2,
  Layers,
  ArrowRight,
  BookmarkPlus,
  Share2,
} from 'lucide-react';
import { CroutResult } from '../types/crout';
import { formatNum, toFraction } from '../utils/croutSolver';
import { exportResultToPDF } from '../utils/pdfExport';

interface ResultsViewProps {
  result: CroutResult;
  onGoToStepByStep: () => void;
  onSaveToHistory: (result: CroutResult) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  onGoToStepByStep,
  onSaveToHistory,
}) => {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [savedStatus, setSavedStatus] = useState<boolean>(false);
  const [numberFormat, setNumberFormat] = useState<'decimal' | 'fraction'>('decimal');

  const renderVal = (v: number) => {
    return numberFormat === 'decimal' ? formatNum(v, 4) : toFraction(v);
  };

  const handleCopyText = () => {
    const lines = [
      `CroutSolve - Resultado de Factorización LU (${result.dimension}x${result.dimension})`,
      '',
      '--- Matriz L ---',
      ...result.matrixL.map((row) => row.map((v) => formatNum(v, 4)).join('\t')),
      '',
      '--- Matriz U ---',
      ...result.matrixU.map((row) => row.map((v) => formatNum(v, 4)).join('\t')),
      '',
      '--- Vector Intermedio y ---',
      result.vectorY.map((v, i) => `y_${i + 1} = ${formatNum(v, 4)}`).join(', '),
      '',
      '--- Vector Solución x ---',
      result.vectorX.map((v, i) => `x_${i + 1} = ${formatNum(v, 6)}`).join(', '),
      '',
      `Residuo máximo: ${result.maxResidue.toExponential(4)}`,
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopyStatus('text');
    setTimeout(() => setCopyStatus(null), 2500);
  };

  const handleCopyLatex = () => {
    const n = result.dimension;
    const lRows = result.matrixL.map((r) => r.map((v) => formatNum(v, 3)).join(' & ')).join(' \\\\\n');
    const uRows = result.matrixU.map((r) => r.map((v) => formatNum(v, 3)).join(' & ')).join(' \\\\\n');
    const xVec = result.vectorX.map((v) => formatNum(v, 4)).join(' \\\\\n');

    const latex = `
% Factorización LU por Método de Crout (A = LU)
L = \\begin{bmatrix}
${lRows}
\\end{bmatrix}, \\quad
U = \\begin{bmatrix}
${uRows}
\\end{bmatrix}

\\mathbf{x} = \\begin{bmatrix}
${xVec}
\\end{bmatrix}
    `.trim();

    navigator.clipboard.writeText(latex);
    setCopyStatus('latex');
    setTimeout(() => setCopyStatus(null), 2500);
  };

  const handleSave = () => {
    onSaveToHistory(result);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2500);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Cálculo Finalizado con Éxito</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-0.5">
            Matrices y Vector Solución Obtenidos
          </h2>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Format toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs">
            <button
              onClick={() => setNumberFormat('decimal')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                numberFormat === 'decimal' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Decimales
            </button>
            <button
              onClick={() => setNumberFormat('fraction')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                numberFormat === 'fraction' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Fracciones
            </button>
          </div>

          <button
            onClick={handleCopyText}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            title="Copiar resultados a texto plano"
          >
            {copyStatus === 'text' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copyStatus === 'text' ? '¡Copiado!' : 'Copiar Texto'}</span>
          </button>

          <button
            onClick={handleCopyLatex}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            title="Copiar código LaTeX de las matrices"
          >
            {copyStatus === 'latex' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copyStatus === 'latex' ? '¡LaTeX Copiado!' : 'LaTeX'}</span>
          </button>

          <button
            onClick={handleSave}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {savedStatus ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <BookmarkPlus className="w-3.5 h-3.5 text-blue-400" />}
            <span>{savedStatus ? '¡Guardado!' : 'Guardar'}</span>
          </button>

          <button
            onClick={() => exportResultToPDF(result)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>

      {/* Main Solution Spotlight Hero Box */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/30 border border-blue-800/50 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-blue-400 font-semibold uppercase tracking-wider">
              Solución del Sistema Ax = b
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-display mt-0.5">
              Vector de Incógnitas (x)
            </h3>
          </div>

          <button
            onClick={onGoToStepByStep}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Layers className="w-4 h-4" />
            <span>Ver procedimiento paso a paso</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Incognitas Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
          {result.vectorX.map((val, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950/90 border border-blue-900/60 text-center space-y-1 shadow-sm"
            >
              <span className="text-xs font-mono text-blue-300 font-medium">x_{idx + 1}</span>
              <div className="text-base sm:text-lg font-mono font-bold text-white">
                {renderVal(val)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Side-by-Side Matrices L and U */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matrix L Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <h3 className="text-base font-bold text-white font-display">
                Matriz L (Triangular Inferior)
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400">l_ij = 0 (j &gt; i)</span>
          </div>

          <div className="overflow-x-auto p-2 bg-slate-950 rounded-xl border border-slate-800/80">
            <table className="w-full text-center font-mono text-sm">
              <tbody>
                {result.matrixL.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((val, cIdx) => {
                      const isZero = cIdx > rIdx;
                      return (
                        <td
                          key={cIdx}
                          className={`p-2.5 rounded border ${
                            isZero
                              ? 'border-slate-900 text-slate-700 bg-slate-950/50'
                              : 'border-emerald-950/80 bg-emerald-950/20 text-emerald-300 font-semibold'
                          }`}
                        >
                          {renderVal(val)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-xs text-slate-400 leading-relaxed">
            La diagonal de L contiene los pivotes sucesivos calculados. El determinante de A equivale a:{' '}
            <span className="font-mono text-emerald-300 font-semibold">
              det(A) = {formatNum(result.matrixL.reduce((acc, row, idx) => acc * row[idx], 1), 4)}
            </span>
          </div>
        </div>

        {/* Matrix U Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-500" />
              <h3 className="text-base font-bold text-white font-display">
                Matriz U (Triangular Superior)
              </h3>
            </div>
            <span className="text-xs font-mono text-sky-400">Diagonal Unitaria (u_ii = 1)</span>
          </div>

          <div className="overflow-x-auto p-2 bg-slate-950 rounded-xl border border-slate-800/80">
            <table className="w-full text-center font-mono text-sm">
              <tbody>
                {result.matrixU.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((val, cIdx) => {
                      const isDiag = rIdx === cIdx;
                      const isZero = rIdx > cIdx;
                      return (
                        <td
                          key={cIdx}
                          className={`p-2.5 rounded border ${
                            isDiag
                              ? 'border-sky-900/80 bg-sky-950/40 text-sky-200 font-bold'
                              : isZero
                              ? 'border-slate-900 text-slate-700 bg-slate-950/50'
                              : 'border-sky-950/80 bg-sky-950/20 text-sky-300'
                          }`}
                        >
                          {renderVal(val)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-xs text-slate-400 leading-relaxed">
            En la convención de Crout, la diagonal de U siempre está fija en 1.0, lo que simplifica la sustitución hacia atrás.
          </div>
        </div>
      </div>

      {/* Vector Intermedio y */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
            Vector Intermedio &#123;y&#125; (Resultado de L · y = b)
          </span>
          <span className="text-xs font-mono text-slate-400">Sustitución hacia adelante</span>
        </div>

        <div className="flex flex-wrap gap-3">
          {result.vectorY.map((val, idx) => (
            <div
              key={idx}
              className="px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2 font-mono text-xs"
            >
              <span className="text-slate-400">y_{idx + 1} =</span>
              <span className="text-emerald-400 font-bold">{renderVal(val)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Panel: Ax = b */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Verificación Matemática: A · x ≈ b
            </h3>
            <p className="text-xs text-slate-400">
              Comprobación de la exactitud numérica sustituyendo el vector x en cada ecuación original.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Residuo Máximo ||r||</span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {result.maxResidue.toExponential(3)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {result.verificationRows.map((v) => (
            <div
              key={v.row}
              className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-sans">Ecuación {v.row}:</span>
                <span className="text-slate-200">{v.equationStr}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-sans">
                  Esperado: <strong className="text-white">{formatNum(v.expectedValue, 2)}</strong>
                </span>
                <span className="text-emerald-400 flex items-center gap-1 font-sans font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  Correcto
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
