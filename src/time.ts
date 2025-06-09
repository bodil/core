import { present } from "./assert";
import { Cmp, type OrderFn } from "./order";

/**
 * Test if the given {@link Temporal.Instant} comes before a certain moment
 * in time.
 *
 * If `other` is unspecified, compare with the current time.
 *
 * If `other` is a {@link Temporal.Duration}, compare with that duration
 * subtracted from the current time.
 *
 * If `other` is a {@link Temporal.Instant}, compare with that instant.
 *
 * @example
 * time.isBefore(instant) // is `instant` in the past?
 * time.isBefore(instant, otherInstant) // is `instant` before `otherInstant`?
 * time.isBefore(instant, duration) // is `instant` more than `duration` ago?
 */
export function isBefore(
    instant: Temporal.Instant,
    other?: Temporal.Instant | Temporal.Duration
): boolean {
    return (
        Temporal.Instant.compare(
            instant,
            other instanceof Temporal.Duration
                ? Temporal.Now.instant().subtract(other)
                : other ?? Temporal.Now.instant()
        ) === Cmp.LT
    );
}

/**
 * Test if the given {@link Temporal.Instant} comes after a certain moment in
 * time.
 *
 * If `other` is unspecified, compare with the current time.
 *
 * If `other` is a {@link Temporal.Duration}, compare with that duration added
 * to the current time.
 *
 * If `other` is a {@link Temporal.Instant}, compare with that instant.
 *
 * @example
 * time.isAfter(instant) // is `instant` in the future?
 * time.isAfter(instant, otherInstant) // is `instant` after `otherInstant`?
 * time.isAfter(instant, duration) // is `instant` more than `duration` into the future?
 */
export function isAfter(
    instant: Temporal.Instant,
    other?: Temporal.Instant | Temporal.Duration
): boolean {
    return (
        Temporal.Instant.compare(
            instant,
            other instanceof Temporal.Duration
                ? Temporal.Now.instant().add(other)
                : other ?? Temporal.Now.instant()
        ) === Cmp.GT
    );
}

/**
 * Find the shortest duration or earliest time given a series of
 * {@link Temporal.Duration}s or {@link Temporal.Instant}s.
 */
export function min<T extends Temporal.Duration | Temporal.Instant>(...rest: Array<T>): T {
    let first: T = present(rest.shift(), "time.min() called with no arguments");
    const compare =
        first instanceof Temporal.Duration
            ? (Temporal.Duration.compare as OrderFn<T>)
            : (Temporal.Instant.compare as OrderFn<T>);
    for (const next of rest) {
        if (compare(next, first) === Cmp.LT) {
            first = next;
        }
    }
    return first;
}

/**
 * Find the longest duration or latest time given a series of
 * {@link Temporal.Duration}s or {@link Temporal.Instant}s.
 */
export function max<T extends Temporal.Duration | Temporal.Instant>(...rest: Array<T>): T {
    let first: T = present(rest.shift(), "time.max() called with no arguments");
    const compare =
        first instanceof Temporal.Duration
            ? (Temporal.Duration.compare as OrderFn<T>)
            : (Temporal.Instant.compare as OrderFn<T>);
    for (const next of rest) {
        if (compare(next, first) === Cmp.GT) {
            first = next;
        }
    }
    return first;
}

/**
 * The current time as a {@link Temporal.Instant}.
 *
 * A shorthand for `Temporal.Now.instant()`.
 */
export function now(): Temporal.Instant {
    return Temporal.Now.instant();
}

/**
 * The current time as a {@link Temporal.ZonedDateTime}.
 *
 * A shorthand for `Temporal.Now.zonedDateTimeISO()`.
 */
export function nowZ(): Temporal.ZonedDateTime {
    return Temporal.Now.zonedDateTimeISO();
}

/**
 * Construct a duration of the given number of days.
 */
export function days(days: number): Temporal.Duration {
    return Temporal.Duration.from({ hours: days * 24 });
}

/**
 * Construct a duration of the given number of hours.
 */
export function hours(hours: number): Temporal.Duration {
    return Temporal.Duration.from({ hours });
}

/**
 * Construct a duration of the given number of minutes.
 */
export function minutes(minutes: number): Temporal.Duration {
    return Temporal.Duration.from({ minutes });
}

/**
 * Construct a duration of the given number of seconds.
 */
export function seconds(seconds: number): Temporal.Duration {
    return Temporal.Duration.from({ seconds });
}

/**
 * Construct a duration of the given number of milliseconds.
 */
export function millis(milliseconds: number): Temporal.Duration {
    return Temporal.Duration.from({ milliseconds });
}
