import templateOnlyComponent from '@ember/component/template-only';

interface NextButtonSignature {
  Args: {
    Named: {
      isPending: true;
    };
  };
  Element: HTMLButtonElement;
}

const NextButton = templateOnlyComponent<NextButtonSignature>();

export default NextButton;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    NextButton: typeof NextButton;
  }
}
