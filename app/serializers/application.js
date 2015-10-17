import DS from "ember-data";
import Ember from "ember";
/* global sjcl */

/*
 * extends DS.RESTSerializer to implement encryption
 * 
 * By default every attribute hash is encrypted using SJCL.
 * This is configurable by options parameter of DS.attr().
 *
 * Options:
 * - encrypted (boolean)
 *   If false the attribute won't be encrypted.
 * - includePlainOnCreate (string)
 *   If set the attribute will be included plain (not encrypted) when
 *   recorde is created. Value is the attributes name used.
 */
export default DS.RESTSerializer.extend({
  /*
   * implement decryption
   */
  normalize: function(modelClass, resourceHash, prop) {
    // work-a-round: get encryption key from dummy record
    var dummyRecord = this.store.createRecord('poll');
    var decryptionKey = dummyRecord.get('encryption.key');
    dummyRecord.destroyRecord();

    // run before serialization of attribute hash
    modelClass.eachAttribute(function(key, attributes) {
      if (
        attributes.options.encrypted !== false
      ) {
        if (typeof resourceHash[key] !== "undefined" && resourceHash[key] !== null) {
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
      }
    }, this);
    
    return this._super(modelClass, resourceHash, prop);
  },

  /*
   * implement encryption
   */
  serializeAttribute: function(snapshot, json, key, attribute) {
    this._super(snapshot, json, key, attribute);

    // get encryption key from snapshot which is model representation
    var encryptionKey = snapshot.record.get('encryption.key');

    // map includePlainOnCreate after serialization of attribute hash
    // but before encryption so we can just use the serialized hash
    if (
      !Ember.isEmpty(attribute.options.includePlainOnCreate) &&
      typeof attribute.options.includePlainOnCreate === 'string'
    ) {
      json[attribute.options.includePlainOnCreate] = json[key];
    }

    // encrypt after serialization of attribute hash
    if (
      attribute.options.encrypted !== false
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
