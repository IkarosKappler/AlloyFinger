### Prologue

This is the Typescript port of the useful AlloyFinger
touch library

→ [https://github.com/AlloyTeam/AlloyFinger/](https://github.com/AlloyTeam/AlloyFinger/)


# AlloyFinger-Typescript


## Install

You can install it via npm:

```html
npm install alloyfinger-typescript
```

## Usage

### Javascript (like in the original version)

```js
var af = new AlloyFinger(element, {
    touchStart: function () { },
    touchMove: function () { },
    touchEnd:  function () { },
    touchCancel: function () { },
    multipointStart: function () { },
    multipointEnd: function () { },
    tap: function () { },
    doubleTap: function () { },
    longTap: function () { },
    singleTap: function () { },
    rotate: function (evt) {
        console.log(evt.angle);
    },
    pinch: function (evt) {
        console.log(evt.zoom);
    },
    pressMove: function (evt) {
        console.log(evt.deltaX);
        console.log(evt.deltaY);
    },
    swipe: function (evt) {
        console.log("swipe" + evt.direction);
    }
});

/**
 * this method can also add or remove the event handler
 */
var onTap = function() {};

af.on('tap', onTap);
af.on('touchStart', function() {});

af.off('tap', onTap);

/**
 * this method can destroy the instance
 */
af = af.destroy();
```


### Typescript (this is new)
```typescript
import AlloyFinger, { TouchMoveEvent,
		      TouchPinchEvent,
		      TouchPressMoveEvent,
		      TouchRotateEvent,
		      TouchSwipeEvent } from "alloyfinger-typescript/src/ts/index";

new AlloyFinger( document.getElementsByTagName('body')[0], {
    touchStart: (_evt : TouchEvent) => 
	console.log('touchStart'),

    touchMove: (evt : TouchMoveEvent) =>
	console.log('touchMove', evt.deltaX.toFixed(4), evt.deltaY.toFixed(4)),
    
    touchEnd: (_evt: TouchEvent) =>
	console.log('touchEnd'),
    
    tap: (_evt : TouchEvent) =>
	console.log('tap'),

    doubleTap: (evt : TouchEvent) =>
	console.log('doubleTap', evt.touches[0].clientX.toFixed(4), evt.touches[0].clientY.toFixed(4)),
    
    longTap:  (_evt : TouchEvent) =>
	console.log('longTap'),

    singleTap: (_evt : TouchEvent) => 
	console.log('singleTap'),
    
    rotate: (evt : TouchRotateEvent) =>
	console.log('rotate', evt.angle ),
    
    pinch: (evt : TouchPinchEvent) =>
	console.log('pinch', evt.zoom),
    
    pressMove: (evt : TouchPressMoveEvent) =>
	console.log('pressMove', evt.deltaX.toFixed(4), evt.deltaY.toFixed(4)),
    
    swipe: (evt : TouchSwipeEvent) =>
	console.log('swipe', evt.direction ),

    multipointStart: (_evt : TouchEvent) =>
	console.log('multiPointStart'),
    
    multipointEnd: (_evt : TouchEvent) =>
	console.log('multiPointEnd'),
    
    twoFingerPressMove:  (evt: TouchPressMoveEvent) =>
	console.log('twoFingerPressMove', evt.deltaX.toFixed(4), evt.deltaY.toFixed(4)),

    touchCancel: (_evt : TouchEvent) =>
	console.log('touchEnd')
} );
```


Have fun and do good!


## License
This content is released under the [MIT](http://opensource.org/licenses/MIT) License.



### Credits
* AlloyTeam for the js-code.
* Jack Franklin for then [howto-module-tutorial](https://blog.logrocket.com/publishing-node-modules-typescript-es-modules/)
