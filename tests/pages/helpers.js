import { findElement } from 'ember-cli-page-object';
import jQuery from 'jquery';

/*
 * In Webkit `.is(':focus')` is `false` if document hasn't focus
 * which is often the cases in testing and for sure for all test runs in phantomjs.
 * Using el === document.activeElement as a work-a-round.
 * Background: https://github.com/ariya/phantomjs/issues/10427
 */

export function hasFocus(selector, options = {}) {
  return {
    isDescriptor: true,

    get() {
      let [ el ] = findElement(this, selector, options);
      let document = el.ownerDocument;
      return jQuery(el).is(':focus') || el === document.activeElement;
    }
  };
}
