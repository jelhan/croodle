import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { equal } from '@ember/object/computed';
import sjcl from 'sjcl';

export default Controller.extend({
  decryptionFailed: computed('model', function() {
    return this.model instanceof sjcl.exception.corrupt;
  }),
  notFound: equal('model.errors.firstObject.status', '404')
});
