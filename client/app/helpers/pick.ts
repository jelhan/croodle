import { helper } from '@ember/component/helper';
import { get } from '@ember/object';

const pick = helper(
  ([path, action]: [path: string, action: (_: unknown) => unknown]): ((
    event: Event,
  ) => void) => {
    return function (event: Event) {
      const value = get(event, path);

      action(value);
    };
  },
);

export default pick;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    pick: typeof pick;
  }
}
