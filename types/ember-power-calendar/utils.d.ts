declare module 'ember-power-calendar/utils' {
  export interface DateLibrary {
    add: (date: Date, quantity: number, unit: string) => Date;

    formatDate: (date: Date, format: string, locale: string | null) => string;

    startOf: (date: Date, unit: string) => Date;

    endOf: (date: Date, unit: string) => Date;

    weekday: (date: Date) => number;

    isoWeekday: (date: Date) => number;

    getWeekdaysShort: () => string[];

    getWeekdaysMin: () => string[];

    getWeekdays: () => string[];

    isAfter: (date1: Date, date2: Date) => boolean;

    isBefore: (date1: Date, date2: Date) => boolean;

    isSame: (date1: Date, date2: Date, unit: string) => boolean;

    isBetween: (
      date: Date,
      start: Date,
      end: Date,
      unit?: string,
      inclusivity?: string,
    ) => boolean;

    diff: (date1: Date, date2: Date) => number;

    normalizeDate: (date?: unknown) => Date | undefined;

    normalizeRangeActionValue: (
      val: RangeActionValue,
    ) => NormalizeRangeActionValue;

    normalizeMultipleActionValue: (val: {
      date: Date[];
    }) => NormalizeMultipleActionValue;

    normalizeCalendarDay: (day: PowerCalendarDay) => PowerCalendarDay;

    withLocale: (locale: string, fn: () => unknown) => unknown;

    normalizeCalendarValue: (value: { date: Date }) => NormalizeCalendarValue;

    normalizeDuration: (value: unknown) => number | null | undefined;

    getDefaultLocale: () => string;

    localeStartOfWeek: (locale: string) => number;

    startOfWeek: (day: Date, startOfWeek: number) => Date;

    endOfWeek: (day: Date, startOfWeek: number) => Date;
  }

  export interface NormalizeRangeActionValue {
    date: {
      start?: Date | null;

      end?: Date | null;
    };

    moment?: {
      start?: unknown;

      end?: unknown;
    };

    datetime?: {
      start?: unknown;

      end?: unknown;
    };
  }

  export interface NormalizeMultipleActionValue {
    date: Date[];

    moment?: unknown[];

    datetime?: unknown[];
  }

  export interface NormalizeCalendarValue {
    date: Date | undefined;

    moment?: unknown;

    datetime?: unknown;
  }

  export interface RangeActionValue {
    date: SelectedPowerCalendarRange;
  }

  export interface SelectedPowerCalendarRange {
    start?: Date | null;

    end?: Date | null;
  }

  export interface PowerCalendarDay {
    id: string;

    number: number;

    date: Date;

    moment?: unknown;

    datetime?: unknown;

    isFocused: boolean;

    isCurrentMonth: boolean;

    isToday: boolean;

    isSelected: boolean;

    isRangeStart?: boolean;

    isRangeEnd?: boolean;

    isDisabled: boolean;
  }

  export function registerDateLibrary(dateLibrary: DateLibrary): void;

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
    unit: string,
    inclusivity: string,
  ): boolean;

  export function diff(date1: Date, date2: Date): number;

  export function normalizeDate(date?: unknown): Date | undefined;

  export function normalizeRangeActionValue(
    val: RangeActionValue,
  ): NormalizeRangeActionValue;

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
