import Ember from 'ember';
import generatePassphrase from '../utils/generate-passphrase';
/* global sjcl */

export default Ember.Service.extend({
  key: null,

  generateKey() {
    var passphraseLength = 40;
    this.set('key', generatePassphrase(passphraseLength));
  },

  init() {
    this._super(...arguments);
  }
});
