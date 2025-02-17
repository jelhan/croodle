declare module 'ember-power-calendar-luxon' {
  import type {
    NormalizeCalendarValue,
    NormalizeMultipleActionValue,
    NormalizeRangeActionValue,
    PowerCalendarDay,
  } from 'ember-power-calendar/utils';

  const _default: {
    add: typeof add;

    formatDate: typeof formatDate;

    startOf: typeof startOf;

    endOf: typeof endOf;

    weekday: typeof weekday;

    isoWeekday: typeof isoWeekday;

    getWeekdaysShort: typeof getWeekdaysShort;

    getWeekdaysMin: typeof getWeekdaysMin;

    getWeekdays: typeof getWeekdays;

    isAfter: typeof isAfter;

    isBefore: typeof isBefore;

    isSame: typeof isSame;

    isBetween: typeof isBetween;

    diff: typeof diff;

    normalizeDate: typeof normalizeDate;

    normalizeRangeActionValue: typeof normalizeRangeActionValue;

    normalizeMultipleActionValue: typeof normalizeMultipleActionValue;

    normalizeCalendarDay: typeof normalizeCalendarDay;

    withLocale: typeof withLocale;

    normalizeCalendarValue: typeof normalizeCalendarValue;

    normalizeDuration: typeof normalizeDuration;

    getDefaultLocale: typeof getDefaultLocale;

    localeStartOfWeek: typeof localeStartOfWeek;

    startOfWeek: typeof startOfWeek;

    endOfWeek: typeof endOfWeek;
  };

  export default _default;

  export function add(date: Date, quantity: number, unit: string): Date;

  export function formatDate(
    date: Date,
    format: string,
    locale?: string | null,
  ): string;

  export function startOf(date: Date, unit: string): Date;

  export function endOf(date: Date, unit: string): Date;

  export function weekday(date: Date): number;

  export function isoWeekday(date: Date): number;

  export function getWeekdaysShort(): string[];

  export function getWeekdaysMin(): string[];

  export function getWeekdays(): string[];

  export function isAfter(date1: Date, date2: Date): boolean;

  export function isBefore(date1: Date, date2: Date): boolean;

  export function isSame(date1: Date, date2: Date, unit: string): boolean;

  export function isBetween(
    date: Date,
    start: Date,
    end: Date,
    _unit?: string,
    _inclusivity?: string,
  ): boolean;

  export function diff(date1: Date, date2: Date): number;

  export function normalizeDate(dateOrDateTime?: unknown): Date | undefined;

  export function normalizeRangeActionValue(val: {
    date: {
      start?: Date | null;

      end?: Date | null;
    };
  }): NormalizeRangeActionValue;

  export function normalizeMultipleActionValue(val: {
    date: Date[];
  }): NormalizeMultipleActionValue;

  export function normalizeCalendarDay(day: PowerCalendarDay): PowerCalendarDay;

  export function withLocale(locale: string, fn: () => unknown): unknown;

  export function normalizeCalendarValue(value: {
    date: Date;
  }): NormalizeCalendarValue;

  export function normalizeDuration(value: unknown): number | null | undefined;

  export function getDefaultLocale(): string;

  export function localeStartOfWeek(locale: string): number;

  export function startOfWeek(day: Date, startOfWeek: number): Date;

  export function endOfWeek(day: Date, startOfWeek: number): Date;
}
