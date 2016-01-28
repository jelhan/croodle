/* global webshim */

/*
 * load webshim polyfill
 * used for input[type='time']
 */
export function initialize() {
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
