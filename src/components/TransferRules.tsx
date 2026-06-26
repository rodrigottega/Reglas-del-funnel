import React from 'react';

export default function TransferRules() {
  const rules = [
    {
      id: 1,
      name: 'Transferencia por complejidad',
      description: 'Si el Agente FAQ no puede responder 3 preguntas seguidas, transfiere a soporte humano.',
      trigger: 'Fallo en respuesta x3',
      action: 'Asignar a Grupo Soporte',
      active: true,
    },
    {
      id: 2,
      name: 'Transferencia de Calificados',
      description: 'Cuando un contacto es movido a Calificado, transfiere inmediatamente al equipo de ventas.',
      trigger: 'Etapa = Calificado',
      action: 'Notificar y Asignar a Ejecutivo Comercial',
      active: true,
    },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h1 className="text-[22px] font-bold text-slate-950 tracking-tight leading-tight">Reglas de transferencia</h1>
          <p className="text-[13.5px] text-slate-500 mt-1">
            Establece las condiciones para transferir conversaciones entre agentes de IA y operadores humanos.
          </p>
        </div>
        <button className="bg-slate-950 hover:bg-slate-800 text-white font-medium text-xs px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1.5 h-9">
          <i className="ri-add-line text-[14px]"></i>
          Nueva regla
        </button>
      </div>

      <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 flex-1 min-h-0 overflow-y-auto">
        <div className="space-y-4">
          {rules.map((rule) => (
            <div key={rule.id} className="bg-white border border-slate-200 rounded-xl p-5 flex items-start justify-between">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900 text-sm">{rule.name}</h3>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-md">
                    Sistema
                  </span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">{rule.description}</p>
                
                <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 text-xs">
                  <span className="flex items-center gap-1 text-slate-500">
                    <strong className="text-slate-700">Disparador:</strong> {rule.trigger}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <strong className="text-slate-700">Acción:</strong> {rule.action}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={rule.active} className="sr-only peer" readOnly />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-950"></div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-50">
                  <i className="ri-pencil-line text-sm"></i>
                </button>
                <button className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-slate-50">
                  <i className="ri-delete-bin-line text-sm"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
