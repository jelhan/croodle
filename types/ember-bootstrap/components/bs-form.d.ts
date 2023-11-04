import { ComponentLike } from '@glint/template';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    BsForm: ComponentLike<{
      Args: {
        Named: {
          formLayout: 'horizontal' | 'vertical';
          model: unknown;
          onInvalid: () => void;
          onSubmit: () => void;
        };
      };
      Blocks: {
        default: [
          {
            element: ComponentLike<{
              Args: {
                Named: {
                  invisibleLabel?: boolean;
                  label?: string;
                  model?: unknown;
                  property?: string;
                };
              };
              Blocks: {
                default: [
                  {
                    control: ComponentLike<{
                      Args: {
                        Named: Record<string, unknown>;
                      };
                      Element: HTMLInputElement;
                    }>;
                    id: string;
                    value: unknown;
                  },
                ];
              };
              Element: HTMLDivElement;
            }>;
          },
        ];
      };
      Element: HTMLDivElement;
    }>;
  }
}
