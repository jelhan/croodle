import Modifier from 'ember-modifier';

export default class AutofocusModifier extends Modifier {
  isInstalled = false;

  modify(element, positional, { enabled = true }) {
    // element should be only autofocused on initial render
    // not when `enabled` option is invalidated
    if (this.isInstalled) {
      return;
    }
    this.isInstalled = true;

    if (!enabled) {
      return;
    }

    element.focus();
  }
}
