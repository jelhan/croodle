import DS from "ember-data";
/* global sjcl */

export default DS.RESTSerializer.extend({
  normalize: function(modelClass, resourceHash, prop) {
    // decrypt before unserialize
    var dummyRecord = this.store.createRecord('poll');
    var decryptionKey = dummyRecord.get('encryption.key');
    dummyRecord.destroyRecord();
    modelClass.eachAttribute(function(key, attributes) {
      if (
        attributes.options.encrypted !== false
      ) {
        try {
          resourceHash[key] = JSON.parse(
            sjcl.decrypt(decryptionKey, resourceHash[key])
          );
        }
        catch (err) {
          throw {
            type: "decryption-failed",
            message: "decryption failed for " + key + " using key " + decryptionKey,
            original: err
          };
        }
      }
    }, this);
    
    return this._super(modelClass, resourceHash, prop);
  },
  
  serializeAttribute: function(snapshot, json, key, attributes) {
    this._super(snapshot, json, key, attributes);

    // encrypt after serialize
    var encryptionKey = snapshot.record.get('encryption.key');
    if (
      attributes.options.encrypted !== false
    ) {
      try {
        json[key] = sjcl.encrypt(encryptionKey, JSON.stringify(json[key]));
      }
      catch(err) {
        throw {
          type: 'encryption-failed',
          message: "encryption failed with key: " + encryptionKey,
          original: err
        };
      }
    }
  }
});
