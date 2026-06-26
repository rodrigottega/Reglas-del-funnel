export type StageId = string;

export interface Rule {
  id: string;
  name: string;
  propertyId: string;
  operator: string;
  value?: any; // can be string, number, array of strings, or { min: any, max: any }
}

export interface FunnelStage {
  id: StageId;
  name: string;
  description: string;
  systemRole: 'none' | 'entry';
  movementMode: 'automatic' | 'manual';
  agentsAllowed: string[];
  ruleMatchMode: 'all' | 'any';
  rules: Rule[];
}

export interface AgentType {
  id: string;
  name: string;
  description: string;
  disabled?: boolean;
  badge?: string;
}

export interface Property {
  id: string;
  label: string;
  type: 'text' | 'number' | 'currency' | 'date' | 'boolean' | 'single_select' | 'multi_select';
  group: string;
  options?: string[];
}

export interface Operator {
  id: string;
  label: string;
}
