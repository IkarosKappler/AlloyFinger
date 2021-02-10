interface XYCoords {
    x: number;
    y: number;
}
declare type SwipeDirection = "Up" | "Right" | "Left" | "Down";
/**
 * These are the supported event names and exactly the event handlers in `this`.
 * This allows direct handler access by name respecting Typescript restrictions.
 */
declare type EventName = "rotate" | "touchStart" | "multipointStart" | "multipointEnd" | "pinch" | "swipe" | "tap" | "doubleTap" | "longTap" | "singleTap" | "pressMove" | "twoFingerPressMove" | "touchMove" | "touchEnd" | "touchCancel";
interface Touch {
    altitudeAngle: number;
    azimuthAngle: number;
    clientX: number;
    clientY: number;
    force: number;
    identifier: number;
    pageX: number;
    pageY: number;
    radiusX: number;
    radiusY: number;
    rotationAngle: number;
    screenX: number;
    screenY: number;
    target: Element;
    touchType: number;
}
interface TouchList extends Array<Touch> {
    item: (index: number) => Touch;
}
interface AFTouchEvent<N extends EventName> {
    _ename: N;
    touches: TouchList;
    angle: number;
    zoom: number;
    deltaX: number;
    deltaY: number;
    direction: SwipeDirection;
}
export interface TouchRotateEvent extends Pick<AFTouchEvent<"rotate">, "touches" | "angle"> {
}
export interface TouchPinchEvent extends Pick<AFTouchEvent<"pinch">, "touches" | "zoom"> {
}
export interface TouchMoveEvent extends Pick<AFTouchEvent<"touchMove">, "touches" | "deltaX" | "deltaY"> {
}
export interface TouchPressMoveEvent extends Pick<AFTouchEvent<"pressMove">, "touches" | "deltaX" | "deltaY"> {
}
export interface TouchSwipeEvent extends Pick<AFTouchEvent<"swipe">, "touches" | "direction"> {
}
export declare type fn<E> = (evt: E) => void;
interface AlloyFingerOptions {
    rotate?: fn<TouchRotateEvent>;
    touchStart?: fn<AFTouchEvent<"touchStart">>;
    multipointStart?: fn<AFTouchEvent<"multipointStart">>;
    multipointEnd?: fn<AFTouchEvent<"multipointEnd">>;
    pinch?: fn<TouchPinchEvent>;
    swipe?: fn<TouchSwipeEvent>;
    tap?: fn<AFTouchEvent<"tap">>;
    doubleTap?: fn<AFTouchEvent<"doubleTap">>;
    longTap?: fn<AFTouchEvent<"longTap">>;
    singleTap?: fn<AFTouchEvent<"singleTap">>;
    pressMove?: fn<TouchPressMoveEvent>;
    twoFingerPressMove?: fn<TouchPressMoveEvent>;
    touchMove?: fn<TouchMoveEvent>;
    touchEnd?: fn<AFTouchEvent<"touchEnd">>;
    touchCancel?: fn<AFTouchEvent<"touchCancel">>;
}
declare type Handler<N extends EventName, E extends AFTouchEvent<N>> = (evt: E) => void;
declare type Timer = ReturnType<typeof setTimeout>;
declare class HandlerAdmin<N extends EventName> {
    private handlers;
    private el;
    constructor(el: HTMLElement | SVGElement);
    add(handler: Handler<N, AFTouchEvent<N>>): void;
    del(handler?: Handler<N, AFTouchEvent<N>>): void;
    dispatch(..._args: any[]): void;
}
/**
 * @classdesc The AlloyFinger main class. Use this to add handler functions for
 *            touch events to any HTML- or SVG-Element.
 **/
export declare class AlloyFinger {
    element: HTMLElement | SVGElement;
    preV: XYCoords;
    pinchStartLen: number;
    zoom: number;
    isDoubleTap: boolean;
    rotate: HandlerAdmin<"rotate">;
    touchStart: HandlerAdmin<"touchStart">;
    multipointStart: HandlerAdmin<"multipointStart">;
    multipointEnd: HandlerAdmin<"multipointEnd">;
    pinch: HandlerAdmin<"pinch">;
    swipe: HandlerAdmin<"swipe">;
    tap: HandlerAdmin<"tap">;
    doubleTap: HandlerAdmin<"doubleTap">;
    longTap: HandlerAdmin<"longTap">;
    singleTap: HandlerAdmin<"singleTap">;
    pressMove: HandlerAdmin<"pressMove">;
    twoFingerPressMove: HandlerAdmin<"twoFingerPressMove">;
    touchMove: HandlerAdmin<"touchMove">;
    touchEnd: HandlerAdmin<"touchEnd">;
    touchCancel: HandlerAdmin<"touchCancel">;
    _cancelAllHandler: () => void;
    delta: number;
    last: number;
    now: number;
    tapTimeout: Timer;
    singleTapTimeout: Timer;
    longTapTimeout: Timer;
    swipeTimeout: Timer;
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    preTapPosition: XYCoords;
    _preventTap: boolean;
    sx2: number;
    sy2: number;
    constructor(el: HTMLElement | SVGElement, option: AlloyFingerOptions);
    start(evt: TouchEvent): void;
    move(event: TouchEvent): void;
    end(event: TouchEvent): void;
    cancelAll(): void;
    cancel(evt: TouchEvent): void;
    private _cancelLongTap;
    private _cancelSingleTap;
    private _swipeDirection;
    on<N extends EventName>(evt: N, handler: Handler<N, AFTouchEvent<N>>): void;
    off<N extends EventName>(evt: N, handler: Handler<N, AFTouchEvent<N>>): void;
    destroy(): void;
}
export {};
