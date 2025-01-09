import { test, expect } from "vitest";
import * as Order from "./order";

import "@bodil/opt-vitest";

const cmp = Order.numericAscending;
const bisectLowNum = (array: Array<number>, key: number) => Order.bisectLow(cmp, array, key);
const bisectHighNum = (array: Array<number>, key: number) => Order.bisectHigh(cmp, array, key);

test("bisectLow", () => {
    const list = [2, 4, 6, 8, 10];

    expect(bisectLowNum(list, 1)).toEqual(0);
    expect(bisectLowNum(list, 5)).toEqual(2);
    expect(bisectLowNum(list, 6)).toEqual(2);
    expect(bisectLowNum(list, 7)).toEqual(3);
    expect(bisectLowNum(list, 12)).toEqual(5);

    expect(bisectLowNum([], 1)).toEqual(0);
});

test("bisectLow dupes", () => {
    const list = [1, 2, 3, 3, 3, 3, 4, 5];

    expect(bisectLowNum(list, 0)).toEqual(0);
    expect(bisectLowNum(list, 1)).toEqual(0);
    expect(bisectLowNum(list, 5)).toEqual(7);
    expect(bisectLowNum(list, 6)).toEqual(8);

    // Should always return the dupe with the lowest index.
    expect(bisectLowNum(list, 3)).toEqual(2);
});

test("bisectHigh", () => {
    const list = [2, 4, 6, 8, 10];

    expect(bisectHighNum(list, 1)).toEqual(0);
    expect(bisectHighNum(list, 5)).toEqual(2);
    expect(bisectHighNum(list, 6)).toEqual(3);
    expect(bisectHighNum(list, 7)).toEqual(3);
    expect(bisectHighNum(list, 12)).toEqual(5);

    expect(bisectHighNum([], 1)).toEqual(0);
});

test("bisectHigh dupes", () => {
    const list = [1, 2, 3, 3, 3, 3, 4, 5];

    expect(bisectHighNum(list, 0)).toEqual(0);
    expect(bisectHighNum(list, 1)).toEqual(1);
    expect(bisectHighNum(list, 5)).toEqual(8);
    expect(bisectHighNum(list, 6)).toEqual(8);

    // Should always return the index after the last dupe.
    expect(bisectHighNum(list, 3)).toEqual(6);
});

test("find", () => {
    type FindTestData = { foo: number };
    const e0 = { foo: 0 };
    const e1 = { foo: 1 };
    const e2 = { foo: 1 };
    const e3 = { foo: 2 };
    const eCmp = (a: FindTestData, b: FindTestData) => cmp(a.foo, b.foo);
    const findE = (array: Array<FindTestData>, key: FindTestData) => Order.find(eCmp, array, key);

    const list: Array<FindTestData> = [e0, e1, e2, e3];

    // Entries not in the list
    expect(findE(list, { foo: 5 })).isNone();
    expect(findE(list, { foo: -1 })).isNone();

    // Entries in the list
    expect(findE(list, e0)).isSome(0);
    expect(findE(list, e1)).isSome(1);
    expect(findE(list, e2)).isSome(2);
    expect(findE(list, e3)).isSome(3);

    // Entries comparing to entries in the list
    expect(findE(list, { foo: 0 })).isNone();
    expect(findE(list, { foo: 1 })).isNone();
    expect(findE(list, { foo: 2 })).isNone();
});
