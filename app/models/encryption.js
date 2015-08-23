import Ember from "ember";
/* global sjcl */

export default Ember.Object.extend({
  key : '',
  isSet: false,
  // sha256 hash of encryption key
  hash: Ember.computed('key', function() {
    return sjcl.codec.hex.fromBits(
      sjcl.hash.sha256.hash('test')
    );
  })
});
