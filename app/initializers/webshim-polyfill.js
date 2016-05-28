import jQuery from 'jquery';
/* global webshim */

/*
 * load webshim polyfill
 * used for input[type='time']
 */
export function initialize() {
  /*
   * Fixes: TypeError: a.swap is not a function
   * https://github.com/aFarkas/webshim/issues/560#issuecomment-181543832
   */
  /* jscs:disable */
  if (typeof jQuery.swap !== 'function') {
    jQuery.swap = function( elem, options, callback, args ) {
      var ret, name, old = {};
      // Remember the old values, and insert the new ones
      for ( name in options ) {
        old[ name ] = elem.style[ name ];
        elem.style[ name ] = options[ name ];
      }

      ret = callback.apply( elem, args || [] );

      // Revert the old values
      for ( name in options ) {
        elem.style[ name ] = old[ name ];
      }
      return ret;
    };
  }
  /* jscs:enable */

  webshim.setOptions({
    waitReady: false
  });
  webshim.setOptions('forms-ext', {
    'widgets': {
      'nopicker': true
    }
  });
  webshim.polyfill('forms forms-ext');
}

export default {
  name: 'webshim-polyfill',
  initialize
};
