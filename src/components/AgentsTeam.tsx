import React from 'react';
import { AGENT_TYPES } from '../data';

export default function AgentsTeam() {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h1 className="text-[22px] font-bold text-slate-950 tracking-tight leading-tight">Equipo de agentes IA</h1>
          <p className="text-[13.5px] text-slate-500 mt-1">
            Visualiza y administra los agentes que atienden tus diferentes canales y necesidades de clientes.
          </p>
        </div>
        <button className="bg-slate-950 hover:bg-slate-800 text-white font-medium text-xs px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1.5 h-9">
          <i className="ri-user-add-line text-[14px]"></i>
          Agregar agente
        </button>
      </div>

      <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 flex-1 min-h-0 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AGENT_TYPES.map((agent) => (
            <div key={agent.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-700 font-bold">
                    <i className="ri-robot-2-line text-lg"></i>
                  </div>
                  {agent.disabled ? (
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                      {agent.badge || 'Próximamente'}
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                      Activo
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">{agent.name}</h3>
                <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">{agent.description}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 text-slate-400">
                  <i className="ri-git-commit-line"></i>
                  Canales: WhatsApp
                </span>
                <button className={`font-semibold ${agent.disabled ? 'text-slate-300 cursor-not-allowed' : 'text-slate-900 hover:underline cursor-pointer'}`}>
                  Configurar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
