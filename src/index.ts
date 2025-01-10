/* eslint-disable @typescript-eslint/no-this-alias */
// deno-lint-ignore-file no-this-alias

import { type OrderFn, bisectHigh, bisectLow } from "./order";
import type { Present } from "./types";
import { assert } from "./assert";

import * as Assert from "./assert";
import * as Async from "./async";
import * as Date from "./date";
import * as Event from "./event";
import * as Fun from "./fun";
import * as Order from "./order";
import * as Types from "./types";
export { Assert, Async, Date, Event, Fun, Order, Types };

import { None, Some, Option, Ok, Err, Result } from "@bodil/opt";
export { None, Some, Option, Ok, Err, Result };

declare global {
    interface ObjectConstructor {
        /**
         * Create a new object by mapping an existing object's `Object.entries`
         * through a function.
         */
        mapEntries<A, B>(
            obj: Record<string, A>,
            fn: (entry: [key: string, value: A]) => [string, B]
        ): Record<string, B>;
    }

    interface Map<K, V> {
        /**
         * If `key` exists in the map, return the value associated with it.
         * Otherwise, call `value()` to create a new value, insert that into the
         * map under `key`, and return it.
         */
        getOrSet(key: K, defaultValue: () => V): V;
    }

    interface Array<T> {
        /**
         * Insert `value` at `index` in the array.
         */
        insert(value: T, index: number): Array<T>;

        /**
         * Insert `value` into the array at the correct position according to
         * the ordering function `cmp`. The array must already be ordered
         * accordingly.
         *
         * If `duplicates` is `"low"`, the correct position in case of
         * duplicates is considered to be the index of the first occurrence of a
         * duplicate. If it is `"high"`, which is the default, the correct
         * position is considered to be the index after the last occurrence of a
         * duplicate.
         */
        insertOrdered(value: T, cmp: OrderFn<T>, duplicates?: "low" | "high"): Array<T>;

        /**
         * Remove the first occurrence of a given value from an array.
         *
         * Returns an {@link Option} containing the removed value, or {@link None} if
         * no matches were found.
         */
        remove(value: T): Option<T>;

        /**
         * Remove the first value for which the provided predicate function
         * returns `true` from the array.
         *
         * Returns an {@link Option} containing the removed value, or {@link None} if
         * no matches were found.
         */
        removeFn(predicate: (value: T, index: number, obj: Array<T>) => boolean): Option<T>;

        /**
         * Remove the value at the given index from the array.
         *
         * Returns an {@link Option} containing the removed value, or {@link None} if
         * the index was out of bounds.
         */
        removeIndex(index: number): Option<T>;

        /**
         * Return a copy of the array with any `undefined` values removed.
         */
        present(): Array<Present<T>>;

        /**
         * Return a copy of the array with any `null` or `undefined` values removed.
         */
        nonNullable(): Array<NonNullable<T>>;
    }

    interface IteratorConstructor {
        /**
         * Construct an empty iterator.
         */
        empty<T>(): IteratorObject<T>;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface IteratorObject<T, TReturn, TNext> {
        /**
         * Get the next value from the iterator, wrapped in an {@link Option}
         * type. If the iterator has no more values, return {@link None}.
         *
         * This is the nicely utility typed version of {@link Iterator#next}.
         */
        takeOne(): Option<T>;
        /**
         * Take items from the iterator only until the first time `predicate` returns false.
         */
        takeWhile<S extends T>(
            predicate: (value: T, index: number) => value is S
        ): IteratorObject<S, undefined>;
        takeWhile(predicate: (value: T, index: number) => boolean): IteratorObject<T, undefined>;
        /**
         * Ignore all items matching `predicate` until the first item that
         * doesn't match.
         */
        skipWhile(predicate: (value: T, index: number) => boolean): IteratorObject<T, undefined>;
        /**
         * Iterate until calling `mapFn` on an item returns a value, then return
         * that value. Return `undefined` if `mapFn` never returns a value.
         */
        findMap<U>(mapFn: (value: T) => NonNullable<U> | undefined): NonNullable<U> | undefined;
        /**
         * Split the input up into arrays of at most `size` items.
         */
        partition(size: number): IteratorObject<Array<T>, undefined>;
        /**
         * As {@link IteratorObject#partition}, but if the input length isn't
         * divisible by `size`, ensure the *first* array is the shortest one
         * rather than the last.
         *
         * Be warned that this requires the entire input iterable to be read up
         * front to decide its length, so this function is not lazy.
         */
        frontBiasedPartition(size: number): Array<Array<T>>;
        /**
         * Filter out any items which are `undefined`.
         */
        present(): IteratorObject<Present<T>, undefined>;
        /**
         * Filter out any items which are `null` or `undefined`.
         */
        nonNullable(): IteratorObject<NonNullable<T>, undefined>;
    }
}

// Object

Object.mapEntries = function mapEntries<A, B>(
    obj: Record<string, A>,
    fn: (entry: [key: string, value: A]) => [string, B]
): Record<string, B> {
    return Object.fromEntries(Object.entries(obj).map(fn));
};

// Map

Map.prototype.getOrSet = function getOrSet<K, V>(
    this: Map<K, NonNullable<V>>,
    key: K,
    defaultValue: () => NonNullable<V>
): V {
    const result = this.get(key);
    if (result !== undefined) {
        return result;
    }
    const newValue = defaultValue();
    this.set(key, newValue);
    return newValue;
};

// Array

Array.prototype.remove = function remove<T>(this: Array<T>, value: T): Option<T> {
    return this.removeIndex(this.indexOf(value));
};

Array.prototype.removeFn = function remove<T>(
    this: Array<T>,
    predicate: (value: T, index: number, obj: Array<T>) => boolean
): Option<T> {
    return this.removeIndex(this.findIndex(predicate as () => boolean));
};

Array.prototype.removeIndex = function remove<T>(this: Array<T>, index: number): Option<T> {
    if (!Number.isInteger(index)) {
        throw new TypeError(`Array.removeIndex(): index ${index} is not an integer`);
    }
    if (index < 0 || index >= this.length) {
        return None;
    }
    const removed = this.splice(index, 1).pop();
    return Option.from(removed);
};

Array.prototype.insert = function insert<T>(this: Array<T>, value: T, index: number): Array<T> {
    if (!Number.isInteger(index)) {
        throw new TypeError(`Array.insert(): index ${index} is not an integer`);
    }
    if (index > this.length || index < 0) {
        throw new RangeError(`Array.insert: index ${index} out of bounds`);
    }
    this.splice(index, 0, value);
    return this;
};

Array.prototype.insertOrdered = function insertOrdered<T>(
    this: Array<T>,
    value: T,
    cmp: OrderFn<T>,
    duplicates: "low" | "high" = "high"
): Array<T> {
    return this.insert(value, (duplicates === "low" ? bisectLow : bisectHigh)(cmp, this, value));
};

Array.prototype.present = function present<T>(this: Array<T>): Array<Present<T>> {
    return this.filter((value: T): value is Present<T> => value !== undefined);
};

Array.prototype.nonNullable = function nonNullable<T>(this: Array<T>): Array<NonNullable<T>> {
    return this.filter((value: T): value is NonNullable<T> => value !== undefined);
};

// Iterator

Iterator.empty = function empty<T>(): IteratorObject<T> {
    return Iterator.from([]);
};

Iterator.prototype.takeOne = function takeOne<T>(this: Iterator<T>): Option<T> {
    const result = this.next();
    return result.done === true ? None : Some(result.value);
};

Iterator.prototype.takeWhile = function takeWhile<T>(
    this: IteratorObject<T, undefined>,
    predicate: (value: T, index: number) => boolean
): IteratorObject<T, undefined> {
    const iter = this;
    let index = 0;
    let done = false;
    return Iterator.from<T>({
        next(): IteratorResult<T, undefined> {
            if (!done) {
                const result = iter.next();
                if (result.done === true) {
                    return result;
                }
                if (predicate(result.value, index++)) {
                    return result;
                }
            }
            done = true;
            return { done: true, value: undefined };
        },
    });
};

Iterator.prototype.skipWhile = function skipWhile<T>(
    this: IteratorObject<T, undefined>,
    predicate: (value: T, index: number) => boolean
): IteratorObject<T, undefined> {
    const iter = this;
    let index = 0;
    let skipped = false;
    return Iterator.from<T>({
        next(): IteratorResult<T, undefined> {
            if (skipped) {
                return iter.next();
            }
            while (true) {
                const result = iter.next();
                if (result.done === true) {
                    return result;
                }
                if (!predicate(result.value, index++)) {
                    skipped = true;
                    return result;
                }
            }
        },
    });
};

Iterator.prototype.findMap = function findMap<T, U>(
    this: IteratorObject<T, undefined>,
    mapFn: (value: T, index: number) => NonNullable<U> | undefined
): NonNullable<U> | undefined {
    let index = 0;
    while (true) {
        const result = this.next();
        if (result.done === true) {
            return undefined;
        }
        const mapped = mapFn(result.value, index++);
        if (mapped !== undefined) {
            return mapped;
        }
    }
};

Iterator.prototype.partition = function partition<T>(
    this: IteratorObject<T, undefined>,
    size: number
): IteratorObject<Array<T>, undefined> {
    const iter = this;
    let done = false;
    return Iterator.from<Array<T>>({
        next(): IteratorResult<Array<T>, undefined> {
            if (done) {
                return { done: true, value: undefined };
            }
            const part = [];
            while (true) {
                const result = iter.next();
                if (result.done === true) {
                    done = true;
                    return part.length > 0
                        ? { done: false, value: part }
                        : { done: true, value: undefined };
                }
                part.push(result.value);
                if (part.length === size) {
                    return { done: false, value: part };
                }
            }
        },
    });
};

Iterator.prototype.frontBiasedPartition = function frontBiasedPartition<T>(
    this: IteratorObject<T, undefined>,
    size: number
): Array<Array<T>> {
    const input = this.toArray();
    let inputPos = 0;
    const firstLength = input.length % size;
    const output: Array<Array<T>> = [];
    if (firstLength > 0) {
        output.push(input.slice(0, firstLength));
        inputPos = firstLength;
    }
    while (inputPos < input.length) {
        output.push(input.slice(inputPos, inputPos + size));
        inputPos += size;
    }
    assert(inputPos === input.length);
    return output;
};

Iterator.prototype.present = function present<T>(
    this: IteratorObject<T, undefined>
): IteratorObject<Present<T>, undefined> {
    return Iterator.from(this.filter((item): item is Present<T> => item !== undefined));
};

Iterator.prototype.nonNullable = function nonNullable<T>(
    this: IteratorObject<T, undefined>
): IteratorObject<NonNullable<T>, undefined> {
    return Iterator.from(
        this.filter((item): item is NonNullable<T> => item !== undefined && item !== null)
    );
};
