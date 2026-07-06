import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  BarChart3, 
  TrendingUp, 
  Table as TableIcon, 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ListTodo, 
  Sparkles,
  ArrowRight,
  TrendingDown,
  Layers
} from "lucide-react";
import { GenerativeUIResponse, DataItem } from "../types";

interface DynamicRendererProps {
  payload: GenerativeUIResponse;
}

export default function DynamicRenderer({ payload }: DynamicRendererProps) {
  const { componentType, title, data, explanation, chartConfig, alertConfig } = payload;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Helper to resolve tailwind text and bg colors from color string
  const getColorClasses = (color?: string) => {
    switch (color) {
      case "emerald":
        return { bg: "bg-emerald-500", text: "text-emerald-500", fill: "#10b981", stroke: "#059669", bgLight: "bg-emerald-50", textDark: "text-emerald-900" };
      case "rose":
        return { bg: "bg-rose-500", text: "text-rose-500", fill: "#f43f5e", stroke: "#e11d48", bgLight: "bg-rose-50", textDark: "text-rose-900" };
      case "amber":
        return { bg: "bg-amber-500", text: "text-amber-500", fill: "#f59e0b", stroke: "#d97706", bgLight: "bg-amber-50", textDark: "text-amber-900" };
      case "sky":
        return { bg: "bg-sky-500", text: "text-sky-500", fill: "#0ea5e9", stroke: "#0284c7", bgLight: "bg-sky-50", textDark: "text-sky-900" };
      case "indigo":
        return { bg: "bg-indigo-500", text: "text-indigo-500", fill: "#6366f1", stroke: "#4f46e5", bgLight: "bg-indigo-50", textDark: "text-indigo-900" };
      case "violet":
        return { bg: "bg-violet-500", text: "text-violet-500", fill: "#8b5cf6", stroke: "#7c3aed", bgLight: "bg-violet-50", textDark: "text-violet-900" };
      case "orange":
        return { bg: "bg-orange-500", text: "text-orange-500", fill: "#f97316", stroke: "#ea580c", bgLight: "bg-orange-50", textDark: "text-orange-900" };
      default:
        return { bg: "bg-slate-500", text: "text-slate-500", fill: "#64748b", stroke: "#475569", bgLight: "bg-slate-50", textDark: "text-slate-900" };
    }
  };

  // 1. Render Charts (Bar, Line, Area, Pie)
  const renderChart = () => {
    const chartType = chartConfig?.type || "bar";
    const maxVal = Math.max(...data.map(d => d.value), 1);
    
    if (chartType === "bar") {
      return (
        <div className="w-full mt-4 h-56 flex items-end gap-3 px-2 pt-6 pb-2 border-b border-slate-100">
          {data.map((item, idx) => {
            const { bg, stroke, bgLight } = getColorClasses(item.color);
            const percentHeight = (item.value / maxVal) * 85; // cap at 85% for label padding
            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end relative group">
                {/* Value tooltip */}
                <div className="absolute -top-6 bg-slate-800 text-white text-[10px] py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow">
                  {item.secondaryValue || item.value}
                </div>
                
                {/* Dynamic animated bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${percentHeight}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                  className={`w-full max-w-[40px] rounded-t-md ${bg} opacity-90 hover:opacity-100 cursor-pointer shadow-sm relative transition-all`}
                  style={{ backgroundColor: getColorClasses(item.color).fill }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                
                {/* Label */}
                <span className="text-[10px] text-slate-500 font-medium truncate w-full text-center mt-2 pt-1 font-mono">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      );
    }

    if (chartType === "line" || chartType === "area") {
      const width = 450;
      const height = 180;
      const paddingLeft = 40;
      const paddingRight = 20;
      const paddingTop = 20;
      const paddingBottom = 30;

      const chartWidth = width - paddingLeft - paddingRight;
      const chartHeight = height - paddingTop - paddingBottom;

      const points = data.map((item, idx) => {
        const x = paddingLeft + (idx / (data.length - 1)) * chartWidth;
        const y = height - paddingBottom - (item.value / maxVal) * chartHeight;
        return { x, y, item, idx };
      });

      const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
      const areaPath = points.length > 0 
        ? `${linePath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z` 
        : "";

      const primaryColor = getColorClasses(data[0]?.color).fill;

      return (
        <div className="w-full mt-4 flex justify-center">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-lg h-auto overflow-visible">
            {/* Grids */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = paddingTop + ratio * chartHeight;
              const gridVal = Math.round(maxVal * (1 - ratio));
              return (
                <g key={i} className="opacity-40">
                  <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
                  <text x={10} y={y + 4} className="text-[10px] font-mono fill-slate-400 font-semibold">{gridVal}</text>
                </g>
              );
            })}

            {/* Area gradient fill */}
            {chartType === "area" && points.length > 0 && (
              <g>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={primaryColor} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={primaryColor} stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <motion.path
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  d={areaPath}
                  fill="url(#areaGrad)"
                />
              </g>
            )}

            {/* Line path */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              d={linePath}
              fill="none"
              stroke={primaryColor}
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Data points */}
            {points.map((p, i) => (
              <g key={i} className="group cursor-pointer">
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoveredIndex === i ? 6 : 4}
                  className="transition-all"
                  fill="#ffffff"
                  stroke={getColorClasses(p.item.color).fill}
                  strokeWidth="3"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                
                {/* Dynamic mini-tooltip in SVG */}
                {hoveredIndex === i && (
                  <g>
                    <rect
                      x={p.x - 45}
                      y={p.y - 32}
                      width="90"
                      height="22"
                      rx="4"
                      fill="#1e293b"
                      opacity="0.95"
                    />
                    <text
                      x={p.x}
                      y={p.y - 18}
                      className="text-[9px] fill-white text-center font-semibold font-mono"
                      textAnchor="middle"
                    >
                      {p.item.secondaryValue || p.item.value}
                    </text>
                  </g>
                )}

                {/* X labels */}
                <text
                  x={p.x}
                  y={height - 8}
                  textAnchor="middle"
                  className="text-[10px] font-mono fill-slate-500 font-semibold truncate"
                >
                  {p.item.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      );
    }

    if (chartType === "pie") {
      let total = data.reduce((acc, curr) => acc + curr.value, 0);
      if (total === 0) total = 1;
      
      let accumulatedPercent = 0;
      const radius = 60;
      const cx = 110;
      const cy = 110;

      return (
        <div className="w-full mt-4 flex flex-col md:flex-row items-center justify-around gap-6 py-2">
          {/* Pie SVG */}
          <div className="relative w-44 h-44">
            <svg viewBox="0 0 220 220" className="w-full h-full transform -rotate-90">
              {data.map((item, idx) => {
                const percent = item.value / total;
                const strokeDasharray = `${2 * Math.PI * radius}`;
                const strokeDashoffset = `${strokeDasharray} - ${strokeDasharray} * ${percent}`;
                const rotation = (accumulatedPercent * 360);
                accumulatedPercent += percent;

                const isHovered = hoveredIndex === idx;

                return (
                  <circle
                    key={idx}
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill="transparent"
                    stroke={getColorClasses(item.color).fill}
                    strokeWidth={isHovered ? 26 : 22}
                    strokeDasharray={strokeDasharray}
                    style={{
                      strokeDashoffset: eval(strokeDashoffset),
                      transformOrigin: "110px 110px",
                      transform: `rotate(${rotation}deg)`,
                      transition: "stroke-width 0.2s ease, filter 0.2s ease",
                      filter: isHovered ? "drop-shadow(0 4px 6px rgba(0,0,0,0.15))" : "none"
                    }}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="cursor-pointer"
                  />
                );
              })}
              {/* Inner hole for donut */}
              <circle cx={cx} cy={cy} r="35" fill="#ffffff" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Total</span>
              <span className="text-lg font-bold text-slate-800 font-mono">
                {total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Pie Legend */}
          <div className="flex flex-col gap-2 flex-1 max-w-xs">
            {data.map((item, idx) => {
              const { bg } = getColorClasses(item.color);
              const percentage = Math.round((item.value / total) * 100);
              return (
                <div 
                  key={idx}
                  className={`flex items-center justify-between p-1.5 rounded-lg transition-colors cursor-pointer ${hoveredIndex === idx ? 'bg-slate-50' : ''}`}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${bg}`} />
                    <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {item.secondaryValue || item.value} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };

  // 2. Render Tables
  const renderTable = () => {
    return (
      <div className="w-full mt-4 overflow-x-auto rounded-xl border border-slate-100 shadow-sm bg-white">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase font-mono tracking-wider font-semibold border-b border-slate-100">
            <tr>
              <th className="px-4 py-3">Concepto / Categoría</th>
              <th className="px-4 py-3 text-right">Valor</th>
              <th className="px-4 py-3 text-right">Detalle / Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-slate-700">
            {data.map((item, idx) => {
              const { bgLight, textDark } = getColorClasses(item.color);
              return (
                <motion.tr 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={idx} 
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {item.label}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-800">
                    {item.value.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${bgLight} ${textDark}`}>
                      {item.secondaryValue || "Activo"}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // 3. Render Metric Cards
  const renderMetrics = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 w-full">
        {data.map((item, idx) => {
          const { text, bgLight, fill } = getColorClasses(item.color);
          const isUp = item.value >= 0; // standard indicator

          return (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
              key={idx}
              className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{item.label}</span>
                <span className={`p-1.5 rounded-full ${bgLight} ${text}`}>
                  {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                </span>
              </div>
              
              <div className="mt-4">
                <div className="text-2xl font-bold font-mono text-slate-800 tracking-tight">
                  {item.secondaryValue || item.value.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-semibold">
                  <span className={text}>●</span> Indicador automatizado
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  // 4. Render Action Alerts
  const renderAlert = () => {
    const status = alertConfig?.status || "info";
    const actionLabel = alertConfig?.actionLabel || "Resolver Ahora";

    const getAlertStyle = () => {
      switch (status) {
        case "success":
          return {
            border: "border-emerald-200",
            bg: "bg-emerald-50/75",
            icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
            text: "text-emerald-900",
            sub: "text-emerald-700",
            btn: "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-200"
          };
        case "warning":
          return {
            border: "border-amber-200",
            bg: "bg-amber-50/75",
            icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
            text: "text-amber-900",
            sub: "text-amber-700",
            btn: "bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-200"
          };
        case "error":
          return {
            border: "border-rose-200",
            bg: "bg-rose-50/75",
            icon: <AlertCircle className="w-5 h-5 text-rose-600" />,
            text: "text-rose-900",
            sub: "text-rose-700",
            btn: "bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-200"
          };
        default:
          return {
            border: "border-sky-200",
            bg: "bg-sky-50/75",
            icon: <Info className="w-5 h-5 text-sky-600" />,
            text: "text-sky-900",
            sub: "text-sky-700",
            btn: "bg-sky-600 hover:bg-sky-700 text-white focus:ring-sky-200"
          };
      }
    };

    const style = getAlertStyle();

    return (
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`w-full p-5 rounded-2xl border ${style.border} ${style.bg} mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
      >
        <div className="flex gap-3">
          <div className="mt-0.5">{style.icon}</div>
          <div>
            <h4 className={`text-sm font-bold ${style.text}`}>{title}</h4>
            <p className={`text-xs mt-1 leading-relaxed ${style.sub}`}>{explanation}</p>
            
            {data.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {data.map((item, idx) => (
                  <span key={idx} className="bg-white/80 border border-slate-100 rounded px-2 py-0.5 text-[10px] font-mono font-bold text-slate-700">
                    {item.label}: {item.secondaryValue || item.value}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <button className={`shrink-0 text-xs font-bold py-2 px-4 rounded-xl shadow-sm transition-all focus:ring-4 focus:outline-none ${style.btn}`}>
          {actionLabel}
        </button>
      </motion.div>
    );
  };

  // 5. Render Checklist/Todo List
  const renderList = () => {
    return (
      <div className="w-full mt-4 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-50">
        {data.map((item, idx) => {
          const { bg, text, bgLight } = getColorClasses(item.color);
          return (
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              key={idx}
              className="p-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${bg}`} />
                <span className="text-xs font-semibold text-slate-800">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.secondaryValue && (
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${bgLight} ${text}`}>
                    {item.secondaryValue}
                  </span>
                )}
                <span className="text-xs font-mono font-bold text-slate-500">
                  {item.value}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const getComponentIcon = () => {
    switch (componentType) {
      case "chart":
        return <BarChart3 className="w-5 h-5 text-indigo-600" />;
      case "table":
        return <TableIcon className="w-5 h-5 text-emerald-600" />;
      case "metrics":
        return <Layers className="w-5 h-5 text-violet-600" />;
      case "alert":
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case "list":
        return <ListTodo className="w-5 h-5 text-sky-600" />;
    }
  };

  const getComponentTypeName = () => {
    switch (componentType) {
      case "chart":
        return "Gráfico Dinámico (SVG)";
      case "table":
        return "Tabla de Datos Detallada";
      case "metrics":
        return "Tarjetas de Métricas (KPIs)";
      case "alert":
        return "Alerta Crítica Accionable";
      case "list":
        return "Lista de Verificación / Tareas";
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.97, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="p-5 rounded-2xl bg-gradient-to-br from-white to-slate-50/50 border border-slate-100 shadow-sm"
    >
      {/* Component Header Metadata (No tech larping, just elegant and informative) */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          {getComponentIcon()}
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 leading-tight">
              {title}
            </h3>
            <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block mt-0.5">
              {getComponentTypeName()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-indigo-600 animate-pulse" />
          Generado por IA
        </div>
      </div>

      {/* Actual Rendered UI Content */}
      <div className="my-4">
        {componentType === "chart" && renderChart()}
        {componentType === "table" && renderTable()}
        {componentType === "metrics" && renderMetrics()}
        {componentType === "alert" && renderAlert()}
        {componentType === "list" && renderList()}
      </div>

      {/* Explanation Footer */}
      {componentType !== "alert" && (
        <div className="mt-4 pt-3.5 border-t border-slate-100/80">
          <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50/50 p-3 rounded-xl border border-slate-50 font-sans">
            <span className="font-extrabold text-slate-700 block mb-1">Análisis e Interpretación:</span>
            {explanation}
          </p>
        </div>
      )}
    </motion.div>
  );
}
