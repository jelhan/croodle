import Modifier from 'ember-modifier';

type Named = {
  enabled: boolean;
};

interface AutofocusModifierSignature {
  Element: HTMLInputElement;
  Args: {
    Named: Named;
  };
}

export default class AutofocusModifier extends Modifier<AutofocusModifierSignature> {
  isInstalled = false;

  modify(element: HTMLInputElement, _: [], { enabled = true }: Named) {
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
