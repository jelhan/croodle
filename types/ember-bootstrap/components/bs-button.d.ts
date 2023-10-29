import { ComponentLike } from '@glint/template';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    BsButton: ComponentLike<{
      Args: {
        Named: {
          onClick?: () => void;
          type?: string;
        };
      };
      Blocks: {
        default: [];
      };
      Element: HTMLButtonElement;
    }>;
  }
}
