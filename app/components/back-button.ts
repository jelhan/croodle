import templateOnlyComponent from '@ember/component/template-only';

interface BackButtonSignature {
  Args: { onClick?: () => void };
  Element: HTMLButtonElement;
}

const BackButton = templateOnlyComponent<BackButtonSignature>();

export default BackButton;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    BackButton: typeof BackButton;
  }
}
