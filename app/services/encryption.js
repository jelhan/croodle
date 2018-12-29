import Service from '@ember/service';
import generatePassphrase from '../utils/generate-passphrase';
import sjcl from 'sjcl';

export default Service.extend({
  key: null,

  decrypt(value) {
    return JSON.parse(
      sjcl.decrypt(
        this.get('key'),
        value
      )
    );
  },

  encrypt(value) {
    return sjcl.encrypt(
      this.get('key'),
      JSON.stringify(value)
    );
  },

  generateKey() {
    const passphraseLength = 40;
    this.set('key', generatePassphrase(passphraseLength));
  },

  init() {
    this._super(...arguments);
  }
});
