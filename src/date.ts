export const MILLIS_IN_DAY = 86400000 as Milliseconds;
export const MILLIS_IN_HOUR = 3600000 as Milliseconds;
export const MILLIS_IN_MINUTE = 60000 as Milliseconds;
export const MILLIS_IN_SECOND = 1000 as Milliseconds;

export type Milliseconds = number;

/**
 * Find the earliest {@link Date} in a list of {@link Date}s.
 */
export function min(...dates: Array<Date>): Date {
    return dates.reduce((a, b) => (a < b ? a : b));
}

/**
 * Find the latest {@link Date} in a list of {@link Date}s.
 */
export function max(...dates: Array<Date>): Date {
    return dates.reduce((a, b) => (a > b ? a : b));
}

/**
 * Test if two {@link Date}s lie in the same calendar year.
 */
export function isSameYear(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear();
}

/**
 * Create a new {@link Date} that's the given number of milliseconds after the
 * given {@link Date}.
 */
export function addMillis(date: Date, millis: Milliseconds): Date {
    const time = +date;
    return new Date(time + millis);
}

/**
 * Create a new {@link Date} that's the given number of milliseconds before the
 * given {@link Date}.
 */
export function subMillis(date: Date, millis: Milliseconds): Date {
    return addMillis(date, -millis);
}

/**
 * Create a new {@link Date} that's the given number of seconds after the
 * given {@link Date}.
 */
export function addSeconds(date: Date, seconds: number): Date {
    return addMillis(date, seconds * MILLIS_IN_SECOND);
}

/**
 * Create a new {@link Date} that's the given number of seconds before the
 * given {@link Date}.
 */
export function subSeconds(date: Date, seconds: number): Date {
    return subMillis(date, seconds * MILLIS_IN_SECOND);
}

/**
 * Create a new {@link Date} that's the given number of minutes after the
 * given {@link Date}.
 */
export function addMinutes(date: Date, minutes: number): Date {
    return addMillis(date, minutes * MILLIS_IN_MINUTE);
}

/**
 * Create a new {@link Date} that's the given number of minutes before the
 * given {@link Date}.
 */
export function subMinutes(date: Date, minutes: number): Date {
    return subMillis(date, minutes * MILLIS_IN_MINUTE);
}

/**
 * Create a new {@link Date} that's the given number of hours after the
 * given {@link Date}.
 */
export function addHours(date: Date, hours: number): Date {
    return addMillis(date, hours * MILLIS_IN_HOUR);
}

/**
 * Create a new {@link Date} that's the given number of hours before the
 * given {@link Date}.
 */
export function subHours(date: Date, hours: number): Date {
    return subMillis(date, hours * MILLIS_IN_HOUR);
}

/**
 * Create a new {@link Date} that's the given number of days after the
 * given {@link Date}.
 */
export function addDays(date: Date, days: number): Date {
    const newDate = new Date(+date);
    newDate.setDate(date.getDate() + days);
    return newDate;
}

/**
 * Create a new {@link Date} that's the given number of days before the
 * given {@link Date}.
 */
export function subDays(date: Date, days: number): Date {
    return addDays(date, -days);
}

/**
 * Calculate the number of days between two {@link Date}s.
 */
export function daysBetween(a: Date, b: Date): number {
    return Math.round((+a - +b) / MILLIS_IN_DAY);
}

/**
 * Calculate the number of hours between two {@link Date}s.
 */
export function hoursBetween(a: Date, b: Date): number {
    return Math.round((+a - +b) / MILLIS_IN_HOUR);
}

/**
 * Calculate the number of minutes between two {@link Date}s.
 */
export function minutesBetween(a: Date, b: Date): number {
    return Math.round((+a - +b) / MILLIS_IN_MINUTE);
}

/**
 * Calculate the number of seconds between two {@link Date}s.
 */
export function secondsBetween(a: Date, b: Date): number {
    return Math.round((+a - +b) / MILLIS_IN_SECOND);
}

/**
 * Calculate the number of milliseconds between two {@link Date}s.
 */
export function millisBetween(a: Date, b: Date): Milliseconds {
    return +a - +b;
}
