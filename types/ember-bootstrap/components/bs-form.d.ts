import { ComponentLike } from '@glint/template';
import type BsFormElementComponent from './bs-form/element';

type BsFormComponent = ComponentLike<{
  Args: {
    Named: {
      formLayout: 'horizontal' | 'vertical';
      model: unknown;
      onInvalid?: () => void;
      onSubmit: () => void;
    };
  };
  Blocks: {
    default: [
      {
        element: BsFormElementComponent;
        isSubmitting: boolean;
        submit: () => void;
      },
    ];
  };
  Element: HTMLDivElement;
}>;

export default BsFormComponent;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    BsForm: BsFormComponent;
  }
}
