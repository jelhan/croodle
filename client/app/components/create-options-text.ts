import templateOnlyComponent from '@ember/component/template-only';
import type { FormDataOption } from './create-options';
import type BsFormElementComponent from 'ember-bootstrap/components/bs-form/element';

interface CreateOptionsTextSignature {
  Args: {
    Named: {
      addOption: (value: string, afterPosition: number) => void;
      deleteOption: (option: FormDataOption) => void;
      formElement: BsFormElementComponent;
      options: FormDataOption[];
    };
  };
}

const CreateOptionsText = templateOnlyComponent<CreateOptionsTextSignature>();

export default CreateOptionsText;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CreateOptionsText: typeof CreateOptionsText;
  }
}
