/**
 * Constructs a type by excluding `undefined` from `T`.
 *
 * This is like {@link NonNullable} but it only removes `undefined`, not `null`.
 */
export type Present<T> = T extends undefined ? never : T;
