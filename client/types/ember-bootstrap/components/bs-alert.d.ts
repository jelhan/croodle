import { ComponentLike } from '@glint/template';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    BsAlert: ComponentLike<{
      Args: {
        Named: {
          type: string;
        };
      };
      Blocks: {
        default: [];
      };
      Element: HTMLDivElement;
    }>;
  }
}
