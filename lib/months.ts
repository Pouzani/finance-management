export const MONTH_LABELS: Record<string, string> = {
  "01": "Janvier", "02": "Février", "03": "Mars", "04": "Avril",
  "05": "Mai", "06": "Juin", "07": "Juillet", "08": "Août",
  "09": "Septembre", "10": "Octobre", "11": "Novembre", "12": "Décembre",
};

export const SHORT_MONTH: Record<string, string> = {
  "01": "Jan", "02": "Fév", "03": "Mar", "04": "Avr",
  "05": "Mai", "06": "Jun", "07": "Jul", "08": "Aoû",
  "09": "Sep", "10": "Oct", "11": "Nov", "12": "Déc",
};

export type Period = "3M" | "6M" | "1A";

export function shortMonth(yyyyMM: string): string {
  return SHORT_MONTH[yyyyMM.slice(5, 7)] ?? yyyyMM;
}

export function longMonth(yyyyMM: string): string {
  return MONTH_LABELS[yyyyMM.slice(5, 7)] ?? yyyyMM;
}

export function yearOf(yyyyMM: string): string {
  return yyyyMM.slice(0, 4);
}
