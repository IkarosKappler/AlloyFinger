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




## License
This content is released under the [MIT](http://opensource.org/licenses/MIT) License.
