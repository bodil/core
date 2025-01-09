export const MILLIS_IN_DAY = 86400000 as Milliseconds;
export const MILLIS_IN_HOUR = 3600000 as Milliseconds;
export const MILLIS_IN_MINUTE = 60000 as Milliseconds;
export const MILLIS_IN_SECOND = 1000 as Milliseconds;

export type Milliseconds = number;

export function min(...dates: Array<Date>): Date {
    return dates.reduce((a, b) => (a < b ? a : b));
}

export function max(...dates: Array<Date>): Date {
    return dates.reduce((a, b) => (a > b ? a : b));
}

export function isSameYear(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear();
}

export function addMillis(date: Date, millis: Milliseconds): Date {
    const time = +date;
    return new Date(time + millis);
}

export function subMillis(date: Date, millis: Milliseconds): Date {
    return addMillis(date, -millis);
}

export function addSeconds(date: Date, seconds: number): Date {
    return addMillis(date, seconds * MILLIS_IN_SECOND);
}

export function subSeconds(date: Date, seconds: number): Date {
    return subMillis(date, seconds * MILLIS_IN_SECOND);
}

export function addMinutes(date: Date, minutes: number): Date {
    return addMillis(date, minutes * MILLIS_IN_MINUTE);
}

export function subMinutes(date: Date, minutes: number): Date {
    return subMillis(date, minutes * MILLIS_IN_MINUTE);
}

export function addHours(date: Date, hours: number): Date {
    return addMillis(date, hours * MILLIS_IN_HOUR);
}

export function subHours(date: Date, hours: number): Date {
    return subMillis(date, hours * MILLIS_IN_HOUR);
}

export function addDays(date: Date, days: number): Date {
    const newDate = new Date(+date);
    newDate.setDate(date.getDate() + days);
    return newDate;
}

export function subDays(date: Date, days: number): Date {
    return addDays(date, -days);
}

export function daysBetween(a: Date, b: Date): number {
    return Math.round((+a - +b) / MILLIS_IN_DAY);
}

export function hoursBetween(a: Date, b: Date): number {
    return Math.round((+a - +b) / MILLIS_IN_HOUR);
}

export function minutesBetween(a: Date, b: Date): number {
    return Math.round((+a - +b) / MILLIS_IN_MINUTE);
}

export function secondsBetween(a: Date, b: Date): number {
    return Math.round((+a - +b) / MILLIS_IN_SECOND);
}

export function millisBetween(a: Date, b: Date): Milliseconds {
    return +a - +b;
}
