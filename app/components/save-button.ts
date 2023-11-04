import templateOnlyComponent from '@ember/component/template-only';

interface SaveButtonSignature {
  Args: {
    Named: {
      isPending: boolean;
    };
  };
  Element: HTMLButtonElement;
}

const SaveButton = templateOnlyComponent<SaveButtonSignature>();

export default SaveButton;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    SaveButton: typeof SaveButton;
  }
}
