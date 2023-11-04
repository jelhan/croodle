import { ComponentLike } from '@glint/template';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    BsModal: ComponentLike<{
      Args: {
        Named: {
          autoClose?: boolean;
          closeButton?: boolean;
          footer?: boolean;
          keyboard?: boolean;
          onHidden?: () => void;
          onSubmit?: () => void;
          open: boolean;
          title?: string;
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
            close: () => void;
            header: ComponentLike<{
              Args: {
                closeButton: boolean;
                title: string;
              };
            }>;
            footer: ComponentLike<{
              Blocks: {
                default: [];
              };
            }>;
            submit: () => void;
          },
        ];
      };
      Element: HTMLDivElement;
    }>;
  }
}
