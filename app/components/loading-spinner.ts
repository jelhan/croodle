import templateOnlyComponent from '@ember/component/template-only';

interface LoadingSpinnerSignature {}

const LoadingSpinner = templateOnlyComponent<LoadingSpinnerSignature>();

export default LoadingSpinner;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    LoadingSpinner: typeof LoadingSpinner;
  }
}
