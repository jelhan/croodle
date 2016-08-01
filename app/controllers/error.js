import Ember from 'ember';

const { computed, Controller } = Ember;

export default Controller.extend({
  isDecryptionError: computed('model.type', function() {
    return this.get('model.type') === 'decryption-failed';
  })
});
