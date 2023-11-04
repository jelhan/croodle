import { ComponentLike } from '@glint/template';

type BsFormElementComponent = ComponentLike<{
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

export default BsFormElementComponent;
