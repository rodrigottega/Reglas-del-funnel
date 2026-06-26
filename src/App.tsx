import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import BasicConfig from './components/BasicConfig';
import FunnelManagement from './components/FunnelManagement';
import AgentsTeam from './components/AgentsTeam';
import TransferRules from './components/TransferRules';

type TabId = 'config_basica' | 'manejo_funnel' | 'equipo_agentes' | 'reglas_transferencia';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('manejo_funnel');
  const [activeMenu, setActiveMenu] = useState('agente_ia');
  
  // Notification states
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Interactive Test Agent Drawer
  const [isTestDrawerOpen, setIsTestDrawerOpen] = useState(false);
  const [testMessages, setTestMessages] = useState<Array<{ sender: 'user' | 'agent' | 'system', text: string, timestamp: string }>>([
    {
      sender: 'agent',
      text: '¡Hola! Soy el Agente Calificador de Ciarem. ¿En qué puedo ayudarte hoy?',
      timestamp: '14:04',
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [detectedLeadData, setDetectedLeadData] = useState({
    presupuesto: 'No detectado',
    necesidad: 'No detectado',
    intencion: 'Media',
  });

  const triggerNotification = (msg: string) => {
    setNotificationMessage(msg);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 4000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setTestMessages(prev => [...prev, { sender: 'user', text: userMsg, timestamp: timeStr }]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate Agent processing based on message text
    setTimeout(() => {
      setIsTyping(false);
      let agentReply = '';
      let updatedData = { ...detectedLeadData };
      let systemNote = '';

      const textLower = userMsg.toLowerCase();

      if (textLower.includes('presupuesto') || textLower.includes('dinero') || textLower.includes('precio') || textLower.includes('dólares') || textLower.includes('usd') || textLower.includes('costo') || textLower.includes('$')) {
        updatedData.presupuesto = 'Confirmado ($1,500 - $3,000)';
        agentReply = 'Entiendo perfectamente tu presupuesto. Contamos con planes flexibles que se adaptan a ese rango de inversión.';
      } else if (textLower.includes('necesito') || textLower.includes('problema') || textLower.includes('buscar') || textLower.includes('quería') || textLower.includes('automatizar') || textLower.includes('whatsapp')) {
        updatedData.necesidad = 'Automatizar WhatsApp & IG';
        agentReply = 'Excelente. Ciarem está diseñado específicamente para ayudarte a automatizar WhatsApp e Instagram y calificar tus leads automáticamente.';
      } else if (textLower.includes('comprar') || textLower.includes('empezar') || textLower.includes('listo') || textLower.includes('ahora') || textLower.includes('contratar')) {
        updatedData.intencion = 'Alta';
        agentReply = '¡Me encanta tu iniciativa! Si estás listo para empezar, podemos habilitar tu cuenta en menos de 5 minutos.';
      } else {
        agentReply = 'Entendido. Tomo nota de los detalles para orientar mejor nuestra propuesta comercial.';
      }

      setDetectedLeadData(updatedData);
      setTestMessages(prev => [...prev, { sender: 'agent', text: agentReply, timestamp: timeStr }]);

      // Check if Calificado Stage rules are met (Presupuesto + Necesidad + Intención)
      if (updatedData.presupuesto !== 'No detectado' && updatedData.necesidad !== 'No detectado' && updatedData.intencion === 'Alta') {
        setTimeout(() => {
          setTestMessages(prev => [
            ...prev,
            { 
              sender: 'system', 
              text: '🔔 SISTEMA: El contacto cumple con las 3 reglas de la etapa "Calificado". El contacto ha sido promovido automáticamente.', 
              timestamp: timeStr 
            }
          ]);
        }, 1200);
      }
    }, 1500);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-slate-900 font-sans">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeMenu={activeMenu} 
        onSelectMenu={(menu) => {
          setActiveMenu(menu);
          if (menu === 'agente_ia') {
            setActiveTab('manejo_funnel');
          }
        }} 
      />

      {/* Main Panel Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white relative">
        
        {/* Header Superior */}
        <header className="h-[56px] border-b border-slate-150 flex items-center justify-between px-6 shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <span className="text-[12.5px] text-slate-400 font-medium flex items-center gap-1">
              <span>Configuración de IA</span>
              <i className="ri-arrow-right-s-line text-xs"></i>
            </span>
            <span className="font-semibold text-slate-800 text-[13.5px]">Agente IA</span>
          </div>

          <button 
            onClick={() => setIsTestDrawerOpen(true)}
            className="border border-slate-200 text-slate-800 hover:bg-slate-50 font-semibold text-xs px-3.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs flex items-center gap-1.5 h-8.5"
          >
            <i className="ri-play-line text-slate-600 text-[14px]"></i>
            Probar agente
          </button>
        </header>

        {/* Tab Navigation Menu under Header */}
        <div className="px-6 shrink-0 bg-white">
          <div className="flex items-center gap-1 border-b border-slate-100 overflow-x-auto scrollbar-none">
            
            {/* Tab: Configuración básica */}
            <button
              onClick={() => setActiveTab('config_basica')}
              className={`flex items-center gap-2 px-3 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer shrink-0 ${
                activeTab === 'config_basica'
                  ? 'border-slate-950 text-slate-950 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200'
              }`}
            >
              <i className="ri-settings-3-line text-[14px]"></i>
              Configuración básica
            </button>

            {/* Tab: Manejo del funnel (NEW ACTIVE TAB) */}
            <button
              onClick={() => setActiveTab('manejo_funnel')}
              className={`flex items-center gap-2 px-3 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer shrink-0 ${
                activeTab === 'manejo_funnel'
                  ? 'border-slate-950 text-slate-950 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200'
              }`}
            >
              <i className="ri-funnel-line text-[14px]"></i>
              Manejo del funnel
            </button>

            {/* Tab: Equipo de agentes IA */}
            <button
              onClick={() => setActiveTab('equipo_agentes')}
              className={`flex items-center gap-2 px-3 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer shrink-0 ${
                activeTab === 'equipo_agentes'
                  ? 'border-slate-950 text-slate-950 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200'
              }`}
            >
              <i className="ri-group-line text-[14px]"></i>
              Equipo de agentes IA
            </button>

            {/* Tab: Reglas de transferencia */}
            <button
              onClick={() => setActiveTab('reglas_transferencia')}
              className={`flex items-center gap-2 px-3 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer shrink-0 ${
                activeTab === 'reglas_transferencia'
                  ? 'border-slate-950 text-slate-950 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200'
              }`}
            >
              <i className="ri-shuffle-line text-[14px]"></i>
              Reglas de transferencia
            </button>

          </div>
        </div>

        {/* Dynamic Inner Tab Content Container */}
        <div className="px-6 py-5 flex-1 flex flex-col min-h-0 overflow-hidden bg-white">
          {activeTab === 'config_basica' && (
            <BasicConfig onSave={() => triggerNotification('¡Configuración básica guardada correctamente!')} />
          )}
          {activeTab === 'manejo_funnel' && (
            <FunnelManagement onSave={() => triggerNotification('¡Reglas y configuración del funnel guardadas con éxito!')} />
          )}
          {activeTab === 'equipo_agentes' && (
            <AgentsTeam />
          )}
          {activeTab === 'reglas_transferencia' && (
            <TransferRules />
          )}
        </div>

      </main>

      {/* Floating toast notification */}
      {showNotification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white rounded-xl py-3 px-4 shadow-xl border border-slate-800 flex items-center gap-2.5 max-w-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <i className="ri-checkbox-circle-fill text-emerald-400 text-lg"></i>
          <span className="text-xs font-semibold">{notificationMessage}</span>
        </div>
      )}

      {/* Interactive Chat Tester Sidebar Panel */}
      {isTestDrawerOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 flex justify-end">
          {/* Backdrop Click Dismiss */}
          <div className="absolute inset-0" onClick={() => setIsTestDrawerOpen(false)}></div>

          {/* Chat Container Panel */}
          <div className="w-full max-w-md bg-white h-full relative z-10 flex flex-col shadow-2xl border-l border-slate-100 animate-in slide-in-from-right duration-350">
            
            {/* Tester Header */}
            <div className="h-[56px] border-b border-slate-100 flex items-center justify-between px-4 shrink-0 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="font-bold text-slate-900 text-sm">Simulador de Agente IA</span>
              </div>
              <button 
                onClick={() => setIsTestDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>

            {/* Simulated Lead Variable tracker (Shows funnels rules reacting in real-time!) */}
            <div className="bg-slate-950 text-white p-3.5 space-y-2 shrink-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <i className="ri-git-branch-line"></i>
                Variables extraídas en tiempo real
              </p>
              <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                <div className="bg-white/10 p-2 rounded-lg">
                  <span className="block text-[9px] text-slate-400 font-medium">Presupuesto</span>
                  <span className={`font-bold block mt-0.5 truncate ${detectedLeadData.presupuesto !== 'No detectado' ? 'text-emerald-400' : 'text-white'}`}>
                    {detectedLeadData.presupuesto}
                  </span>
                </div>
                <div className="bg-white/10 p-2 rounded-lg">
                  <span className="block text-[9px] text-slate-400 font-medium">Necesidad</span>
                  <span className={`font-bold block mt-0.5 truncate ${detectedLeadData.necesidad !== 'No detectado' ? 'text-emerald-400' : 'text-white'}`}>
                    {detectedLeadData.necesidad}
                  </span>
                </div>
                <div className="bg-white/10 p-2 rounded-lg">
                  <span className="block text-[9px] text-slate-400 font-medium">Intención</span>
                  <span className={`font-bold block mt-0.5 truncate ${detectedLeadData.intencion === 'Alta' ? 'text-emerald-400' : 'text-white'}`}>
                    {detectedLeadData.intencion}
                  </span>
                </div>
              </div>
              <p className="text-[9.5px] text-slate-400 italic">
                Sugerencia: Envía un mensaje como "Tengo un presupuesto de $1500 y necesito automatizar mi WhatsApp comercial"
              </p>
            </div>

            {/* Chat message body list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
              {testMessages.map((msg, index) => {
                if (msg.sender === 'system') {
                  return (
                    <div key={index} className="bg-amber-50 border border-amber-200 text-amber-900 text-[10.5px] p-2.5 rounded-lg font-semibold flex items-start gap-1.5">
                      <i className="ri-notification-badge-line mt-0.5 text-amber-500 shrink-0"></i>
                      <span>{msg.text}</span>
                    </div>
                  );
                }

                const isUser = msg.sender === 'user';
                return (
                  <div key={index} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-normal ${
                      isUser 
                        ? 'bg-slate-900 text-white rounded-tr-none' 
                        : 'bg-white border border-slate-200 text-slate-850 rounded-tl-none shadow-xs'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 px-1 font-medium">{msg.timestamp}</span>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex flex-col items-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3 shadow-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat bottom input controller */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white shrink-0 flex gap-2">
              <input 
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Escribe un mensaje de prueba..."
                className="flex-1 text-xs border border-slate-200 rounded-lg px-3 focus:outline-none focus:ring-1 focus:ring-slate-900 h-9"
              />
              <button 
                type="submit"
                className="bg-slate-950 hover:bg-slate-800 text-white p-2 rounded-lg shrink-0 w-9 h-9 flex items-center justify-center cursor-pointer transition-colors"
              >
                <i className="ri-send-plane-2-line"></i>
              </button>
            </form>

            {/* Quick reset variables button */}
            <div className="p-2 bg-slate-50 border-t border-slate-100 text-center">
              <button 
                type="button"
                onClick={() => {
                  setDetectedLeadData({ presupuesto: 'No detectado', necesidad: 'No detectado', intencion: 'Media' });
                  setTestMessages([{
                    sender: 'agent',
                    text: '¡Hola! Simulador reiniciado. ¿En qué puedo ayudarte hoy?',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }]);
                }}
                className="text-slate-500 hover:text-slate-900 text-[11px] font-semibold flex items-center justify-center gap-1 mx-auto cursor-pointer"
              >
                <i className="ri-refresh-line"></i>
                Reiniciar simulación
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
