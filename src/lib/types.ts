export type RiskLevel = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IndicatorSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ScanType = 'URL' | 'MESSAGE' | 'EMAIL' | 'SCREENSHOT' | 'QR' | 'PHONE';

export interface Indicator {
  id: string;
  label: string;
  severity: IndicatorSeverity;
  detail: string;
  weight: number;
}

export interface RiskBreakdown {
  socialEngineering: number;
  urlRisk: number;
  credentialRisk: number;
  financialRisk: number;
}

export interface Recommendation {
  id: string;
  text: string;
}

export interface ThreatAnalysis {
  score: number;
  level: RiskLevel;
  indicators: Indicator[];
  breakdown: RiskBreakdown;
  explanation: string;
  recommendations: Recommendation[];
  detectedCategories: string[];
}

export interface ScanRecord {
  id: string;
  date: string;
  label: string;
  type: ScanType;
  score: number;
  level: RiskLevel;
  preview: string;
  categories?: string[];
}
