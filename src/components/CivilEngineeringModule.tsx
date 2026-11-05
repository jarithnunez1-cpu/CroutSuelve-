import React, { useState } from 'react';
import {
  Building2,
  Cpu,
  Layers,
  ArrowRight,
  ShieldAlert,
  Calculator,
  Sliders,
  CheckCircle2,
  Maximize2,
} from 'lucide-react';
import { solveCrout, formatNum } from '../utils/croutSolver';
import { Matrix, Vector } from '../types/crout';

interface CivilEngineeringModuleProps {
  onLoadSystemIntoCalculator: (matrixA: Matrix, vectorB: Vector, title: string) => void;
}

export const CivilEngineeringModule: React.FC<CivilEngineeringModuleProps> = ({
  onLoadSystemIntoCalculator,
}) => {
  // Interactive Simulation State: 3-Story Shear Frame with Stiffness Matrix [K]
  // [K]{u} = {F}
  // K = [ [600, -300, 0], [-300, 500, -200], [0, -200, 200] ] kN/m
  const baseK: Matrix = [
    [600, -300, 0],
    [-300, 500, -200],
    [0, -200, 200],
  ];

  // User adjustable loads at each floor (kN)
  const [loadF1, setLoadF1] = useState<number>(30); // Floor 1
  const [loadF2, setLoadF2] = useState<number>(60); // Floor 2
  const [loadF3, setLoadF3] = useState<number>(90); // Floor 3 (Roof wind/seismic load)

  // Precomputed or live Crout solve
  const currentForces: Vector = [loadF1, loadF2, loadF3];
  const simResult = solveCrout(baseK, currentForces);

  const [activeTab, setActiveTab] = useState<'stiffness' | 'truss' | 'beams' | 'fem' | 'hydraulics'>('stiffness');

  return (
    <div className="space-y-10 py-4">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 font-mono uppercase tracking-wider">
          <Building2 className="w-4 h-4" />
          <span>Ingeniería Estructural & Métodos Numéricos</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
          El Método de Crout en la Ingeniería Civil
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          En la práctica profesional de la ingeniería estructural, geotécnica e hidráulica, las leyes de la física se formulan mediante ecuaciones diferenciales que, al discretizarse, se transforman en sistemas de ecuaciones lineales gigantescos. Conoce por qué la factorización de Crout es el corazón de los motores de cálculo.
        </p>
      </div>

      {/* Engineering Safety Disclaimer Banner (Mandatory Prompt Requirement) */}
      <div className="p-5 rounded-xl bg-amber-950/30 border border-amber-800/60 text-amber-200 text-xs sm:text-sm flex items-start gap-3 leading-relaxed">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-amber-300 font-semibold block">
            Aviso de Responsabilidad y Criterio Estructural:
          </strong>
          <p>
            El Método de Crout es una <strong className="text-white">herramienta matemática de resolución numérica</strong> para sistemas lineales. No garantiza por sí solo la seguridad estructural ni la estabilidad de una obra civil. La seguridad de puentes, edificios y presas depende de la correcta formulación del modelo físico-matemático, la caracterización de los materiales (resistencia del hormigón, módulo de elasticidad del acero, capacidad portante del suelo), el cumplimiento de las normas de diseño sismorresistente vigentes y la aplicación de los factores de seguridad reglamentarios.
          </p>
        </div>
      </div>

      {/* Interactive Structural Simulation Deck: 3-Story Frame Stiffness */}
      <section className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-semibold uppercase tracking-wider">
              <Sliders className="w-4 h-4" />
              <span>Simulación Interactiva en Tiempo Real</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display mt-0.5">
              Pórtico Estructural de 3 Pisos: Desplazamientos [K]&#123;u&#125; = &#123;F&#125;
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Modifica las fuerzas horizontales de sismo/viento aplicadas en cada entrepiso. Observa cómo los desplazamientos se resuelven instantáneamente reutilizando la factorización de Crout de la matriz de rigidez global [K].
            </p>
          </div>

          <button
            onClick={() =>
              onLoadSystemIntoCalculator(
                baseK,
                currentForces,
                'Pórtico Estructural de 3 Pisos [K]{u} = {F}'
              )
            }
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            <span>Cargar en Calculadora</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls: Sliders for Lateral Loads */}
          <div className="lg:col-span-5 space-y-5 bg-slate-950 p-5 rounded-xl border border-slate-800">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono block border-b border-slate-800 pb-2">
              Fuerzas Horizontales Externas &#123;F&#125; (kN)
            </span>

            <div className="space-y-4 text-xs font-mono">
              {/* Floor 3 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Piso 3 (Cubierta) - F₃:</span>
                  <span className="text-sky-400 font-bold">{loadF3} kN</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="5"
                  value={loadF3}
                  onChange={(e) => setLoadF3(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              {/* Floor 2 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Piso 2 (Intermedio) - F₂:</span>
                  <span className="text-sky-400 font-bold">{loadF2} kN</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="5"
                  value={loadF2}
                  onChange={(e) => setLoadF2(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              {/* Floor 1 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Piso 1 (Inferior) - F₁:</span>
                  <span className="text-sky-400 font-bold">{loadF1} kN</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="5"
                  value={loadF1}
                  onChange={(e) => setLoadF1(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-lg text-[11px] text-slate-400 space-y-1">
              <span className="text-blue-300 font-semibold block">La gran ventaja de Crout:</span>
              <p>
                La matriz [K] de 3×3 solo se descompuso en [L] y [U] una vez. Al deslizar las barras, no se vuelve a factorizar la estructura; solo se evalúan sustituciones directas en microsegundos.
              </p>
            </div>
          </div>

          {/* Visual Model: Displaced Building Frame */}
          <div className="lg:col-span-7 bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold">
                Perfil de Deformada y Desplazamientos Laterales &#123;u&#125;
              </span>
              <span className="text-emerald-400">Escala magnificada</span>
            </div>

            {/* Schematic SVG Building Frame */}
            <div className="h-64 w-full flex items-center justify-center p-2 bg-slate-900/60 rounded-lg border border-slate-800/80">
              <svg viewBox="0 0 400 240" className="w-full h-full max-w-md">
                {/* Ground foundation */}
                <line x1="80" y1="220" x2="320" y2="220" stroke="#475569" strokeWidth="4" />
                {Array.from({ length: 8 }).map((_, i) => (
                  <line
                    key={i}
                    x1={95 + i * 26}
                    y1="220"
                    x2={80 + i * 26}
                    y2="235"
                    stroke="#334155"
                    strokeWidth="2"
                  />
                ))}

                {/* Calculate displacement scale */}
                {(() => {
                  const u1 = simResult.vectorX[0] || 0;
                  const u2 = simResult.vectorX[1] || 0;
                  const u3 = simResult.vectorX[2] || 0;
                  const maxU = Math.max(u3, 0.001);
                  const scale = 50 / maxU;

                  const dx1 = Math.min(u1 * scale, 60);
                  const dx2 = Math.min(u2 * scale, 85);
                  const dx3 = Math.min(u3 * scale, 110);

                  return (
                    <g>
                      {/* Undisplaced reference dashed wireframe */}
                      <g stroke="#334155" strokeWidth="1" strokeDasharray="3 3">
                        {/* Columns */}
                        <line x1="140" y1="220" x2="140" y2="30" />
                        <line x1="260" y1="220" x2="260" y2="30" />
                        {/* Beams */}
                        <line x1="140" y1="160" x2="260" y2="160" />
                        <line x1="140" y1="95" x2="260" y2="95" />
                        <line x1="140" y1="30" x2="260" y2="30" />
                      </g>

                      {/* Deformed Real Structural Frame */}
                      {/* Left Column Segments */}
                      <line x1="140" y1="220" x2={140 + dx1} y2="160" stroke="#3b82f6" strokeWidth="3" />
                      <line x1={140 + dx1} y1="160" x2={140 + dx2} y2="95" stroke="#3b82f6" strokeWidth="3" />
                      <line x1={140 + dx2} y1="95" x2={140 + dx3} y2="30" stroke="#3b82f6" strokeWidth="3" />

                      {/* Right Column Segments */}
                      <line x1="260" y1="220" x2={260 + dx1} y2="160" stroke="#3b82f6" strokeWidth="3" />
                      <line x1={260 + dx1} y1="160" x2={260 + dx2} y2="95" stroke="#3b82f6" strokeWidth="3" />
                      <line x1={260 + dx2} y1="95" x2={260 + dx3} y2="30" stroke="#3b82f6" strokeWidth="3" />

                      {/* Beams */}
                      <line x1={140 + dx1} y1="160" x2={260 + dx1} y2="160" stroke="#60a5fa" strokeWidth="3.5" />
                      <line x1={140 + dx2} y1="95" x2={260 + dx2} y2="95" stroke="#60a5fa" strokeWidth="3.5" />
                      <line x1={140 + dx3} y1="30" x2={260 + dx3} y2="30" stroke="#60a5fa" strokeWidth="3.5" />

                      {/* Force Arrows */}
                      <path d={`M ${90} 30 L ${130 + dx3} 30`} stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#arrow)" />
                      <polygon points={`${135 + dx3},30 ${125 + dx3},26 ${125 + dx3},34`} fill="#f59e0b" />
                      <text x="65" y="34" fill="#f59e0b" fontSize="10" fontFamily="sans-serif" fontWeight="bold">F₃={loadF3}k</text>

                      <polygon points={`${135 + dx2},95 ${125 + dx2},91 ${125 + dx2},99`} fill="#f59e0b" />
                      <text x="65" y="99" fill="#f59e0b" fontSize="10" fontFamily="sans-serif" fontWeight="bold">F₂={loadF2}k</text>

                      <polygon points={`${135 + dx1},160 ${125 + dx1},156 ${125 + dx1},164`} fill="#f59e0b" />
                      <text x="65" y="164" fill="#f59e0b" fontSize="10" fontFamily="sans-serif" fontWeight="bold">F₁={loadF1}k</text>

                      {/* Nodes */}
                      <circle cx={140 + dx3} cy="30" r="4" fill="#ffffff" />
                      <circle cx={260 + dx3} cy="30" r="4" fill="#ffffff" />
                      <circle cx={140 + dx2} cy="95" r="4" fill="#ffffff" />
                      <circle cx={260 + dx2} cy="95" r="4" fill="#ffffff" />
                      <circle cx={140 + dx1} cy="160" r="4" fill="#ffffff" />
                      <circle cx={260 + dx1} cy="160" r="4" fill="#ffffff" />
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* Calculated Values Summary */}
            <div className="grid grid-cols-3 gap-3 font-mono text-center text-xs">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Nivel 1 (u₁):</span>
                <span className="text-white font-bold text-sm">
                  {formatNum(simResult.vectorX[0] || 0, 4)} m
                </span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Nivel 2 (u₂):</span>
                <span className="text-white font-bold text-sm">
                  {formatNum(simResult.vectorX[1] || 0, 4)} m
                </span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Nivel 3 (u₃):</span>
                <span className="text-white font-bold text-sm">
                  {formatNum(simResult.vectorX[2] || 0, 4)} m
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Civil Engineering Domains Tabs */}
      <section className="space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-mono text-blue-400 uppercase tracking-wider font-semibold">
            Campos de Aplicación
          </span>
          <h2 className="text-2xl font-bold text-white font-display">
            Casos de Estudio Típicos en Ingeniería
          </h2>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('stiffness')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
              activeTab === 'stiffness'
                ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            1. Método de Rigidez Directa
          </button>
          <button
            onClick={() => setActiveTab('truss')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
              activeTab === 'truss'
                ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            2. Cerchas y Armaduras
          </button>
          <button
            onClick={() => setActiveTab('beams')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
              activeTab === 'beams'
                ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            3. Vigas Continuas (Clapeyron)
          </button>
          <button
            onClick={() => setActiveTab('fem')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
              activeTab === 'fem'
                ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            4. Elementos Finitos (FEM)
          </button>
          <button
            onClick={() => setActiveTab('hydraulics')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
              activeTab === 'hydraulics'
                ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            5. Redes Hidráulicas Malladas
          </button>
        </div>

        {/* Detailed Tab Content */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          {activeTab === 'stiffness' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white font-display">
                El Método de Rigidez Matricial: [K]&#123;u&#125; = &#123;F&#125;
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                El Método de los Desplazamientos o Rigidez Directa es la base matemática de todos los programas modernos de análisis estructural (como ETABS, SAP2000, Robot Structural Analysis y CYPECAD).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-400">
                  <span className="font-semibold text-white text-sm block">¿Por qué Crout y no la Inversa [K]⁻¹?</span>
                  <p className="leading-relaxed">
                    Invertir una matriz de rigidez de orden 10,000×10,000 requeriría gigabytes de memoria y provocaría inestabilidad numérica. Factorizar en [L][U] mediante Crout preserva la banda de ceros (dispersión) y es tres veces más rápido que calcular la inversa explícita.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-400">
                  <span className="font-semibold text-white text-sm block">Combinaciones de Carga Reglamentarias</span>
                  <p className="leading-relaxed">
                    Los códigos normativos (como ASCE 7, Eurocódigo o NSR-10) exigen verificar decenas de combinaciones: 1.2D + 1.6L, 1.2D + 1.0E + 1.0L, 0.9D + 1.0W, etc. La matriz [K] se factoriza solo una vez; cada combinación simplemente evalúa sustituciones con el nuevo vector de cargas &#123;F&#125;.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'truss' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white font-display">
                Equilibrio de Nudos en Cerchas y Estructuras Articuladas
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Para determinar las tensiones axiales en barras de techumbres y puentes de celosía (tipo Pratt, Howe o Warren), se plantean dos ecuaciones de equilibrio estático por nudo: <span className="font-mono text-blue-300">Σ Fx = 0</span> y <span className="font-mono text-blue-300">Σ Fy = 0</span>.
              </p>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
                <span className="font-semibold text-white text-sm block">Matriz de Conectividad Estática:</span>
                <p className="text-slate-400">
                  Los coeficientes de la matriz corresponden a los cosenos y senos directores de cada elemento concurrente. La resolución simultánea mediante Crout calcula qué barras trabajan a compresión (propensas al pandeo elástico de Euler) y cuáles a tracción (diseñadas por fluencia del acero).
                </p>
              </div>
            </div>
          )}

          {activeTab === 'beams' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white font-display">
                Vigas Continuas: Ecuación de los Tres Momentos de Clapeyron
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Las vigas hiperestáticas sobre apoyos múltiples generan un sistema de ecuaciones lineales con una característica especial: su matriz es <strong className="text-white">tridiagonal</strong>.
              </p>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-blue-300 overflow-x-auto text-center py-3">
                L_i · M_{'{i-1}'} + 2(L_i + L_{'{i+1}'}) · M_i + L_{'{i+1}'} · M_{'{i+1}'} = - 6 ( w_i L_i³ / 24 + ... )
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Al aplicar el método de Crout a matrices tridiagonales, el algoritmo se simplifica en el conocido <strong className="text-white">Algoritmo de Thomas (TDMA)</strong>, reduciendo el costo computacional de O(n³) a tan solo <strong className="text-emerald-400">O(n)</strong> operaciones.
              </p>
            </div>
          )}

          {activeTab === 'fem' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white font-display">
                El Método de los Elementos Finitos (MEF / FEM)
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                En geotecnia (taludes, túneles, cimentaciones profundas) y análisis de medios continuos (presas de hormigón, placas de puentes), el terreno o la estructura se discretiza en elementos triangulares o cuadriláteros.
              </p>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-400">
                <span className="font-semibold text-white text-sm block">Ensamblaje Global y Ancho de Banda:</span>
                <p className="leading-relaxed">
                  El ensamblaje de las matrices de rigidez locales de cada elemento produce una matriz global simétrica de banda. Al aplicar Crout, la numeración adecuada de los nudos (algoritmo de Cuthill-McKee) permite confinar los términos no nulos dentro de una franja estrecha, ahorrando hasta un 95% de memoria RAM.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'hydraulics' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white font-display">
                Redes Malladas de Distribución de Agua Potable
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                En el diseño de redes de abastecimiento urbano (redes malladas cerradas), el flujo debe satisfacer simultáneamente la ley de conservación de masa en cada nudo y la ley de conservación de energía (pérdidas de carga de Darcy-Weisbach o Hazen-Williams) en cada circuito cerrado.
              </p>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-400">
                <span className="font-semibold text-white text-sm block">Linealización por Newton-Raphson:</span>
                <p className="leading-relaxed">
                  Dado que las pérdidas de carga son no lineales (proporcionales a Q¹.⁸⁵² o Q²), el método del gradiente hidráulico linealiza el sistema en cada iteración: <span className="font-mono text-blue-300">[J] · &#123;ΔH&#125; = &#123;R&#125;</span>. En cada iteración, se resuelve este sistema mediante la factorización de Crout para actualizar las presiones en los nudos.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
