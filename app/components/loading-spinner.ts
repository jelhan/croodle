import templateOnlyComponent from '@ember/component/template-only';

const LoadingSpinner = templateOnlyComponent();

export default LoadingSpinner;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    LoadingSpinner: typeof LoadingSpinner;
  }
}
