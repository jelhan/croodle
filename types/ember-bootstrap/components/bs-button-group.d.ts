import { ComponentLike } from '@glint/template';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    BsButtonGroup: ComponentLike<{
      Args: {
        Named: {
          justified: boolean;
        };
      };
      Blocks: {
        default: [];
      };
      Element: HTMLDivElement;
    }>;
  }
}
