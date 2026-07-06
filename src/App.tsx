import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Send, 
  Terminal, 
  Layers3, 
  BookOpen, 
  Users, 
  Layout, 
  Compass, 
  ArrowRight,
  HelpCircle,
  Clock,
  Briefcase
} from "lucide-react";
import { ChatMessage, GenerativeUIResponse } from "./types";
import DynamicRenderer from "./components/DynamicRenderer";
import DocsTab from "./components/DocsTab";
import ArchTab from "./components/ArchTab";
import OrgTab from "./components/OrgTab";

export default function App() {
  const [activeTab, setActiveTab] = useState<"sandbox" | "docs" | "arch" | "org">("sandbox");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const presets = [
    { label: "📊 Gastos de este mes", prompt: "Muéstrame un gráfico circular con mis gastos de este mes: Alquiler 1200, Comida 450, Transporte 150, Entretenimiento 200, Servicios 300." },
    { label: "📋 Tareas financieras", prompt: "Dame una lista de tareas pendientes para cerrar el mes financiero de la empresa." },
    { label: "⚠️ Alerta de presupuesto", prompt: "Tengo un sobregiro en la cuenta de marketing de 1500 USD, genérame una alerta crítica accionable." },
    { label: "📈 KPIs de ventas", prompt: "Dame los indicadores clave (KPIs) de rendimiento de ventas del segundo trimestre." },
    { label: "🗃️ Detalle de saldos", prompt: "Genera una tabla detallada de saldos bancarios de nuestras 4 cuentas corporativas principales." }
  ];

  // Reassuring loading messages loop during API generation
  const loadingPhrases = [
    "Descifrando tu intención...",
    "Orquestando con Gemini 3.5 Flash...",
    "Definiendo el mejor componente UI...",
    "Validando el esquema JSON estructurado...",
    "Inyectando clases atómicas de Tailwind...",
    "Dando los toques finales al widget..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      setLoadingMessage(loadingPhrases[0]);
      let index = 1;
      interval = setInterval(() => {
        setLoadingMessage(loadingPhrases[index % loadingPhrases.length]);
        index++;
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        sender: "ai",
        timestamp: new Date(),
        text: "¡Hola! Soy tu asistente de Generative UI. Puedo simular cómo funciona una interfaz dinámica en tiempo real. Pídeme un desglose de tus gastos, una alerta sobre presupuesto, o haz clic en cualquiera de los ejemplos de abajo para ver la IA en acción creando el componente adecuado bajo demanda.",
      }
    ]);
  }, []);

  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim() || isGenerating) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      timestamp: new Date(),
      text: promptText,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generative-ui", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: promptText }),
      });

      if (!response.ok) {
        throw new Error("No se pudo conectar al servidor de Generative UI.");
      }

      const data: GenerativeUIResponse = await response.json();

      const aiMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: "ai",
        timestamp: new Date(),
        text: `Entendido. He analizado tu solicitud y he determinado que la mejor representación visual para tus datos es un **${getComponentLabel(data.componentType)}**. Aquí tienes el componente renderizado de forma dinámica:`,
        generativeUI: data
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error: any) {
      const errorMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: "ai",
        timestamp: new Date(),
        text: `Lo siento, ocurrió un error al intentar estructurar el componente: ${error.message}. Por favor intenta de nuevo.`
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const getComponentLabel = (type: string) => {
    switch (type) {
      case "chart": return "Gráfico SVG Interactivo";
      case "table": return "Tabla Detallada";
      case "metrics": return "Tablero de Métricas (KPIs)";
      case "alert": return "Banner de Alerta Accionable";
      case "list": return "Lista de Verificación";
      default: return "Componente Personalizado";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900 pb-12">
      {/* Dynamic ambient header background */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-xl shadow-md shadow-indigo-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </span>
              <div>
                <h1 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5 uppercase font-mono">
                  Generative UI Architect <span className="bg-indigo-100 text-indigo-700 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">Lab</span>
                </h1>
                <p className="text-[10px] text-slate-400 font-medium block">Diseño & Laboratorio de Interfaces Dinámicas de IA</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-mono font-bold flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> UTC: 2026-07-06
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-6 overflow-x-auto gap-1 py-1 no-scrollbar">
          <button
            onClick={() => setActiveTab("sandbox")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap ${
              activeTab === "sandbox"
                ? "bg-white text-indigo-700 shadow-sm border border-slate-100"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
            }`}
          >
            <Layout className="w-4 h-4" />
            Laboratorio Interactivo (Demo)
          </button>
          
          <button
            onClick={() => setActiveTab("docs")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap ${
              activeTab === "docs"
                ? "bg-white text-indigo-700 shadow-sm border border-slate-100"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            ¿Qué es Generative UI?
          </button>

          <button
            onClick={() => setActiveTab("arch")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap ${
              activeTab === "arch"
                ? "bg-white text-indigo-700 shadow-sm border border-slate-100"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
            }`}
          >
            <Terminal className="w-4 h-4" />
            Arquitectura de Software
          </button>

          <button
            onClick={() => setActiveTab("org")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap ${
              activeTab === "org"
                ? "bg-white text-indigo-700 shadow-sm border border-slate-100"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
            }`}
          >
            <Users className="w-4 h-4" />
            Organigrama & Comercialización
          </button>
        </div>

        {/* Tab Contents */}
        <AnimatePresence mode="wait">
          {activeTab === "sandbox" && (
            <motion.div
              key="sandbox"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Left Column: Chat and Presets */}
              <div className="lg:col-span-5 flex flex-col h-[calc(100vh-14rem)] min-h-[500px]">
                {/* Scrollable messages area */}
                <div className="flex-1 bg-white border border-slate-100 rounded-2xl p-4 overflow-y-auto space-y-4 shadow-sm">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 font-mono">
                        <span>{msg.sender === "user" ? "Tú" : "Asistente IA"}</span>
                        <span>•</span>
                        <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  ))}

                  {/* Generation loading screen with transition phrases */}
                  {isGenerating && (
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 font-mono">
                        <span>Generador UI</span>
                        <span>•</span>
                        <span className="animate-pulse">Calculando...</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 max-w-[85%] w-full flex items-center gap-3">
                        <div className="relative w-5 h-5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-5 w-5 bg-indigo-500"></span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-extrabold text-slate-800">Pensando el mejor diseño...</p>
                          <p className="text-[10px] text-slate-400 font-medium">{loadingMessage}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Preset Suggestions */}
                <div className="my-4">
                  <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2">Presiona un ejemplo para probar:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {presets.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendPrompt(preset.prompt)}
                        disabled={isGenerating}
                        className="text-[10px] font-bold bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 border border-slate-100 rounded-lg px-2.5 py-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Area */}
                <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex items-center gap-2">
                  <input
                    type="text"
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendPrompt(inputPrompt)}
                    placeholder="Escribe tu consulta financiera (ej: 'muéstrame mis ventas semanales'...)"
                    disabled={isGenerating}
                    className="flex-1 bg-slate-50 border-0 focus:ring-0 rounded-xl px-4 py-2.5 text-xs text-slate-700 placeholder-slate-400 outline-none"
                  />
                  <button
                    onClick={() => handleSendPrompt(inputPrompt)}
                    disabled={!inputPrompt.trim() || isGenerating}
                    className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: Live Dynamic Canvas Render */}
              <div className="lg:col-span-7 flex flex-col">
                <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex-1 flex flex-col min-h-[450px]">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                      <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider font-mono">
                        Visualizador de Interfaz Generativa (Viewport)
                      </h2>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">
                      Pantalla Virtual
                    </span>
                  </div>

                  {/* Viewport Content */}
                  <div className="flex-1 flex flex-col justify-center">
                    {messages.length > 0 && messages[messages.length - 1]?.sender === "ai" && messages[messages.length - 1]?.generativeUI ? (
                      <DynamicRenderer payload={messages[messages.length - 1].generativeUI!} />
                    ) : (
                      <div className="text-center py-12 px-6 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                          <Compass className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-sm font-extrabold text-slate-800">No hay interfaz renderizada todavía</h3>
                        <p className="text-xs text-slate-500 mt-2 max-w-sm leading-relaxed">
                          Ingresa una consulta en el chat de la izquierda o haz clic en alguno de los presets. La IA evaluará tu solicitud y generará la representación visual en este recuadro en tiempo real.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "docs" && <DocsTab />}
          {activeTab === "arch" && <ArchTab />}
          {activeTab === "org" && <OrgTab />}
        </AnimatePresence>
      </main>
    </div>
  );
}
