import React, { useState } from 'react';
import { BookOpen, Layers, CheckCircle2, AlertTriangle, ArrowRight, Table, Cpu, HelpCircle } from 'lucide-react';

export const TheoryModule: React.FC<{ onGoToCalculator: () => void }> = ({ onGoToCalculator }) => {
  const [activeConcept, setActiveConcept] = useState<'crout' | 'lu' | 'matL' | 'matU' | 'forward' | 'backward' | 'ventajas' | 'limitaciones' | 'civil'>('crout');

  const topics: { id: typeof activeConcept; title: string; subtitle: string }[] = [
    { id: 'crout', title: '1. ¿Qué es el Método de Crout?', subtitle: 'Definición, origen y convención' },
    { id: 'lu', title: '2. ¿Qué es la factorización LU?', subtitle: 'Fundamentos algebraicos' },
    { id: 'matL', title: '3. ¿Qué representa la matriz L?', subtitle: 'Triangular inferior general' },
    { id: 'matU', title: '4. ¿Qué representa la matriz U?', subtitle: 'Triangular superior unitaria' },
    { id: 'forward', title: '5. Sustitución hacia adelante', subtitle: 'Resolviendo Ly = b' },
    { id: 'backward', title: '6. Sustitución hacia atrás', subtitle: 'Resolviendo Ux = y' },
    { id: 'ventajas', title: '7. Ventajas del método', subtitle: 'Eficiencia y reusabilidad' },
    { id: 'limitaciones', title: '8. Limitaciones y advertencias', subtitle: 'Pivotes cero y estabilidad' },
    { id: 'civil', title: '9. Aplicaciones en Ing. Civil', subtitle: 'Estructuras y geotecnia' },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Header banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 font-mono uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Módulo Educativo Teórico</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
          Fundamentos del Método de Crout y Factorización LU
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          Comprende la matemática detrás de la descomposición triangular de matrices, las fórmulas recursivas de cálculo celda por celda y cómo resolver sistemas de ecuaciones lineales de forma sistemática.
        </p>
      </div>

      {/* Main Two-Zone Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Topic Selector */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono px-2 mb-2">
            Preguntas Fundamentales
          </div>
          <div className="space-y-1">
            {topics.map((item) => {
              const isActive = activeConcept === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveConcept(item.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isActive
                      ? 'bg-blue-600/15 border-blue-500/50 text-white shadow-sm'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className={`text-sm font-semibold ${isActive ? 'text-blue-300' : 'text-slate-200'}`}>
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-400">
                      {item.subtitle}
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${
                      isActive ? 'text-blue-400 translate-x-1' : 'text-slate-600 group-hover:text-slate-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mt-6 space-y-3">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>¿Listo para practicar?</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pon a prueba los conceptos matemáticos en la calculadora interactiva con números reales.
            </p>
            <button
              onClick={onGoToCalculator}
              className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Abrir Calculadora
            </button>
          </div>
        </div>

        {/* Right Column: Detailed Topic Content Card */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
            {/* Concept 1: ¿Qué es el Método de Crout? */}
            {activeConcept === 'crout' && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">Concepto 01</span>
                  <h2 className="text-2xl font-bold text-white font-display mt-1">¿Qué es el Método de Crout?</h2>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                    El Método de Crout es un algoritmo exacto del álgebra lineal numérica desarrollado por el matemático e ingeniero estadounidense Prescott Durand Crout en 1941. Es una variante fundamental de la factorización LU para matrices cuadradas.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs font-semibold text-blue-300 font-mono">Ecuación Fundamental de Crout:</div>
                  <div className="text-lg font-mono text-white text-center py-2">
                    A = L · U
                  </div>
                  <p className="text-xs text-slate-400 text-center">
                    Donde <span className="text-emerald-400 font-bold">L</span> es una matriz triangular inferior y <span className="text-sky-400 font-bold">U</span> es una matriz triangular superior cuya diagonal principal está fijada estrictamente en unos: <span className="font-mono text-blue-300">u₁₁ = u₂₂ = ... = uₙₙ = 1</span>.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-white">Estructura Matricial Canónica</h3>
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto text-xs font-mono text-center space-y-4">
                    <div className="text-slate-400 text-left font-sans text-xs">Para un sistema 3×3:</div>
                    <div className="flex items-center justify-center gap-3">
                      <div>
                        <div className="text-slate-400 mb-1 font-sans text-[11px]">Matriz A</div>
                        <div className="p-2 border border-slate-800 rounded bg-slate-900">
                          <div>[ a₁₁  a₁₂  a₁₃ ]</div>
                          <div>[ a₂₁  a₂₂  a₂₃ ]</div>
                          <div>[ a₃₁  a₃₂  a₃₃ ]</div>
                        </div>
                      </div>
                      <div className="text-xl text-slate-400">=</div>
                      <div>
                        <div className="text-emerald-400 mb-1 font-sans text-[11px] font-semibold">Matriz L</div>
                        <div className="p-2 border border-emerald-900/40 rounded bg-slate-900 text-emerald-300">
                          <div>[ l₁₁   0    0  ]</div>
                          <div>[ l₂₁  l₂₂   0  ]</div>
                          <div>[ l₃₁  l₃₂  l₃₃ ]</div>
                        </div>
                      </div>
                      <div className="text-xl text-slate-400">·</div>
                      <div>
                        <div className="text-sky-400 mb-1 font-sans text-[11px] font-semibold">Matriz U (Unit)</div>
                        <div className="p-2 border border-sky-900/40 rounded bg-slate-900 text-sky-300">
                          <div>[  1   u₁₂  u₁₃ ]</div>
                          <div>[  0    1   u₂₃ ]</div>
                          <div>[  0    0    1  ]</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-slate-300 leading-relaxed">
                  <h4 className="font-semibold text-white">Diferencia Clave con Doolittle:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 text-xs sm:text-sm pl-2">
                    <li><strong className="text-white">Crout:</strong> La diagonal de <strong className="text-sky-300">U</strong> tiene unos (<span className="font-mono">u_ii = 1</span>). La diagonal de <span className="text-emerald-300">L</span> contiene los pivotes.</li>
                    <li><strong className="text-white">Doolittle:</strong> La diagonal de <strong className="text-emerald-300">L</strong> tiene unos (<span className="font-mono">l_ii = 1</span>). La diagonal de <span className="text-sky-300">U</span> contiene los pivotes.</li>
                    <li><strong className="text-white">Cholesky:</strong> Exclusivo para matrices simétricas y definidas positivas donde <span className="font-mono">A = L · Lᵀ</span>.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Concept 2: ¿Qué es la factorización LU? */}
            {activeConcept === 'lu' && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">Concepto 02</span>
                  <h2 className="text-2xl font-bold text-white font-display mt-1">¿Qué es la Factorización LU?</h2>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                    La factorización o descomposición LU es una técnica fundamental del álgebra lineal que descompone una matriz cuadrada de coeficientes A en el producto de dos matrices triangulares: una Lower (L) y una Upper (U).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="text-xs font-semibold text-blue-300 font-mono">¿Por qué descomponer en triangulares?</div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Resolver un sistema general <span className="font-mono">Ax = b</span> requiere <span className="font-mono">O(2n³/3)</span> operaciones. Sin embargo, resolver un sistema triangular requiere únicamente <span className="font-mono">O(n²)</span> operaciones mediante sustituciones simples y directas.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="text-xs font-semibold text-blue-300 font-mono">El proceso en dos etapas:</div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Al escribir <span className="font-mono">Ax = (LU)x = L(Ux) = b</span>, definimos una incógnita intermedia <span className="font-mono text-emerald-300">y = Ux</span>. Entonces resolvemos primero <span className="font-mono text-emerald-300">Ly = b</span> y luego <span className="font-mono text-sky-300">Ux = y</span>.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-semibold text-white">Esquema del Flujo de Resolución</h4>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center w-full sm:w-auto">
                      <div className="text-slate-400 font-sans text-[11px]">Paso 1</div>
                      <div className="text-white font-bold text-sm">A = L · U</div>
                      <div className="text-slate-500 font-sans text-[10px]">Factorización Crout</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-400 shrink-0 rotate-90 sm:rotate-0" />
                    <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-900/60 text-center w-full sm:w-auto">
                      <div className="text-emerald-400 font-sans text-[11px]">Paso 2</div>
                      <div className="text-emerald-300 font-bold text-sm">L · y = b</div>
                      <div className="text-slate-400 font-sans text-[10px]">Sustitución Adelante</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-400 shrink-0 rotate-90 sm:rotate-0" />
                    <div className="p-3 rounded-lg bg-sky-950/40 border border-sky-900/60 text-center w-full sm:w-auto">
                      <div className="text-sky-400 font-sans text-[11px]">Paso 3</div>
                      <div className="text-sky-300 font-bold text-sm">U · x = y</div>
                      <div className="text-slate-400 font-sans text-[10px]">Sustitución Atrás</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Concept 3: Matriz L */}
            {activeConcept === 'matL' && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Concepto 03</span>
                  <h2 className="text-2xl font-bold text-white font-display mt-1">¿Qué representa la matriz L?</h2>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                    La matriz <strong className="text-emerald-300">L (Lower Triangular)</strong> es una matriz triangular inferior donde todos los elementos por encima de la diagonal principal son cero (<span className="font-mono">l_ij = 0</span> para todo <span className="font-mono">j &gt; i</span>).
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white">Fórmula de Construcción en Crout</h3>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <p className="text-xs text-slate-300">
                      Para cada columna <span className="font-mono text-blue-300">j</span>, los elementos de <span className="font-mono text-emerald-300">L</span> desde la fila <span className="font-mono">i = j</span> hasta <span className="font-mono">n</span> se calculan restando a <span className="font-mono">a_ij</span> el producto escalar de los elementos ya conocidos:
                    </p>
                    <div className="p-3 bg-slate-900 rounded-lg text-emerald-300 font-mono text-sm text-center">
                      l_ij = a_ij - ∑ (k=1 hasta j-1) [ l_ik · u_kj ]
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="font-semibold text-white block">Primera Columna (j = 1):</span>
                    <p className="text-slate-400">
                      Como la sumatoria no tiene términos previos (<span className="font-mono">k &lt; 1</span>), los elementos de la primera columna de L son idénticos a los de A:
                    </p>
                    <div className="font-mono text-emerald-400">l_i1 = a_i1  (para i = 1, ..., n)</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="font-semibold text-white block">Pivotes Diagonales:</span>
                    <p className="text-slate-400">
                      El elemento diagonal <span className="font-mono text-emerald-400">l_jj</span> actúa como pivote de la columna y será el divisor para generar la fila <span className="font-mono">j</span> de <span className="font-mono text-sky-400">U</span>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Concept 4: Matriz U */}
            {activeConcept === 'matU' && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-xs font-mono text-sky-400 uppercase tracking-wider">Concepto 04</span>
                  <h2 className="text-2xl font-bold text-white font-display mt-1">¿Qué representa la matriz U?</h2>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                    La matriz <strong className="text-sky-300">U (Upper Triangular)</strong> es una matriz triangular superior donde todos los elementos por debajo de la diagonal principal son cero (<span className="font-mono">u_ij = 0</span> para todo <span className="font-mono">i &gt; j</span>). En el método de Crout, su rasgo característico es que es <strong className="text-white">unitaria</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-900/40 space-y-2">
                  <div className="text-xs font-semibold text-sky-400 font-mono">Diagonal Unitaria Obligatoria:</div>
                  <div className="font-mono text-sm text-white text-center">
                    u₁₁ = 1,  u₂₂ = 1,  u₃₃ = 1,  ...,  uₙₙ = 1
                  </div>
                  <p className="text-xs text-slate-400 text-center">
                    Esto elimina la necesidad de calcular la diagonal de U y simplifica radicalmente la posterior sustitución hacia atrás.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white">Fórmula de los Elementos Superiores</h3>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <p className="text-xs text-slate-300">
                      Para la fila <span className="font-mono text-blue-300">j</span>, los elementos fuera de la diagonal (columnas <span className="font-mono">k = j + 1</span> hasta <span className="font-mono">n</span>) se calculan dividiendo entre el pivote <span className="font-mono text-emerald-400">l_jj</span>:
                    </p>
                    <div className="p-3 bg-slate-900 rounded-lg text-sky-300 font-mono text-sm text-center">
                      u_jk = ( a_jk - ∑ (m=1 hasta j-1) [ l_jm · u_mk ] ) / l_jj
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs text-amber-200/90 space-y-1">
                  <span className="font-semibold block flex items-center gap-1.5 text-amber-300">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Advertencia de División por Cero:
                  </span>
                  <p>
                    Observa que la fórmula divide directamente entre <span className="font-mono font-bold">l_jj</span>. Si en cualquier etapa este pivote es exactamente cero o muy cercano a cero, la factorización estándar de Crout se detiene obligatoriamente.
                  </p>
                </div>
              </div>
            )}

            {/* Concept 5: Sustitución hacia adelante */}
            {activeConcept === 'forward' && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Concepto 05</span>
                  <h2 className="text-2xl font-bold text-white font-display mt-1">Sustitución hacia Adelante (Ly = b)</h2>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                    Una vez obtenidas las matrices L y U, el sistema <span className="font-mono">Ax = b</span> se transforma en resolver dos sistemas triangulares consecutivos. El primero es <strong className="text-emerald-300">L · y = b</strong>, donde encontramos el vector auxiliar <span className="font-mono text-white">y</span>.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white">Mecanismo Progresivo (De arriba hacia abajo)</h3>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400 font-sans">Ecuación 1 (inmediata):</span>
                      <span className="text-emerald-300">l₁₁ · y₁ = b₁  ==&gt;  y₁ = b₁ / l₁₁</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400 font-sans">Ecuación 2:</span>
                      <span className="text-emerald-300">l₂₁ · y₁ + l₂₂ · y₂ = b₂  ==&gt;  y₂ = (b₂ - l₂₁ y₁) / l₂₂</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400 font-sans">Ecuación general i:</span>
                      <span className="text-emerald-300">y_i = [ b_i - ∑ (j=1 hasta i-1) l_ij · y_j ] / l_ii</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                  <span className="font-semibold text-white block">Significado del vector y:</span>
                  <p className="text-slate-400 leading-relaxed">
                    El vector intermedio <span className="font-mono text-white">y</span> representa el resultado de aplicar sobre el vector de cargas externas <span className="font-mono">b</span> las mismas operaciones de reducción que transformaron la matriz A en la matriz U.
                  </p>
                </div>
              </div>
            )}

            {/* Concept 6: Sustitución hacia atrás */}
            {activeConcept === 'backward' && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-xs font-mono text-sky-400 uppercase tracking-wider">Concepto 06</span>
                  <h2 className="text-2xl font-bold text-white font-display mt-1">Sustitución hacia Atrás (Ux = y)</h2>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                    En la segunda etapa, resolvemos el sistema triangular superior unitario <strong className="text-sky-300">U · x = y</strong> para despejar directamente las incógnitas reales del sistema (<span className="font-mono text-white">x₁, x₂, ..., xₙ</span>).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-900/40 space-y-2">
                  <div className="text-xs font-semibold text-sky-300 font-mono">Ventaja de la diagonal unitaria de Crout:</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Como <span className="font-mono font-bold text-white">u_ii = 1</span>, ¡nunca se divide por el coeficiente diagonal durante la sustitución hacia atrás! Esto evita divisiones adicionales y posibles pérdidas de precisión numérica.
                  </p>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-sans">Última incógnita (inmediata):</span>
                    <span className="text-sky-300">1 · xₙ = yₙ  ==&gt;  xₙ = yₙ</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-sans">Penúltima incógnita:</span>
                    <span className="text-sky-300">x_{'{n-1}'} + u_{'{n-1, n}'} · xₙ = y_{'{n-1}'}  ==&gt;  x_{'{n-1}'} = y_{'{n-1}'} - u_{'{n-1, n}'} xₙ</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400 font-sans">Fórmula general:</span>
                    <span className="text-sky-300">x_i = y_i - ∑ (j=i+1 hasta n) [ u_ij · x_j ]</span>
                  </div>
                </div>
              </div>
            )}

            {/* Concept 7: Ventajas del método */}
            {activeConcept === 'ventajas' && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">Concepto 07</span>
                  <h2 className="text-2xl font-bold text-white font-display mt-1">¿Cuáles son las Ventajas del Método?</h2>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                    Comparado con otros métodos directos (como Gauss o la matriz inversa), el método de Crout ofrece ventajas decisivas en computación y aplicaciones de ingeniería.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-mono font-bold text-xs">
                      01
                    </div>
                    <h4 className="text-sm font-semibold text-white">Reutilización de L y U</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Si la matriz de coeficientes A no cambia pero tenemos múltiples vectores de términos independientes b₁, b₂, b₃ (por ejemplo, 10 hipótesis de carga distintas sobre un puente), la descomposición LU se calcula <strong className="text-white">una sola vez</strong>. Cada nuevo vector de carga solo requiere sustitución rápida O(n²).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-mono font-bold text-xs">
                      02
                    </div>
                    <h4 className="text-sm font-semibold text-white">Cálculo Rápido del Determinante</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Dado que det(A) = det(L) · det(U) y la matriz U tiene diagonal unitaria (det(U) = 1), el determinante de la matriz A es simplemente el producto de los elementos diagonales de L:
                      <span className="font-mono text-blue-300 block mt-1">det(A) = l₁₁ · l₂₂ · ... · lₙₙ</span>
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-mono font-bold text-xs">
                      03
                    </div>
                    <h4 className="text-sm font-semibold text-white">Eficiencia en Memoria Compacta</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      L y U pueden almacenarse en el mismo espacio de memoria que la matriz original A, ya que la diagonal de U siempre es 1 y no necesita ser guardada en almacenamiento persistente.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-mono font-bold text-xs">
                      04
                    </div>
                    <h4 className="text-sm font-semibold text-white">Preservación de Ancho de Banda</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      En matrices tridiagonales o de banda (comunes en ingeniería estructural y diferencias finitas), Crout preserva la banda de ceros fuera del ancho principal sin generar elementos llenos innecesarios.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Concept 8: Limitaciones */}
            {activeConcept === 'limitaciones' && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">Concepto 08</span>
                  <h2 className="text-2xl font-bold text-white font-display mt-1">Limitaciones y Casos de Falla</h2>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                    Es indispensable que los futuros ingenieros comprendan las limitaciones teóricas y numéricas del algoritmo para no interpretar ciegamente los resultados de un software.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      <span>1. Falla por Pivote Nulo (l_jj = 0)</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Si en cualquier columna <span className="font-mono">j</span> el elemento diagonal de L resulta ser cero (<span className="font-mono">l_jj = 0</span>), es imposible calcular los elementos <span className="font-mono">u_jk</span> de la matriz U, ya que requeriría dividir entre cero.
                    </p>
                    <div className="p-2.5 bg-slate-950 rounded border border-rose-900/30 font-mono text-rose-300">
                      Ejemplo simple de falla: A = [ [0, 1], [1, 1] ]. Aunque la matriz tiene determinante -1 (no es singular), Crout sin pivoteo falla en el primer paso (l₁₁ = 0).
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      <span>2. Sensibilidad Numérica e Inestabilidad sin Pivoteo</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Si un pivote <span className="font-mono">l_jj</span> es extraordinariamente pequeño (por ejemplo, <span className="font-mono">10⁻¹⁰</span>), dividir entre él magnifica los errores de redondeo de la aritmética de punto flotante de la computadora, generando soluciones espurias o inestables.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      <span>¿Cuándo está garantizada la convergencia sin pivoteo?</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                      El método de Crout sin permutación de filas está matemáticamente garantizado para converger si la matriz A es <strong className="text-white">estrictamente dominante en la diagonal</strong> o si es <strong className="text-white">simétrica y definida positiva</strong> (como ocurre comúnmente con las matrices de rigidez estructural bien restringidas).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Concept 9: Aplicaciones en Ingeniería Civil */}
            {activeConcept === 'civil' && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">Concepto 09</span>
                  <h2 className="text-2xl font-bold text-white font-display mt-1">Aplicaciones Reales en Ingeniería Civil</h2>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                    Los modelos matemáticos de la física estructural, la hidráulica y la geotecnia culminan invariablemente en la resolución de sistemas lineales gigantescos.
                  </p>
                </div>

                <div className="space-y-4 text-xs text-slate-300">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="font-semibold text-white text-sm block">1. Análisis Matricial de Estructuras ([K]&#123;u&#125; = &#123;F&#125;)</span>
                    <p className="text-slate-400 leading-relaxed">
                      Los grados de libertad de nudos en puentes y rascacielos generan la matriz de rigidez global [K]. La descomposición LU de Crout permite factorizar la estructura una vez y someterla a infinitas combinaciones de sismo, viento, frenado vehicular y temperatura.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="font-semibold text-white text-sm block">2. Método de los Elementos Finitos (MEF)</span>
                    <p className="text-slate-400 leading-relaxed">
                      En presas de arco-gravedad, muros pantalla y túneles subterráneos, el continuo se discretiza en miles de elementos tetraédricos o isoparamétricos cuya resolución numérica depende de algoritmos LU optimizados por bloques.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="font-semibold text-white text-sm block">3. Redes Malladas de Agua Potable</span>
                    <p className="text-slate-400 leading-relaxed">
                      El balance de masa y energía en las redes de tuberías (método de Hardy Cross o ecuaciones de conservación de carga piezométrica) se linealiza mediante iteraciones de Newton-Raphson, donde cada paso requiere resolver un sistema lineal mediante LU.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
