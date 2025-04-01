import { findElementWithAssert } from 'ember-cli-page-object';

export function hasFocus(selector, options = {}) {
  return {
    isDescriptor: true,

    get() {
      let [el] = findElementWithAssert(this, selector, options);
      let document = el.ownerDocument;
      return el === document.activeElement;
    },
  };
}
