export interface GridOptions {
  /** 0 = Sunday, 1 = Monday, …, 6 = Saturday. */
  weekStartsOn?: number;
  fixedWeeks?: boolean;
  showOutsideDays?: boolean;
}
export interface WeekdayOptions {
  locale?: string;
  weekStartsOn?: number;
  width?: 'long' | 'short' | 'narrow';
}
export function daysInMonth(year: number, month: number): number;
export function addMonths(date: Date, amount: number): Date;
export function getWeekdayLabels(options?: WeekdayOptions): string[];
export function getMonthGrid(year: number, month: number, options?: GridOptions): (Date | null)[][];
export class Calendar {
  constructor(date?: Date);
  readonly date: Date;
  getYear(): number;
  getYearString(): string;
  getMonth(): number;
  getMonthString(locale?: string): string;
  getWeeks(options?: GridOptions): (Date | null)[][];
  next(amount?: number): Calendar;
  previous(amount?: number): Calendar;
}
