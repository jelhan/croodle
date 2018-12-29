import { computed } from '@ember/object';
import Controller from '@ember/controller';

export default Controller.extend({
  isDecryptionError: computed('model.type', function() {
    return this.get('model.type') === 'decryption-failed';
  })
});
