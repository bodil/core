/**
 * Return a promise that will resolve after the specified number of
 * milliseconds or {@link Temporal.Duration}.
 */
export function sleep(duration: number | Temporal.Duration): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(
            resolve,
            typeof duration === "number" ? duration : duration.total("milliseconds")
        );
    });
}

export interface AbortableJob<A> extends Disposable {
    result: Promise<A>;
    abort: (message?: string) => void;
    signal: AbortSignal;
}

/**
 * Build a promise that can be aborted using an `AbortSignal`.
 */
export function abortable<A>(
    fn: (abort: AbortSignal) => Promise<A>,
    abortController: AbortController = new AbortController()
): AbortableJob<A> {
    return {
        signal: abortController.signal,
        result: fn(abortController.signal).then(
            (result) => {
                abortController.signal.throwIfAborted();
                return result;
            },
            (error) => {
                const aborted: boolean = abortController.signal.aborted;
                return aborted ? abortController.signal.reason : error;
            }
        ),
        abort: (message = "promise was aborted"): void =>
            abortController.abort(new DOMException(message, "AbortError")),
        [Symbol.dispose]: () =>
            abortController.abort(new DOMException("promise was disposed", "AbortError")),
    };
}
