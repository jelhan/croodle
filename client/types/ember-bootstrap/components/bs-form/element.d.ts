import { ComponentLike } from '@glint/template';

type BsFormElementComponent = ComponentLike<{
  Args: {
    Named: {
      controlType?: 'checkbox' | 'select' | 'text' | 'textarea' | 'time';
      invisibleLabel?: boolean;
      label?: string;
      model?: unknown;
      property?: string;
      showValidationOn?: string | string[];
      useIcons?: boolean;
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
        setValue: (value: unknown) => void;
        validation: 'success' | 'error' | 'warning' | null;
        value: unknown;
      },
    ];
  };
  Element: HTMLDivElement;
}>;

export default BsFormElementComponent;
