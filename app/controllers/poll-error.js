import Controller from '@ember/controller';
import sjcl from 'sjcl';
import { NotFoundError } from '../utils/api';

export default class PollErrorController extends Controller {
  get decryptionFailed() {
    return this.model instanceof sjcl.exception.corrupt;
  }

  get notFound() {
    return this.model instanceof NotFoundError;
  }
}
