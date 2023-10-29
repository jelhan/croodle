import { ComponentLike } from '@glint/template';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    BsModal: ComponentLike<{
      Args: {
        Named: {
          autoClose: boolean;
          closeButton: boolean;
          footer: boolean;
          keyboard: boolean;
          open: boolean;
          title: string;
        };
      };
      Blocks: {
        default: [
          {
            body: ComponentLike<{
              Blocks: {
                default: [];
              };
            }>;
            footer: ComponentLike<{
              Blocks: {
                default: [];
              };
            }>;
          },
        ];
      };
      Element: HTMLDivElement;
    }>;
  }
}
