/**
 * Create a function that always returns `value`.
 */
export function always<A>(value: A): () => A {
    return () => value;
}

/**
 * The identity function: it just returns its argument unchanged.
 */
export function id<A>(value: A): A {
    return value;
}
