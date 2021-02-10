/* Port from AlloyFinger v0.1.15
 * Original by dntzhang
 * Typescript port by Ikaros Kappler
 * Github: https://github.com/IkarosKappler/AlloyFinger-Typescript
 *
 * @date    2021-02-10 (Typescript port)
 * @version 0.1.15
 */

interface XYCoords {
    x : number;
    y : number;
};

type SwipeDirection = "Up" | "Right" | "Left" | "Down";

type EventName =
    "rotate" |
    "touchStart" |
    "multipointStart" |
    "multipointEnd" |
    "pinch" | 
    "swipe" |
    "tap" |
    "doubleTap" |
    "longTap" |
    "singleTap" |
    "pressMove" |
    "twoFingerPressMove" |
    "touchMove" |
    "touchEnd" |
    "touchCancel";

// ----------------------------------------------------
interface Touch {
    altitudeAngle : number;
    azimuthAngle : number;
    clientX : number;
    clientY : number;
    force : number;
    identifier : number;
    pageX : number;
    pageY : number;
    radiusX : number;
    radiusY : number;
    rotationAngle : number;
    screenX : number;
    screenY : number;
    target : Element;
    touchType : number;
}

interface TouchList extends Array<Touch> {
    item : (index:number)=>Touch;
}

interface AFTouchEvent {
    touches : TouchList;
    angle : number;
    zoom : number;
    deltaX : number;
    deltaY : number;
    direction : SwipeDirection;
}

export interface TouchRotateEvent extends Pick<AFTouchEvent, "touches" | "angle"> {
    //angle : number;
}

export interface TouchPinchEvent extends Pick<AFTouchEvent, "touches" | "zoom"> { // AFTouchEvent  {
    //zoom : number;
}

export interface TouchMoveEvent extends Pick<AFTouchEvent, "touches" | "deltaX" | "deltaY"> { //AFTouchEvent  {
    //deltaX : number;
    //deltaY : number;
}

export interface TouchPressMoveEvent extends Pick<AFTouchEvent, "touches" | "deltaX" | "deltaY"> { //AFTouchEvent  {
    //deltaX : number;
    //deltaY : number;
}

export interface TouchSwipeEvent extends Pick<AFTouchEvent, "touches" | "direction"> { //AFTouchEvent  {
    //direction : number;
}
// ----------------------------------------------------


type fn = (evt:any) => void;

interface AlloyFingerOptions {
    rotate? : fn; // = wrapFunc(this.element, option.rotate || noop);
    touchStart? : fn; // = wrapFunc(this.element, option.touchStart || noop);
    multipointStart? : fn; // = wrapFunc(this.element, option.multipointStart || noop);
    multipointEnd? : fn; // = wrapFunc(this.element, option.multipointEnd || noop);
    pinch? : fn; // = wrapFunc(this.element, option.pinch || noop);
    swipe? : fn; // = wrapFunc(this.element, option.swipe || noop);
    tap? : fn; // = wrapFunc(this.element, option.tap || noop);
    doubleTap? : fn; // = wrapFunc(this.element, option.doubleTap || noop);
    longTap? : fn; // = wrapFunc(this.element, option.longTap || noop);
    singleTap? : fn; // = wrapFunc(this.element, option.singleTap || noop);
    pressMove? : fn; // = wrapFunc(this.element, option.pressMove || noop);
    twoFingerPressMove? : fn; // = wrapFunc(this.element, option.twoFingerPressMove || noop);
    touchMove? : fn; // = wrapFunc(this.element, option.touchMove || noop);
    touchEnd? : fn; // = wrapFunc(this.element, option.touchEnd || noop);
    touchCancel? : fn; // = wrapFunc(this.element, option.touchCancel || noop);
}

type Handler = (evt:any) => void;

type Timer = ReturnType<typeof setTimeout>;

const getLen = ( v : XYCoords ) : number => {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

const dot = ( v1 : XYCoords, v2 : XYCoords ) : number => {
    return v1.x * v2.x + v1.y * v2.y;
}

const getAngle = ( v1 : XYCoords, v2 : XYCoords ) : number => {
    const mr : number = getLen(v1) * getLen(v2);
    if (mr === 0) return 0;
    var r : number = dot(v1, v2) / mr;
    if (r > 1) r = 1;
    return Math.acos(r);
}

const cross = ( v1 : XYCoords, v2 : XYCoords ) : number => {
    return v1.x * v2.y - v2.x * v1.y;
}

const getRotateAngle = ( v1 : XYCoords, v2 : XYCoords ) : number => {
    var angle : number = getAngle(v1, v2);
    if (cross(v1, v2) > 0) {
        angle *= -1;
    }

    return angle * 180 / Math.PI;
}

class HandlerAdmin {

    // TODO: private?
    handlers : Array<Handler>;
    el : HTMLElement | SVGElement; // HTMLElement | SVGElement?

    constructor( el: HTMLElement | SVGElement ) {
	this.handlers = [];
	this.el = el;
    };

    add( handler : Handler ) : void {
	this.handlers.push(handler);
    };

    del( handler?: Handler ) : void {
	if(!handler) this.handlers = [];

	for(var i=this.handlers.length; i>=0; i--) {
            if(this.handlers[i] === handler) {
		this.handlers.splice(i, 1);
            }
	}
    };

    dispatch( ...args : any[] ) : void {
	for(var i=0,len=this.handlers.length; i<len; i++) {
            const handler : Handler = this.handlers[i];
            if( typeof handler === 'function' ) {
		handler.apply(this.el, arguments);
	    }
	}
    };
} // END class HandlerAdmin

/**
 * A wrapper for handlers.
 */
const wrapFunc = ( el : HTMLElement | SVGElement, handler : Handler ) : HandlerAdmin => {
    const handlerAdmin : HandlerAdmin = new HandlerAdmin(el);
    handlerAdmin.add(handler);
    return handlerAdmin;
};

/**
 * @classdesc The AlloyFinger main class. Use this to add handler functions for 
 *            touch events to any HTML- or SVG-Element.
 **/
export class AlloyFinger {

    element : HTMLElement | SVGElement;

    // Huh?
    /*
    start : any;
    move : any;
    end : any;
    cancel : any; */

    preV : XYCoords;
    pinchStartLen : number;
    zoom : number;
    isDoubleTap : boolean;

    rotate : HandlerAdmin;
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

    _cancelAllHandler : ()=>void;

    delta : number; // Time difference
    last : number; // Date.time()
    now : number; // Date.time()
    tapTimeout : Timer; 
    singleTapTimeout : Timer;
    longTapTimeout : Timer; 
    swipeTimeout : Timer;
    x1 : number;
    x2 : number;
    y1 : number;
    y2 : number; 
    preTapPosition : XYCoords; // = { x: null, y: null };

    _preventTap : boolean;
    sx2 : number;
    sy2 : number;
    
    constructor( el : HTMLElement | SVGElement, option : AlloyFingerOptions ) {

	this.element = typeof el == 'string' ? document.querySelector(el) : el;

	// Fancy stuff: change `this` from the start-, move-, end- and cancel-function.
	//    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind
	this.start = this.start.bind(this);
	this.move = this.move.bind(this);
	this.end = this.end.bind(this);
	this.cancel = this.cancel.bind(this);
	
	this.element.addEventListener("touchstart", this.start, false);
	this.element.addEventListener("touchmove", this.move, false);
	this.element.addEventListener("touchend", this.end, false);
	this.element.addEventListener("touchcancel", this.cancel, false);

	this.preV = { x: null, y: null };
	this.pinchStartLen = null;
	this.zoom = 1;
	this.isDoubleTap = false;

	var noop = function () { };

	this.rotate = wrapFunc(this.element, option.rotate || noop);
	this.touchStart = wrapFunc(this.element, option.touchStart || noop);
	this.multipointStart = wrapFunc(this.element, option.multipointStart || noop);
	this.multipointEnd = wrapFunc(this.element, option.multipointEnd || noop);
	this.pinch = wrapFunc(this.element, option.pinch || noop);
	this.swipe = wrapFunc(this.element, option.swipe || noop);
	this.tap = wrapFunc(this.element, option.tap || noop);
	this.doubleTap = wrapFunc(this.element, option.doubleTap || noop);
	this.longTap = wrapFunc(this.element, option.longTap || noop);
	this.singleTap = wrapFunc(this.element, option.singleTap || noop);
	this.pressMove = wrapFunc(this.element, option.pressMove || noop);
	this.twoFingerPressMove = wrapFunc(this.element, option.twoFingerPressMove || noop);
	this.touchMove = wrapFunc(this.element, option.touchMove || noop);
	this.touchEnd = wrapFunc(this.element, option.touchEnd || noop);
	this.touchCancel = wrapFunc(this.element, option.touchCancel || noop);

	this._cancelAllHandler = this.cancelAll.bind(this);

	window.addEventListener('scroll', this._cancelAllHandler);

	this.delta = null;
	this.last = null;
	this.now = null;
	this.tapTimeout = null;
	this.singleTapTimeout = null;
	this.longTapTimeout = null;
	this.swipeTimeout = null;
	this.x1 = this.x2 = this.y1 = this.y2 = null;
	this.preTapPosition = { x: null, y: null };
    };

    // AlloyFinger.prototype = {
    start( evt : TouchEvent ) {
        if (!evt.touches) return;
	const _self : AlloyFinger = this;
        this.now = Date.now();
        this.x1 = evt.touches[0].pageX;
        this.y1 = evt.touches[0].pageY;
        this.delta = this.now - (this.last || this.now);
        this.touchStart.dispatch(evt, this.element);
        if (this.preTapPosition.x !== null) {
            this.isDoubleTap = (this.delta > 0 && this.delta <= 250 && Math.abs(this.preTapPosition.x - this.x1) < 30 && Math.abs(this.preTapPosition.y - this.y1) < 30);
            if (this.isDoubleTap) clearTimeout(this.singleTapTimeout);
        }
        this.preTapPosition.x = this.x1;
        this.preTapPosition.y = this.y1;
        this.last = this.now;
        var preV = this.preV,
        len = evt.touches.length;
        if (len > 1) {
            this._cancelLongTap();
            this._cancelSingleTap();
            var v = { x: evt.touches[1].pageX - this.x1, y: evt.touches[1].pageY - this.y1 };
            preV.x = v.x;
            preV.y = v.y;
            this.pinchStartLen = getLen(preV);
            this.multipointStart.dispatch(evt, this.element);
        }
        this._preventTap = false;
        this.longTapTimeout = setTimeout(function () {
            _self.longTap.dispatch(evt, _self.element);
            _self._preventTap = true;
        }.bind(this), 750);
    };
    
    move( event : TouchEvent ) {
        if (!event.touches) return;
	const afEvent : AFTouchEvent = (event as unknown) as AFTouchEvent;
        var preV = this.preV,
        len = event.touches.length,
        currentX = event.touches[0].pageX,
        currentY = event.touches[0].pageY;
        this.isDoubleTap = false;
        if (len > 1) {
            var sCurrentX = afEvent.touches[1].pageX,
            sCurrentY = afEvent.touches[1].pageY
            var v = { x: afEvent.touches[1].pageX - currentX, y: afEvent.touches[1].pageY - currentY };

            if (preV.x !== null) {
                if (this.pinchStartLen > 0) {
                    afEvent.zoom = getLen(v) / this.pinchStartLen;
                    this.pinch.dispatch(afEvent as TouchPinchEvent, this.element);
                }

                afEvent.angle = getRotateAngle(v, preV);
                this.rotate.dispatch(afEvent as TouchRotateEvent, this.element);
            }
            preV.x = v.x;
            preV.y = v.y;

            if (this.x2 !== null && this.sx2 !== null) {
                afEvent.deltaX = (currentX - this.x2 + sCurrentX - this.sx2) / 2;
                afEvent.deltaY = (currentY - this.y2 + sCurrentY - this.sy2) / 2;
            } else {
                afEvent.deltaX = 0;
                afEvent.deltaY = 0;
            }
            this.twoFingerPressMove.dispatch(afEvent as TouchPressMoveEvent, this.element);

            this.sx2 = sCurrentX;
            this.sy2 = sCurrentY;
        } else {
            if (this.x2 !== null) {
                afEvent.deltaX = currentX - this.x2;
                afEvent.deltaY = currentY - this.y2;

                //move事件中添加对当前触摸点到初始触摸点的判断，
                //如果曾经大于过某个距离(比如10),就认为是移动到某个地方又移回来，应该不再触发tap事件才对。
                var movedX = Math.abs(this.x1 - this.x2),
                movedY = Math.abs(this.y1 - this.y2);

                if(movedX > 10 || movedY > 10){
                    this._preventTap = true;
                }

            } else {
                afEvent.deltaX = 0;
                afEvent.deltaY = 0;
            }
            
            
            this.pressMove.dispatch(afEvent as TouchPressMoveEvent, this.element);
        }

        this.touchMove.dispatch(afEvent as TouchMoveEvent, this.element);

        this._cancelLongTap();
        this.x2 = currentX;
        this.y2 = currentY;
        
        if (len > 1) {
            event.preventDefault();
        }
    }; // END move
    
    end( event : TouchEvent ) {
        if (!event.changedTouches) return;
	const afEvent : AFTouchEvent = (event as unknown) as AFTouchEvent;
        this._cancelLongTap();
        var self : AlloyFinger = this;
        if (afEvent.touches.length < 2) {
            this.multipointEnd.dispatch(afEvent as AFTouchEvent, this.element);
            this.sx2 = this.sy2 = null;
        }

        //swipe
        if ((this.x2 && Math.abs(this.x1 - this.x2) > 30) ||
            (this.y2 && Math.abs(this.y1 - this.y2) > 30)) {
            afEvent.direction = this._swipeDirection(this.x1, this.x2, this.y1, this.y2);
            this.swipeTimeout = setTimeout(function () {
                self.swipe.dispatch(afEvent as TouchSwipeEvent, self.element);

            }, 0)
        } else {
            this.tapTimeout = setTimeout(function () {
                if(!self._preventTap){
                    self.tap.dispatch(afEvent as AFTouchEvent, self.element);
                }
                // trigger double tap immediately
                if (self.isDoubleTap) {
                    self.doubleTap.dispatch(afEvent as AFTouchEvent, self.element);
                    self.isDoubleTap = false;
                }
            }, 0)

            if (!self.isDoubleTap) {
                self.singleTapTimeout = setTimeout(function () {
                    self.singleTap.dispatch(afEvent as AFTouchEvent, self.element);
                }, 250);
            }
        }

        this.touchEnd.dispatch(afEvent as AFTouchEvent, this.element);

        this.preV.x = 0;
        this.preV.y = 0;
        this.zoom = 1;
        this.pinchStartLen = null;
        this.x1 = this.x2 = this.y1 = this.y2 = null;
    }; // END end
    
    cancelAll() {
        this._preventTap = true
        clearTimeout(this.singleTapTimeout);
        clearTimeout(this.tapTimeout);
        clearTimeout(this.longTapTimeout);
        clearTimeout(this.swipeTimeout);
    };

    // IS THIS USED???
    cancel( evt : TouchEvent ) {
        this.cancelAll()
        this.touchCancel.dispatch(evt, this.element);
    };

    // TODO: private?
    _cancelLongTap() {
        clearTimeout(this.longTapTimeout);
    };
    
    _cancelSingleTap() {
        clearTimeout(this.singleTapTimeout);
    };
    
    private _swipeDirection( x1 : number, x2 : number, y1 : number, y2 : number ) : SwipeDirection {
        return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
    };

    on( evt : EventName, handler : Handler ) : void {
        if(this[evt]) {
            this[evt].add(handler);
        }
    };

    off( evt : EventName, handler : Handler ) : void {
        if(this[evt]) {
            this[evt].del(handler);
        }
    };

    destroy() : void {
        if(this.singleTapTimeout) clearTimeout(this.singleTapTimeout);
        if(this.tapTimeout) clearTimeout(this.tapTimeout);
        if(this.longTapTimeout) clearTimeout(this.longTapTimeout);
        if(this.swipeTimeout) clearTimeout(this.swipeTimeout);

        this.element.removeEventListener("touchstart", this.start);
        this.element.removeEventListener("touchmove", this.move);
        this.element.removeEventListener("touchend", this.end);
        this.element.removeEventListener("touchcancel", this.cancel);

        this.rotate.del();
        this.touchStart.del();
        this.multipointStart.del();
        this.multipointEnd.del();
        this.pinch.del();
        this.swipe.del();
        this.tap.del();
        this.doubleTap.del();
        this.longTap.del();
        this.singleTap.del();
        this.pressMove.del();
        this.twoFingerPressMove.del()
        this.touchMove.del();
        this.touchEnd.del();
        this.touchCancel.del();

        this.preV = this.pinchStartLen = this.zoom = this.isDoubleTap = this.delta = this.last = this.now = this.tapTimeout = this.singleTapTimeout = this.longTapTimeout = this.swipeTimeout = this.x1 = this.x2 = this.y1 = this.y2 = this.preTapPosition = this.rotate = this.touchStart = this.multipointStart = this.multipointEnd = this.pinch = this.swipe = this.tap = this.doubleTap = this.longTap = this.singleTap = this.pressMove = this.touchMove = this.touchEnd = this.touchCancel = this.twoFingerPressMove = null;

	// TODO: globalThis ??? 
        window.removeEventListener('scroll', this._cancelAllHandler);
        // return null;
    }; // END destroy
};

/*
    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = AlloyFinger;
    } else {
        window.AlloyFinger = AlloyFinger;
    }
*/
// }
