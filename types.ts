export enum SeverityLevel {
  HIGH = 'HIGH',
  MODERATE = 'MODERATE',
  LOW = 'LOW',
  UNKNOWN = 'UNKNOWN'
}

export interface Interaction {
  drug1: string;
  drug2: string;
  severity: SeverityLevel;
  description: string;
  mechanism: string;
  management: string;
}

export interface AnalysisResult {
  interactions: Interaction[];
  summary: string;
  disclaimer: string;
}

export interface Drug {
  id: string;
  name: string;
}