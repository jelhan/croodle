import Ember from 'ember';
import generatePassphrase from '../utils/generate-passphrase';
/* global sjcl */

export default Ember.Service.extend({
  key: null,

  generateKey() {
    var passphraseLength = 40;
    this.set('key', generatePassphrase(passphraseLength));
  },

  // ToDo: do not send a sha256 hash of encryption key without salt to server!
  hash: Ember.computed('key', function() {
    return sjcl.codec.hex.fromBits(
      sjcl.hash.sha256.hash(this.get('key'))
    );
  }),

  init() {
    this._super(...arguments);
  }
});
