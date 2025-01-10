import type { Present } from "./types";

/**
 * An interface a type can extend to associate a map of event names to event
 * types with itself, in the style of `HTMLElementEventMap` et al. This allows
 * the type system to discover the events available for a specific `EventTarget`
 * descendant.
 *
 * If you need to implement this for a class you're defining, you need to add
 * `__events!: MyEventMap` as a property on the class.
 */
export interface DeclareEvents<Events> extends EventTarget {
    __events: Events;
}

/**
 * Get the `Events` type associated with a type that extends
 * `DeclareEvents&lt;Events>`.
 *
 * Using it on a type that doesn't extend `DeclareEvents` results in a type
 * error.
 */
export type EventMapFor<T extends DeclareEvents<unknown>> = Present<T["__events"]>;

/**
 * Get the `Events` type associated with a type that extends
 * `DeclareEvents&lt;Events>`.
 *
 * A type that doesn't extend `DeclareEvents` resolves to an object which will
 * accept all string keys.
 */
export type ExtractEventMap<T> = T extends DeclareEvents<infer Events>
    ? Events
    : { [key: string]: Event };

declare global {
    interface AbortSignal extends DeclareEvents<AbortSignalEventMap> {}
    interface Animation extends DeclareEvents<AnimationEventMap> {}
    interface BroadcastChannel extends DeclareEvents<BroadcastChannelEventMap> {}
    interface Document extends DeclareEvents<DocumentEventMap> {}
    interface EventSource extends DeclareEvents<EventSourceEventMap> {}
    interface HTMLBodyElement extends DeclareEvents<HTMLBodyElementEventMap> {}
    interface HTMLElement extends DeclareEvents<HTMLElementEventMap> {}
    interface MessagePort extends DeclareEvents<MessagePortEventMap> {}
    interface ShadowRoot extends DeclareEvents<ShadowRootEventMap> {}
    interface SVGElement extends DeclareEvents<SVGElementEventMap> {}
    interface SVGSVGElement extends DeclareEvents<SVGSVGElementEventMap> {}
    interface WebSocket extends DeclareEvents<WebSocketEventMap> {}
    interface Window extends DeclareEvents<WindowEventMap> {}
    interface Worker extends DeclareEvents<WorkerEventMap> {}
}
