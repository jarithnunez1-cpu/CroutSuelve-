import React, { useState } from 'react';
import { Menu, X, Calculator, BookOpen, GraduationCap, Building2, History, Compass } from 'lucide-react';

export type ActiveTab = 'inicio' | 'teoria' | 'calculadora' | 'paso-a-paso' | 'practica' | 'ingenieria' | 'historial';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  hasCalculated: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, hasCalculated }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'inicio', label: 'Inicio', icon: <Compass className="w-4 h-4" /> },
    { id: 'teoria', label: 'Teoría', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'calculadora', label: 'Calculadora', icon: <Calculator className="w-4 h-4" /> },
    {
      id: 'paso-a-paso',
      label: 'Paso a Paso',
      icon: <Calculator className="w-4 h-4" />,
      badge: hasCalculated ? 'Activo' : undefined,
    },
    { id: 'practica', label: 'Práctica', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'ingenieria', label: 'Ingeniería Civil', icon: <Building2 className="w-4 h-4" /> },
    { id: 'historial', label: 'Historial', icon: <History className="w-4 h-4" /> },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: Zone 1 (Brand) - Zone 2 (Nav links) - Zone 3 (1 Action) */}
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('inicio')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-sm shadow-md shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
                  [A]
                </span>
                <span className="text-xl font-bold tracking-tight text-white font-display whitespace-nowrap">
                  Crout<span className="text-blue-400">Solve</span>
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Concise single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            {navLinks.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-1 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    isActive ? 'text-blue-400' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {item.badge && (
                      <span className="text-[10px] text-blue-300 font-mono">
                        ({item.badge})
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('calculadora')}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-600/30 transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
            >
              Comenzar a calcular
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-900 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive ? 'bg-blue-600/20 text-blue-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-xs font-mono text-blue-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => handleNavClick('calculadora')}
              className="w-full py-2.5 text-center text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Comenzar a calcular
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
