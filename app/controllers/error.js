import Ember from 'ember';

export default Ember.Controller.extend({
  isDecryptionError: function(){
    return this.get('model.type') === 'decryption-failed';
  }.property('model.type')
});
