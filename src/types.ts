import type { ComponentType } from "./registry/componentRegistry";
export type { ComponentType };

export interface ChartConfig {
  type: "bar" | "line" | "pie" | "area";
  xAxisKey?: string;
  yAxisKey?: string;
}

export interface AlertConfig {
  status: "success" | "warning" | "info" | "error";
  actionLabel?: string;
}

export interface DataItem {
  label: string;
  value: number;
  secondaryValue?: string;
  color?: string;
}

export interface GenerativeUIResponse {
  componentType: ComponentType;
  explanation: string;
  title: string;
  data: DataItem[];
  chartConfig?: ChartConfig;
  alertConfig?: AlertConfig;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  timestamp: Date;
  text: string;
  generativeUI?: GenerativeUIResponse;
  isLoading?: boolean;
}

export interface OrgNode {
  id: string;
  title: string;
  role: string;
  description: string;
  phase: string;
}

export interface ArchNode {
  id: string;
  name: string;
  tech: string;
  description: string;
  flowStep: number;
}
