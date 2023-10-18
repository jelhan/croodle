import Controller from '@ember/controller';
import sjcl from 'sjcl';

export default class PollErrorController extends Controller {
  get decryptionFailed() {
    return this.model instanceof sjcl.exception.corrupt;
  }

  get notFound() {
    return this.model.errors[0].status === '404';
  }
}
