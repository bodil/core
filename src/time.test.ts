import "temporal-polyfill/global";

import { expect, test } from "vitest";
import { time } from ".";

test("time.min", () => {
    const a = time.seconds(1);
    const b = time.seconds(5);
    const c = time.seconds(10);

    expect(time.min(a, b, c)).toEqual(a);
});

test("time.max", () => {
    const a = time.seconds(1);
    const b = time.seconds(5);
    const c = time.seconds(10);

    expect(time.max(a, b, c)).toEqual(c);
});

test("time.isBefore", () => {
    const a = time.now().subtract(time.seconds(10));
    const b = a.subtract(time.seconds(10));
    const c = time.now().add(time.minutes(10));

    expect(time.isBefore(c)).toBeFalsy();
    expect(time.isBefore(a)).toBeTruthy();
    expect(time.isBefore(a, b)).toBeFalsy();
    expect(time.isBefore(b, a)).toBeTruthy();
    expect(time.isBefore(a, time.seconds(5))).toBeTruthy();
    expect(time.isBefore(a, time.seconds(60))).toBeFalsy();
});

test("time.isAfter", () => {
    const a = time.now().add(time.seconds(10));
    const b = a.add(time.seconds(10));
    const c = time.now().subtract(time.minutes(10));

    expect(time.isAfter(c)).toBeFalsy();
    expect(time.isAfter(a)).toBeTruthy();
    expect(time.isAfter(a, b)).toBeFalsy();
    expect(time.isAfter(b, a)).toBeTruthy();
    expect(time.isAfter(a, time.seconds(5))).toBeTruthy();
    expect(time.isAfter(a, time.seconds(60))).toBeFalsy();
});
