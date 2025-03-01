import Component from '@glimmer/component';
import sjcl from 'sjcl';
import { NotFoundError } from '../utils/api';

export interface PollErrorSignature {
  // The arguments accepted by the component
  Args: {
    error: unknown;
  };
  // Any blocks yielded by the component
  Blocks: {
    default: [];
  };
  // The element to which `...attributes` is applied in the component template
  Element: null;
}

export default class PollError extends Component<PollErrorSignature> {
  get decryptionFailed() {
    const { error } = this.args;

    return error instanceof sjcl.exception.corrupt;
  }

  get notFound() {
    const { error } = this.args;

    return error instanceof NotFoundError;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    PollError: typeof PollError;
  }
}
