import { test, expect, expectTypeOf } from "vitest";
import type { Option } from ".";

import "./index";
import { ascending } from "./order";

import "@bodil/opt-vitest";

const Iterator = globalThis.Iterator;

test("Object.get", () => {
    const obj = { foo: "foo", bar: 31337 };
    expect(Object.get(obj, "foo")).isSome("foo");
    expectTypeOf(Object.get(obj, "foo")).toEqualTypeOf<Option<string>>();
    expect(Object.get(obj, "bar")).isSome(31337);
    expectTypeOf(Object.get(obj, "bar")).toEqualTypeOf<Option<number>>();
    // @ts-expect-error
    expect(Object.get(obj, "baz")).isNone();
});

test("Array.get", () => {
    const array = [4, 5, 6];
    expect(array.get(-1)).isNone();
    expect(array.get(0)).isSome(4);
    expect(array.get(1)).isSome(5);
    expect(array.get(2)).isSome(6);
    expect(array.get(3)).isNone();

    const sparseArray: Array<number> = [];
    sparseArray[1] = 31337;
    expect(sparseArray.get(0)).isNone();
    expect(sparseArray.get(1)).isSome(31337);
    expect(sparseArray.get(2)).isNone();
    expectTypeOf(sparseArray.get(0)).toEqualTypeOf<Option<number>>();
});

test("Object.mapEntries", () => {
    const obj1 = { foo: 1, bar: 2, baz: 3 };
    expect(Object.mapEntries(obj1, ([key, value]) => [key.toUpperCase(), `${value + 1}`])).toEqual({
        FOO: "2",
        BAR: "3",
        BAZ: "4",
    });
});

test("Map.getOrSet", () => {
    const defaultValue = () => "Robert";
    const map = new Map();
    map.set("foo", "Joe");
    expect(map.getOrSet("foo", defaultValue)).toEqual("Joe");
    expect(map.getOrSet("bar", defaultValue)).toEqual("Robert");
    expect(map.get("bar")).toEqual("Robert");
});

test("Array.insert", () => {
    const array = [1, 2, 3, 4, 5];
    const result = array.insert(1337, 3);
    expect(result).toEqual([1, 2, 3, 1337, 4, 5]);
    expect(array).toEqual([1, 2, 3, 1337, 4, 5]);
    expect(result).toBe(array);

    expect(() => array.insert(1337, 10)).toThrow(RangeError);
});

test("Array.insertOrdered", () => {
    const array = [1, 3, 5, 7, 9];
    const result = array.insertOrdered(6, ascending);
    expect(result).toEqual([1, 3, 5, 6, 7, 9]);
    expect(array).toEqual([1, 3, 5, 6, 7, 9]);
    const result2 = array.insertOrdered(1337, ascending);
    expect(result2).toEqual([1, 3, 5, 6, 7, 9, 1337]);
    expect(array).toEqual([1, 3, 5, 6, 7, 9, 1337]);
});

test("Array.remove", () => {
    const array = [1, 2, 3, 4, 5];
    expect(array.remove(3)).isSome(3);
    expect(array).toEqual([1, 2, 4, 5]);
    expect(array.remove(6)).isNone();
    expect(array).toEqual([1, 2, 4, 5]);
});

test("Array.filterPresent", () => {
    const array: Array<number | undefined> = [1, 2, undefined, 3, undefined, 4];
    const cleanArray = array.present();
    expect(array.some((v) => v === undefined)).toBeTruthy();
    expect(cleanArray.some((v) => v === undefined)).toBeFalsy();
    expect(cleanArray).toEqual([1, 2, 3, 4]);
    expectTypeOf(cleanArray).toMatchTypeOf<Array<number>>();
});

test("Iterator.partition", () => {
    expect(Array.from(Iterator.from([1, 2, 3, 4]).partition(2))).toEqual([
        [1, 2],
        [3, 4],
    ]);

    expect(Array.from(Iterator.from([1, 2, 3]).partition(2))).toEqual([[1, 2], [3]]);
});

test("Iterator.frontBiasedPartition", () => {
    expect(Array.from(Iterator.from([1, 2, 3, 4]).frontBiasedPartition(2))).toEqual([
        [1, 2],
        [3, 4],
    ]);

    expect(Array.from(Iterator.from([1, 2, 3]).frontBiasedPartition(2))).toEqual([[1], [2, 3]]);
});

test("Iterator.takeOne", () => {
    const iter = [1, 2, 3][Symbol.iterator]();
    expect(iter.takeOne()).isSome(1);
    expect(iter.takeOne()).isSome(2);
    expect(iter.takeOne()).isSome(3);
    expect(iter.takeOne()).isNone();
});
