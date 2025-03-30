import { helper } from '@ember/component/helper';

const noop = helper(() => {
  return () => {};
});

export default noop;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    noop: typeof noop;
  }
}
