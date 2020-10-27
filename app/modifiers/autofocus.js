import { modifier } from 'ember-modifier';

export default modifier(function autofocus(element, params, { enabled = true }) {
  if (!enabled) {
    return;
  }

  element.focus();
});
