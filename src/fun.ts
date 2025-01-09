/**
 * Create a function that always returns `value`.
 */
export function always<A>(value: A): () => A {
    return () => value;
}
