/**
 * TypeScript port by Ikaros Kappler.
 *
 * Original file from https://github.com/AlloyTeam/AlloyFinger
 *
 * @date 2021-02-10
 */

import { AlloyFinger } from './alloy_finger';


new AlloyFinger( document.getElementsByTagName('body')[0], {
    touchStart: ( _evt : TouchEvent ) => { console.log('touchStart') }
} );
