import { None, type Option, Some } from "@bodil/opt";

export enum Cmp {
    LT = -1,
    EQ = 0,
    GT = 1,
}

export type OrderFn<A> = (left: A, right: A) => Cmp;

export function cmpNum(num: number): Cmp {
    return num < 0 ? Cmp.LT : num > 0 ? Cmp.GT : Cmp.EQ;
}

export const numericAscending: OrderFn<number> = (left: number, right: number): Cmp => {
    return cmpNum(left - right);
};

export const numericDescending: OrderFn<number> = (left: number, right: number): Cmp => {
    return cmpNum(right - left);
};

export type OperatorComparable = number | string | bigint | Date;

export function ascending<A extends OperatorComparable>(left: A, right: A): Cmp {
    return left < right ? Cmp.LT : left === right ? Cmp.EQ : Cmp.GT;
}

export function descending<A extends OperatorComparable>(left: A, right: A): Cmp {
    return left < right ? Cmp.GT : left === right ? Cmp.EQ : Cmp.LT;
}

export function reverse<T>(fn: OrderFn<T>): OrderFn<T> {
    return (left: T, right: T) => {
        switch (fn(left, right)) {
            case Cmp.LT:
                return Cmp.GT;
            case Cmp.GT:
                return Cmp.LT;
            case Cmp.EQ:
                return Cmp.EQ;
        }
    };
}

/**
 * Given a value, a sorted array and a comparison function by which the array
 * has been sorted, find the lowest index at which the value could be inserted
 * while maintaining sort order.
 */
export function bisectLow<A>(cmp: OrderFn<A>, array: Array<A>, key: A): number {
    let low = 0,
        high = array.length;
    while (low < high) {
        const mid: number = Math.floor((low + high) / 2);
        if (cmp(key, array[mid]) === Cmp.GT) {
            low = mid + 1;
        } else {
            high = mid;
        }
    }
    return low;
}

/**
 * Given a value, a sorted array and a comparison function by which the array
 * has been sorted, find the highest index at which the value could be inserted
 * while maintaining sort order.
 */
export function bisectHigh<A>(cmp: OrderFn<A>, array: Array<A>, key: A): number {
    let low = 0,
        high = array.length;
    while (low < high) {
        const mid: number = Math.floor((low + high) / 2);
        if (cmp(key, array[mid]) !== Cmp.LT) {
            low = mid + 1;
        } else {
            high = mid;
        }
    }
    return low;
}

/**
 * Given a value, a sorted array and a comparison function by which the array
 * has been sorted, find the index of the specific value if it exists in the
 * array.
 */
export function find<A>(cmp: OrderFn<A>, array: Array<A>, key: A): Option<number> {
    let index = bisectLow(cmp, array, key);
    while (index < array.length) {
        if (Object.is(key, array[index])) {
            return Some(index);
        }
        index++;
        if (index >= array.length || cmp(key, array[index]) !== Cmp.EQ) {
            return None;
        }
    }
    return None;
}
