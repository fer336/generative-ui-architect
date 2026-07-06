import React from "react";
import { motion } from "motion/react";
import { BookOpen, HelpCircle, Terminal, Layers3, Flame, Cpu, ShieldCheck } from "lucide-react";

export default function DocsTab() {
  const pillars = [
    {
      icon: <Cpu className="w-5 h-5 text-indigo-500" />,
      title: "Interacción Basada en Intención",
      desc: "El usuario no navega por menús complejos; describe lo que necesita en lenguaje natural. El sistema descifra la intención subyacente de forma inmediata."
    },
    {
      icon: <Layers3 className="w-5 h-5 text-emerald-500" />,
      title: "Esquemas de JSON Estructurados",
      desc: "El LLM no genera HTML crudo (lo que sería lento e inseguro). En su lugar, responde con un JSON que sigue un esquema estricto (JSON Schema / Zod), validado en tiempo real."
    },
    {
      icon: <Flame className="w-5 h-5 text-orange-500" />,
      title: "Renderizado Atómico Dinámico",
      desc: "El frontend lee la estructura JSON recibida y decide qué componente del sistema de diseño (Design System) instanciar (por ejemplo, Gráficos, Tablas, Listas)."
    }
  ];

  const technologies = [
    { category: "Frontend Core", stack: "React 19, TypeScript, Vite", reason: "Manejo eficiente del estado reactivo, tipado estricto y compilaciones ultrarrápidas." },
    { category: "Motor de Estilos", stack: "Tailwind CSS (V4)", reason: "Permite dar estilos dinámicos e instantáneos mediante clases atómicas utilitarias." },
    { category: "Orquestación de IA", stack: "@google/genai SDK (Gemini 3.5 Flash)", reason: "Modelos optimizados con baja latencia y soporte nativo para 'responseSchema' robusto." },
    { category: "Backend & API", stack: "Node.js, Express, Zod", reason: "Validación estricta de esquemas antes de enviar los datos al cliente frontend." },
    { category: "Persistencia (Opcional)", stack: "Firebase Firestore / Cloud SQL", reason: "Almacenamiento rápido de sesiones de chat, historiales de consultas y configuraciones." },
    { category: "Despliegue & Escalado", stack: "Docker, Cloud Run, Vercel", reason: "Contenedores serverless de bajo coste que escalan a cero cuando no hay tráfico." }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Introduction Hero Section */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-indigo-50/50 to-sky-50/50 rounded-3xl border border-indigo-100/50">
        <div className="flex items-center gap-3 mb-4">
          <span className="p-2.5 bg-indigo-100 text-indigo-700 rounded-2xl">
            <BookOpen className="w-6 h-6" />
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800">
            ¿Qué es "Generative UI" o Interacción Generativa?
          </h2>
        </div>
        
        <p className="text-sm text-slate-600 leading-relaxed font-sans max-w-4xl">
          El concepto que describes se conoce formalmente en la industria como <strong>Generative UI (Interfaz de Usuario Generativa)</strong> o <strong>Server-Driven UI impulsado por Inteligencia Artificial</strong>. 
          Tradicionalmente, las aplicaciones web cuentan con interfaces fijas y estáticas: un programador diseña un formulario, una tabla o un gráfico, y estos permanecen idénticos para todos los usuarios.
        </p>
        
        <p className="text-sm text-slate-600 leading-relaxed font-sans mt-4 max-w-4xl">
          En un sistema de <strong>Generative UI</strong>, el paradigma se invierte por completo. La interfaz no está predefinida; se <strong>sintetiza y autogenera en tiempo real</strong> basándose en la información que el usuario solicita o el contexto actual. El LLM actúa como el "director de orquesta", decidiendo dinámicamente si los datos recopilados se visualizan mejor como un gráfico de barras, un listado interactivo, una tabla financiera o una tarjeta de métrica crítica.
        </p>
      </div>

      {/* Conceptual Pillars */}
      <div>
        <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-wider mb-5 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-slate-500" /> Los Tres Pilares Conceptuales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <div key={i} className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col gap-3">
              <span className="p-2 w-fit bg-slate-50 rounded-xl">{p.icon}</span>
              <h4 className="text-sm font-bold text-slate-800">{p.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Business Advantages */}
      <div className="p-6 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-xl">
        <h3 className="text-sm font-extrabold text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Ventajas Estratégicas y de Negocio
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-300">
          <div>
            <span className="font-bold text-white block mb-1">1. Reducción de la Fatiga de Información</span>
            El usuario solo recibe el componente visual que responde exactamente a su duda. No tiene que buscar en tableros saturados de widgets inútiles.
          </div>
          <div>
            <span className="font-bold text-white block mb-1">2. Experiencia Hiper-Personalizada</span>
            El diseño se adapta al perfil del usuario. Un ejecutivo puede recibir KPI macro, mientras que un analista técnico recibe gráficos de líneas detallados.
          </div>
          <div>
            <span className="font-bold text-white block mb-1">3. Desarrollo Veloz de Funcionalidades</span>
            En lugar de crear 50 dashboards distintos, el equipo de frontend crea 10 componentes atómicos modulares de UI. La IA se encarga de combinarlos y poblarlos.
          </div>
          <div>
            <span className="font-bold text-white block mb-1">4. Alta Conversión y Retención</span>
            Las interfaces conversacionales reducen la fricción. Acciones complejas (como hacer transferencias o ajustar presupuestos) se resuelven en un solo clic dentro del chat.
          </div>
        </div>
      </div>

      {/* Tech Stack Blueprint */}
      <div>
        <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-wider mb-5 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-500" /> Ficha Técnica: Stack de Tecnologías Recomendado
        </h3>
        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-mono tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-4">Capa</th>
                <th className="px-5 py-4">Tecnologías Clave</th>
                <th className="px-5 py-4">Por qué es Indispensable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {technologies.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-900">{t.category}</td>
                  <td className="px-5 py-4 font-mono font-medium text-indigo-600">{t.stack}</td>
                  <td className="px-5 py-4">{t.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
