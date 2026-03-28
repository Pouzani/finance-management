export const MONTH_LABELS: Record<string, string> = {
  '01': 'January', '02': 'February', '03': 'March', '04': 'April',
  '05': 'May', '06': 'June', '07': 'July', '08': 'August',
  '09': 'September', '10': 'October', '11': 'November', '12': 'December',
};

export const SHORT_MONTH: Record<string, string> = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
  '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
  '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec',
};

export type Period = '3M' | '6M' | '1Y';

export function shortMonth(yyyyMM: string): string {
  return SHORT_MONTH[yyyyMM.slice(5, 7)] ?? yyyyMM;
}

export function longMonth(yyyyMM: string): string {
  return MONTH_LABELS[yyyyMM.slice(5, 7)] ?? yyyyMM;
}

export function yearOf(yyyyMM: string): string {
  return yyyyMM.slice(0, 4);
}
