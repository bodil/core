export class AssertionError extends Error {}

/**
 * Asserts that a condition is true. Throws an exception if it's not.
 *
 * When using Vite, this function generates no code when building a production
 * bundle.
 */
export function assert(
    assertion: unknown,
    message: string = "runtime assertion failed"
): asserts assertion {
    if (
        (import.meta as unknown as { env: unknown }).env === undefined ||
        (import.meta as unknown as { env: { DEV: boolean } }).env.DEV
    ) {
        if (assertion === false) {
            throw new AssertionError(message);
        }
    }
}

/**
 * As {@link assert}, but isn't skipped in production.
 */
export function assertAlways(assertion: unknown, message?: string): asserts assertion {
    if (assertion === false) {
        throw new Error(message ?? "runtime assertion failed");
    }
}

/**
 * Throws an exception used to mark unreachable code.
 */
export function unreachable(): never {
    throw new Error(
        "Congratulations! You have reached a part of the code previously thought to be unreachable."
    );
}

/**
 * Assert that a type is `never` when type checking. Throws an
 * {@link unreachable} exception if it's reached at runtime. This is meant as an
 * exhaustiveness check.
 *
 * @example
 * type State = "on" | "off";
 * function checkState(state: State) {
 *     if (state === "on") {
 *         console.log("it's on");
 *     } else if (state === "off") {
 *         console.log("it's off");
 *     } else {
 *         // this would fail to type check if you
 *         // haven't tested all valid `State` values
 *         // in the above if statement:
 *         assertNever&lt;typeof state>();
 *     }
 * }
 */
export function assertNever<T extends never>(_value: T): T {
    return unreachable();
}

/**
 * Returns the given value unchanged if it's neither null nor undefined.
 * Throws an exception otherwise.
 */
export function present<A>(value: A, message?: string): NonNullable<A> {
    assertAlways(value !== null && value !== undefined, message);
    return value;
}

/**
 * Tests whether a value is null, undefined, false, an empty array or an empty
 * string.
 */
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export function isEmpty(value: unknown): value is null | undefined | void | "" | [] | false {
    return (
        value === null ||
        value === undefined ||
        value === false ||
        (typeof value === "string" && value.length === 0) ||
        (Array.isArray(value) && value.length === 0)
    );
}

/**
 * Tests whether a value is null or undefined.
 */
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export function isNullish(value: unknown): value is null | undefined | void {
    return value === null || value === undefined;
}

/**
 * Tests whether a value is iterable.
 */
export function isIterable(value: unknown): value is Iterable<unknown> {
    return (
        typeof value === "object" &&
        value !== null &&
        typeof (value as Iterable<unknown>)[Symbol.iterator] === "function"
    );
}

/**
 * Tests whether a value is async iterable.
 */
export function isAsyncIterable(value: unknown): value is AsyncIterable<unknown> {
    return (
        typeof value === "object" &&
        value !== null &&
        typeof (value as AsyncIterable<unknown>)[Symbol.asyncIterator] === "function"
    );
}
