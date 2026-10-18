import type { GridOptions } from './index.js';
export interface CalendarOptions extends GridOptions {
  date?: Date;
  locale?: string;
  onSelect?: (date: Date) => void;
}
export interface CalendarWidget {
  getDate(): Date;
  setDate(date: Date): void;
  destroy(): void;
}
export function createCalendar(element: HTMLElement, options?: CalendarOptions): CalendarWidget;
