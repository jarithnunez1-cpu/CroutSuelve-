import React from 'react';
import { ArrowRight, BookOpen, Calculator, CheckCircle2, ShieldCheck, Cpu, Building2, Download, Layers } from 'lucide-react';
import { ActiveTab } from './Header';

interface HomeHeroProps {
  setActiveTab: (tab: ActiveTab) => void;
  onLoadPreset: (presetId: string) => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ setActiveTab, onLoadPreset }) => {
  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12 lg:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline and description */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="text-blue-400 font-semibold">Métodos Numéricos</span>
              <span aria-hidden="true">·</span>
              <span>Factorización LU</span>
              <span aria-hidden="true">·</span>
              <span>Ingeniería Civil</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display leading-[1.15] text-balance">
              Domina el <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">Método de Crout</span> con rigor y claridad matemática
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Plataforma pedagógica e interactiva para estudiantes y docentes. Descompón cualquier matriz cuadrada en el producto <span className="text-blue-300 font-mono font-medium">A = L · U</span> con diagonal unitaria en <span className="text-blue-300 font-mono font-medium">U</span>, resuelve sistemas mediante sustitución progresiva y aplica los resultados al análisis estructural real.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  setActiveTab('calculadora');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Calculator className="w-4 h-4" />
                <span>Comenzar a calcular</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => {
                  setActiveTab('teoria');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 text-sm font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 hover:text-white border border-slate-700 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span>Aprender el método</span>
              </button>
            </div>

            {/* Micro proof points */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-y-2 gap-x-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Cálculos exactos sin simulación</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Resolución celda por celda</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Exportación a PDF</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Mathematical Matrix Card (Example canónico) */}
          <div className="lg:col-span-5">
            <div className="rounded-xl bg-slate-900/90 border border-slate-700/80 p-6 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Ejemplo Canónico (2×2)
                </span>
                <span className="text-xs font-mono text-blue-400 font-medium">A = L · U</span>
              </div>

              {/* Matrix Layout visualizer */}
              <div className="space-y-4 font-mono text-sm">
                <div>
                  <div className="text-[11px] font-sans text-slate-400 mb-1">Matriz A original:</div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center gap-6">
                    <span className="text-slate-400">[</span>
                    <div className="text-center space-y-1">
                      <div className="flex gap-4"><span className="text-blue-300 w-4">2</span><span className="text-blue-300 w-4">1</span></div>
                      <div className="flex gap-4"><span className="text-blue-300 w-4">4</span><span className="text-blue-300 w-4">3</span></div>
                    </div>
                    <span className="text-slate-400">]</span>
                    <span className="text-xs font-sans text-slate-400">· x =</span>
                    <span className="text-slate-400">[</span>
                    <div className="text-center space-y-1">
                      <div className="text-sky-300">5</div>
                      <div className="text-sky-300">11</div>
                    </div>
                    <span className="text-slate-400">]</span>
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="flex items-center justify-center text-xs font-sans text-slate-400 gap-2">
                  <div className="h-px bg-slate-800 flex-1" />
                  <span>Factorización de Crout</span>
                  <div className="h-px bg-slate-800 flex-1" />
                </div>

                {/* Matrices L and U */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                    <div className="text-[10px] font-sans font-semibold text-emerald-400 mb-1">Matriz L (Triangular Inf.)</div>
                    <div className="flex items-center justify-center gap-2 text-xs">
                      <span className="text-slate-500">[</span>
                      <div className="space-y-0.5">
                        <div className="flex gap-2"><span>2</span><span className="text-slate-600">0</span></div>
                        <div className="flex gap-2"><span>4</span><span>1</span></div>
                      </div>
                      <span className="text-slate-500">]</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                    <div className="text-[10px] font-sans font-semibold text-sky-400 mb-1">Matriz U (Diagonal Unitaria)</div>
                    <div className="flex items-center justify-center gap-2 text-xs">
                      <span className="text-slate-500">[</span>
                      <div className="space-y-0.5">
                        <div className="flex gap-2"><span className="text-blue-300 font-bold">1</span><span>0.5</span></div>
                        <div className="flex gap-2"><span className="text-slate-600">0</span><span className="text-blue-300 font-bold">1</span></div>
                      </div>
                      <span className="text-slate-500">]</span>
                    </div>
                  </div>
                </div>

                {/* Solution */}
                <div className="p-3 bg-blue-950/40 rounded-lg border border-blue-900/40 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-sans text-blue-300 block">Vector solución comprobado:</span>
                    <span className="text-sm font-semibold text-white">x₁ = 2,  x₂ = 1</span>
                  </div>
                  <button
                    onClick={() => onLoadPreset('crout-mandatory-demo')}
                    className="text-xs px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-sans font-medium transition-colors cursor-pointer"
                  >
                    Probar ahora
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Grid */}
      <section className="space-y-6">
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-400 font-mono">
            Arquitectura del Sistema
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Todo lo que necesitas para dominar el Método de Crout
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            Diseñado desde cero para transformar ecuaciones abstractas en un proceso transparente, interactivo y directamente aplicable a la ingeniería.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Calculadora Dinámica Multidimensional</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Resuelve matrices desde 2×2 hasta 6×6. Acepta números enteros, decimales y coeficientes negativos, con visualización tanto en decimales como en fracciones exactas.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
            <div className="w-10 h-10 rounded-lg bg-sky-600/20 text-sky-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Desglose Paso a Paso Interactivo</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Visualiza cada operación con resaltado simultáneo en las matrices: fórmulas algebraicas, sustitución numérica y obtención progresiva de L, U, y y x.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Validaciones y Detección de Errores</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              El motor detecta pivotes nulos (l_jj = 0), matrices singulares y problemas de acondicionamiento sin ocultar errores matemáticos, explicando la causa al estudiante.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Aplicaciones en Ingeniería Civil</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Comprende por qué la factorización LU es el núcleo de programas de análisis estructural como SAP2000 y ETABS: factoriza una vez la matriz de rigidez [K] y resuelve para múltiples casos de carga.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Módulo de Práctica con Evaluación</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Resuelve problemas clasificados por nivel de dificultad, ingresa tus propias soluciones vectoriales y recibe retroalimentación inmediata sobre tus aciertos y discrepancias.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
            <div className="w-10 h-10 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Exportación Formal a PDF e Historial</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Genera documentos impresos listos para entrega académica con matrices completas, sustituciones y verificación de residuos, además de almacenamiento local persistente.
            </p>
          </div>
        </div>
      </section>

      {/* Section: Why Civil Engineering & LU Factorization */}
      <section className="rounded-2xl bg-slate-950 border border-slate-800 p-8 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider font-mono">
              Relevancia Profesional
            </span>
            <h3 className="text-2xl font-bold text-white font-display mt-1">
              ¿Por qué el Método de Crout es vital en Ingeniería Civil?
            </h3>
          </div>
          <button
            onClick={() => {
              setActiveTab('ingenieria');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs px-4 py-2 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded-lg transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
          >
            <span>Ver módulo completo de ingeniería</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-300">
          <div className="space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-blue-950 text-blue-400 text-xs flex items-center justify-center font-mono">01</span>
              Método de Rigidez Directa
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              En estructuras reticulares y pórticos, se ensambla la ecuación matricial global <span className="font-mono text-blue-300">[K]&#123;u&#125; = &#123;F&#125;</span>. La matriz de rigidez <span className="font-mono">[K]</span> solo depende de la geometría y el material; no cambia con las cargas.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-blue-950 text-blue-400 text-xs flex items-center justify-center font-mono">02</span>
              Múltiples Hipótesis de Carga
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Un puente o edificio debe verificarse ante carga permanente (D), sobrecarga de uso (L), viento (W) y sismo (E). Con la factorización LU de Crout, se factoriza <span className="font-mono">[K]</span> una sola vez (costo <span className="font-mono">O(n³/3)</span>) y cada estado de carga se resuelve en <span className="font-mono">O(n²)</span> mediante sustituciones rápidas.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-blue-950 text-blue-400 text-xs flex items-center justify-center font-mono">03</span>
              Matrices de Banda y Elementos Finitos
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Las mallas de elementos finitos generan matrices dispersas con un ancho de banda definido. Crout preserva la banda de ceros, minimizando memoria y acelerando el análisis estructural de presas, túneles y losas de cimentación.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
