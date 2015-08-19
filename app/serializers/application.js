import DS from "ember-data";
/* global sjcl, Croodle */

export default DS.RESTSerializer.extend({
  normalize: function(modelClass, resourceHash, prop) {
    // decrypt before unserialize
    var decryptionKey = Croodle.registry['lookup']('controller:poll').get('encryption.key');
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
    var encryptionKey = Croodle.registry['lookup']('controller:poll').get('encryption.key');
    if (
      attributes.options.encrypted !== false
    ) {
      try {
        json[key] = sjcl.encrypt(encryptionKey, JSON.stringify(json[key]));
      }
      catch(err) {
        throw "encryption failed with key: " + encryptionKey;
      }
    }
  }
});
