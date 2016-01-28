import Ember from 'ember';

export default Ember.Controller.extend({
  isDecryptionError: Ember.computed('model.type', function() {
    return this.get('model.type') === 'decryption-failed';
  })
});
