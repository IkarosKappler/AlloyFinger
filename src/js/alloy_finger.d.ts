interface XYCoords {
    x: number;
    y: number;
}
declare type SwipeDirection = "Up" | "Right" | "Left" | "Down";
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
interface AFTouchEvent {
    touches: TouchList;
    angle: number;
    zoom: number;
    deltaX: number;
    deltaY: number;
    direction: SwipeDirection;
}
export interface TouchRotateEvent extends Pick<AFTouchEvent, "touches" | "angle"> {
}
export interface TouchPinchEvent extends Pick<AFTouchEvent, "touches" | "zoom"> {
}
export interface TouchMoveEvent extends Pick<AFTouchEvent, "touches" | "deltaX" | "deltaY"> {
}
export interface TouchPressMoveEvent extends Pick<AFTouchEvent, "touches" | "deltaX" | "deltaY"> {
}
export interface TouchSwipeEvent extends Pick<AFTouchEvent, "touches" | "direction"> {
}
declare type fn = (evt: any) => void;
interface AlloyFingerOptions {
    rotate?: fn;
    touchStart?: fn;
    multipointStart?: fn;
    multipointEnd?: fn;
    pinch?: fn;
    swipe?: fn;
    tap?: fn;
    doubleTap?: fn;
    longTap?: fn;
    singleTap?: fn;
    pressMove?: fn;
    twoFingerPressMove?: fn;
    touchMove?: fn;
    touchEnd?: fn;
    touchCancel?: fn;
}
declare type Handler = (evt: any) => void;
declare type Timer = ReturnType<typeof setTimeout>;
declare class HandlerAdmin {
    handlers: Array<Handler>;
    el: HTMLElement | SVGElement;
    constructor(el: HTMLElement | SVGElement);
    add(handler: Handler): void;
    del(handler?: Handler): void;
    dispatch(...args: any[]): void;
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
    rotate: HandlerAdmin;
    touchStart: HandlerAdmin;
    multipointStart: HandlerAdmin;
    multipointEnd: HandlerAdmin;
    pinch: HandlerAdmin;
    swipe: HandlerAdmin;
    tap: HandlerAdmin;
    doubleTap: HandlerAdmin;
    longTap: HandlerAdmin;
    singleTap: HandlerAdmin;
    pressMove: HandlerAdmin;
    twoFingerPressMove: HandlerAdmin;
    touchMove: HandlerAdmin;
    touchEnd: HandlerAdmin;
    touchCancel: HandlerAdmin;
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
    _cancelLongTap(): void;
    _cancelSingleTap(): void;
    private _swipeDirection;
    on(evt: EventName, handler: Handler): void;
    off(evt: EventName, handler: Handler): void;
    destroy(): void;
}
export {};
