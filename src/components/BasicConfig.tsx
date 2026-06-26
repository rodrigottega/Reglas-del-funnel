import React, { useState } from 'react';

interface BasicConfigProps {
  onSave?: () => void;
}

export default function BasicConfig({ onSave }: BasicConfigProps) {
  const [idioma, setIdioma] = useState<'es' | 'en' | 'pt'>('es');
  const [longitud, setLongitud] = useState<'breve' | 'normal' | 'detallada'>('normal');
  const [iniciativa, setIniciativa] = useState<'bajo' | 'medio' | 'alto'>('medio');
  const [voz, setVoz] = useState<'formal' | 'neutral' | 'casual'>('neutral');
  const [contextAdded, setContextAdded] = useState(false);
  const [contextText, setContextText] = useState('');
  const [isAddingContext, setIsAddingContext] = useState(false);

  const handleSave = () => {
    if (onSave) onSave();
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header aligned top right with Save Button */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h1 className="text-[22px] font-bold text-slate-950 tracking-tight leading-tight">Configuración básica</h1>
          <p className="text-[13.5px] text-slate-500 mt-1">
            Define cómo debe comunicarse el agente IA cuando responde a tus contactos.
          </p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-slate-950 hover:bg-slate-800 text-white font-medium text-xs px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1.5 h-9"
        >
          <i className="ri-save-line text-[14px]"></i>
          Guardar cambios
        </button>
      </div>

      {/* Main light gray container */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 flex-1 min-h-0 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Left panel: Contexto acerca de tu empresa */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 min-h-[420px] flex flex-col justify-center items-center text-center">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-600 mb-4 shadow-sm">
              <i className="ri-building-line text-xl"></i>
            </div>
            
            <h3 className="font-semibold text-slate-950 text-[15px]">Contexto acerca de tu empresa</h3>
            <p className="text-slate-500 text-[13px] leading-relaxed max-w-xs mt-1 mb-5">
              {contextAdded 
                ? 'El contexto ha sido cargado con éxito. El agente IA lo usará para guiar sus respuestas.'
                : 'Escribe la información que el agente necesita saber para representar correctamente a tu empresa.'}
            </p>

            {isAddingContext ? (
              <div className="w-full max-w-sm space-y-3">
                <textarea 
                  value={contextText}
                  onChange={(e) => setContextText(e.target.value)}
                  placeholder="Ej: Somos una tienda de venta de calzado deportivo con envíos gratis..."
                  className="w-full text-[13px] p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 min-h-[100px] resize-none"
                />
                <div className="flex gap-2 justify-center">
                  <button 
                    onClick={() => {
                      setIsAddingContext(false);
                      setContextAdded(contextText.trim().length > 0);
                    }}
                    className="bg-slate-950 hover:bg-slate-800 text-white text-xs font-medium py-1.5 px-3 rounded-lg cursor-pointer"
                  >
                    Guardar Contexto
                  </button>
                  <button 
                    onClick={() => setIsAddingContext(false)}
                    className="border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium py-1.5 px-3 rounded-lg cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsAddingContext(true)}
                className="bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 font-medium text-xs px-4 py-2 rounded-lg transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <i className="ri-add-line text-[14px]"></i>
                {contextAdded ? 'Editar contexto' : 'Agregar contexto'}
              </button>
            )}
          </div>

          {/* Right panel: Controls */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            
            {/* Idioma principal */}
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-950 text-[14px]">Idioma principal</h4>
              <p className="text-[12.5px] text-slate-500 leading-relaxed">
                El agente usará este idioma como base para responder. Si el contacto escribe en otro idioma, podrá adaptarse cuando sea necesario.
              </p>
              <div className="flex bg-slate-50 border border-slate-200 p-0.5 rounded-lg max-w-md">
                <button
                  type="button"
                  onClick={() => setIdioma('es')}
                  className={`flex-1 text-center py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    idioma === 'es' ? 'bg-white text-slate-950 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>🇪🇸</span> Español
                </button>
                <button
                  type="button"
                  onClick={() => setIdioma('en')}
                  className={`flex-1 text-center py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    idioma === 'en' ? 'bg-white text-slate-950 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>🇺🇸</span> Inglés
                </button>
                <button
                  type="button"
                  onClick={() => setIdioma('pt')}
                  className={`flex-1 text-center py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    idioma === 'pt' ? 'bg-white text-slate-950 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>🇧🇷</span> Portugués
                </button>
              </div>
            </div>

            {/* Longitud de respuesta */}
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-950 text-[14px]">Longitud de respuesta</h4>
              <p className="text-[12.5px] text-slate-500 leading-relaxed">
                Define qué tan extensas deben ser las respuestas del agente.
              </p>
              <div className="flex bg-slate-50 border border-slate-200 p-0.5 rounded-lg max-w-md">
                <button
                  type="button"
                  onClick={() => setLongitud('breve')}
                  className={`flex-1 text-center py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    longitud === 'breve' ? 'bg-white text-slate-950 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Breve
                </button>
                <button
                  type="button"
                  onClick={() => setLongitud('normal')}
                  className={`flex-1 text-center py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    longitud === 'normal' ? 'bg-white text-slate-950 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Normal
                </button>
                <button
                  type="button"
                  onClick={() => setLongitud('detallada')}
                  className={`flex-1 text-center py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    longitud === 'detallada' ? 'bg-white text-slate-950 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Detallada
                </button>
              </div>
            </div>

            {/* Nivel de iniciativa */}
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-950 text-[14px]">Nivel de iniciativa</h4>
              <p className="text-[12.5px] text-slate-500 leading-relaxed">
                Define qué tanto puede proponer siguientes pasos o avanzar la conversación por su cuenta.
              </p>
              <div className="flex bg-slate-50 border border-slate-200 p-0.5 rounded-lg max-w-md">
                <button
                  type="button"
                  onClick={() => setIniciativa('bajo')}
                  className={`flex-1 text-center py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    iniciativa === 'bajo' ? 'bg-white text-slate-950 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Bajo
                </button>
                <button
                  type="button"
                  onClick={() => setIniciativa('medio')}
                  className={`flex-1 text-center py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    iniciativa === 'medio' ? 'bg-white text-slate-950 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Medio
                </button>
                <button
                  type="button"
                  onClick={() => setIniciativa('alto')}
                  className={`flex-1 text-center py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    iniciativa === 'alto' ? 'bg-white text-slate-950 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Alto
                </button>
              </div>
            </div>

            {/* Voz y tono */}
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-950 text-[14px]">Voz y tono</h4>
              <p className="text-[12.5px] text-slate-500 leading-relaxed">
                Define el estilo de comunicación que usará el agente.
              </p>
              <div className="flex bg-slate-50 border border-slate-200 p-0.5 rounded-lg max-w-md">
                <button
                  type="button"
                  onClick={() => setVoz('formal')}
                  className={`flex-1 text-center py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    voz === 'formal' ? 'bg-white text-slate-950 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Formal
                </button>
                <button
                  type="button"
                  onClick={() => setVoz('neutral')}
                  className={`flex-1 text-center py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    voz === 'neutral' ? 'bg-white text-slate-950 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Neutral
                </button>
                <button
                  type="button"
                  onClick={() => setVoz('casual')}
                  className={`flex-1 text-center py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    voz === 'casual' ? 'bg-white text-slate-950 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Casual
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
