import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import { equal } from '@ember/object/computed';
import Controller from '@ember/controller';
import sjcl from 'sjcl';

@classic
export default class PollErrorController extends Controller {
  @computed('model')
  get decryptionFailed() {
    return this.model instanceof sjcl.exception.corrupt;
  }

  @equal('model.errors.firstObject.status', '404')
  notFound;
}
