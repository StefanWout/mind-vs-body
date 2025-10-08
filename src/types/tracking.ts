export type PeriodStatus = 'heavy' | 'light' | 'patchy' | 'cramps' | 'none';

export interface DailyEntry {
  id: string;
  date: string; // ISO date string
  periodStatus: PeriodStatus | null;
  nausea: boolean | null;
  nauseaTime: string | null; // HH:mm format
  moodMorning: number | null; // 1-5
  moodMidday: number | null; // 1-5
  moodEvening: number | null; // 1-5
  createdAt: string;
  updatedAt: string;
}

export interface TrendData {
  date: string;
  value: number;
  label?: string;
}

export interface CorrelationData {
  factor1: string;
  factor2: string;
  correlation: number;
  description: string;
}
