import Ember from 'ember';
/* global webshim */

/*
 * load webshim polyfill
 * used for input[type="time"]
 */
export function initialize(application) {
  let i18n = application.lookup('service:i18n');

  webshim.setOptions({
    waitReady: false,
  });
  webshim.setOptions("forms-ext", {
    "widgets": {
      "nopicker": true
    }
  });
  webshim.polyfill('forms forms-ext');
}

export default {
  name: 'webshim-polyfill',
  initialize
};
