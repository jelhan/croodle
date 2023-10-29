import { ComponentLike } from '@glint/template';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CopyButton: ComponentLike<{
      Args: {
        Named: {
          onError: () => void;
          onSuccess: () => void;
          text: string;
        };
      };
      Blocks: {
        default: [];
      };
      Element: HTMLButtonElement;
    }>;
  }
}
