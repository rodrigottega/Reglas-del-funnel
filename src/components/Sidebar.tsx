import React, { useState } from 'react';

interface SidebarProps {
  activeMenu?: string;
  onSelectMenu?: (menu: string) => void;
}

export default function Sidebar({ activeMenu = 'agente_ia', onSelectMenu }: SidebarProps) {
  const [isIaConfigExpanded, setIsIaConfigExpanded] = useState(true);
  const [isCanalesExpanded, setIsCanalesExpanded] = useState(false);
  const [isEquipoExpanded, setIsEquipoExpanded] = useState(false);

  return (
    <aside className="w-[248px] bg-white border-r border-slate-200 h-screen flex flex-col shrink-0 select-none text-[13px] text-slate-600">
      {/* Top Header Logo */}
      <div className="h-[56px] border-b border-slate-100 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          {/* Custom Ciarem Logo icon: a simple green/teal elegant circle representation */}
          <div className="w-5 h-5 bg-emerald-500 rounded-md flex items-center justify-center text-white text-[11px] font-bold tracking-tighter">
            c
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">ciarem</span>
        </div>
        <button className="text-slate-400 hover:text-slate-600 cursor-pointer">
          <i className="ri-sidebar-fold-line text-[16px]"></i>
        </button>
      </div>

      {/* Main Menu Scrollable Area */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        
        {/* Core Items */}
        <button className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-50 cursor-pointer text-left transition-colors">
          <div className="flex items-center gap-2.5">
            <i className="ri-dashboard-line text-slate-400 text-base"></i>
            <span className="font-medium text-slate-700">Dashboard</span>
          </div>
        </button>

        <button className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-50 cursor-pointer text-left transition-colors">
          <div className="flex items-center gap-2.5">
            <i className="ri-inbox-line text-slate-400 text-base"></i>
            <span className="font-medium text-slate-700">Bandeja de entrada</span>
          </div>
          <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full font-semibold">2</span>
        </button>

        <button className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-50 cursor-pointer text-left transition-colors">
          <div className="flex items-center gap-2.5">
            <i className="ri-contacts-line text-slate-400 text-base"></i>
            <span className="font-medium text-slate-700">Contactos</span>
          </div>
        </button>

        <button className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-50 cursor-pointer text-left transition-colors">
          <div className="flex items-center gap-2.5">
            <i className="ri-bar-chart-line text-slate-400 text-base"></i>
            <span className="font-medium text-slate-700">Métricas</span>
          </div>
        </button>

        <button className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-50 cursor-pointer text-left transition-colors">
          <div className="flex items-center gap-2.5">
            <i className="ri-shopping-bag-line text-slate-400 text-base"></i>
            <span className="font-medium text-slate-700">Catálogo</span>
          </div>
        </button>

        {/* Collapsible: Canales */}
        <div>
          <button 
            onClick={() => setIsCanalesExpanded(!isCanalesExpanded)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-50 cursor-pointer text-left transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <i className="ri-global-line text-slate-400 text-base"></i>
              <span className="font-medium text-slate-700">Canales</span>
            </div>
            <i className={`ri-arrow-down-s-line text-slate-400 transition-transform ${isCanalesExpanded ? 'rotate-180' : ''}`}></i>
          </button>
          {isCanalesExpanded && (
            <div className="pl-8 pr-2 py-1 space-y-0.5">
              <button className="w-full py-1.5 text-left text-slate-500 hover:text-slate-800 cursor-pointer block">WhatsApp</button>
              <button className="w-full py-1.5 text-left text-slate-500 hover:text-slate-800 cursor-pointer block">Instagram</button>
            </div>
          )}
        </div>

        {/* Collapsible Section: Configuración de IA */}
        <div>
          <button 
            onClick={() => setIsIaConfigExpanded(!isIaConfigExpanded)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-50 cursor-pointer text-left transition-colors mt-2"
          >
            <div className="flex items-center gap-2.5">
              <i className="ri-robot-line text-slate-400 text-base"></i>
              <span className="font-semibold text-slate-800">Configuración de IA</span>
            </div>
            <i className={`ri-arrow-down-s-line text-slate-400 transition-transform ${isIaConfigExpanded ? 'rotate-180' : ''}`}></i>
          </button>

          {isIaConfigExpanded && (
            <div className="pl-7 pr-2 py-1 space-y-1">
              <button 
                onClick={() => onSelectMenu?.('agente_ia')}
                className={`w-full text-left px-3 py-1.5 rounded-md cursor-pointer transition-colors block font-medium ${
                  activeMenu === 'agente_ia' 
                    ? 'bg-slate-100 text-slate-950 font-semibold' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                Agente IA
              </button>
              <button 
                onClick={() => onSelectMenu?.('monitoreo')}
                className={`w-full text-left px-3 py-1.5 rounded-md cursor-pointer transition-colors block font-medium ${
                  activeMenu === 'monitoreo' 
                    ? 'bg-slate-100 text-slate-950 font-semibold' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                Monitoreo
              </button>
              <button 
                onClick={() => onSelectMenu?.('base_conocimiento')}
                className={`w-full text-left px-3 py-1.5 rounded-md cursor-pointer transition-colors block font-medium truncate ${
                  activeMenu === 'base_conocimiento' 
                    ? 'bg-slate-100 text-slate-950 font-semibold' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                Base de conocimien...
              </button>
            </div>
          )}
        </div>

        {/* Collapsible: Gestión de equipo */}
        <div>
          <button 
            onClick={() => setIsEquipoExpanded(!isEquipoExpanded)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-50 cursor-pointer text-left transition-colors mt-2"
          >
            <div className="flex items-center gap-2.5">
              <i className="ri-group-line text-slate-400 text-base"></i>
              <span className="font-medium text-slate-700">Gestión de equipo</span>
            </div>
            <i className={`ri-arrow-down-s-line text-slate-400 transition-transform ${isEquipoExpanded ? 'rotate-180' : ''}`}></i>
          </button>
          {isEquipoExpanded && (
            <div className="pl-8 pr-2 py-1 space-y-0.5">
              <button className="w-full py-1.5 text-left text-slate-500 hover:text-slate-800 cursor-pointer block">Miembros</button>
              <button className="w-full py-1.5 text-left text-slate-500 hover:text-slate-800 cursor-pointer block">Roles</button>
            </div>
          )}
        </div>

      </div>

      {/* Footer Area with bottom settings */}
      <div className="p-2 border-t border-slate-100 bg-white shrink-0 space-y-0.5">
        <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md hover:bg-slate-50 cursor-pointer text-left text-slate-600 transition-colors">
          <i className="ri-settings-3-line text-slate-400 text-base"></i>
          <span>Configuración</span>
        </button>

        <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md hover:bg-slate-50 cursor-pointer text-left text-slate-600 transition-colors">
          <i className="ri-contrast-2-line text-slate-400 text-base"></i>
          <span>Apariencia: Sistema</span>
        </button>

        <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md hover:bg-slate-50 cursor-pointer text-left text-slate-600 transition-colors">
          <i className="ri-earth-line text-slate-400 text-base"></i>
          <span>Idioma: Español</span>
        </button>

        {/* User Card */}
        <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between px-3 py-1 rounded-md">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 shrink-0 text-xs">
              C
            </div>
            <div className="overflow-hidden leading-tight">
              <p className="font-semibold text-slate-900 truncate">Company</p>
              <p className="text-[10.5px] text-slate-400 truncate">company@example.com</p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <i className="ri-arrow-up-down-line text-xs"></i>
          </button>
        </div>
      </div>
    </aside>
  );
}
