import DS from 'ember-data';
import Ember from 'ember';

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
  isNewSerializerAPI: true,

  encryption: Ember.inject.service(),

  /*
   * implement decryption
   */
  normalize(modelClass, resourceHash, prop) {

    // run before serialization of attribute hash
    modelClass.eachAttribute(function(key, attributes) {
      if (
        attributes.options.encrypted !== false
      ) {
        if (typeof resourceHash[key] !== 'undefined' && resourceHash[key] !== null) {
          resourceHash[key] = this.get('encryption').decrypt(resourceHash[key]);
        }
      }
    }, this);

    // run legacy support transformation specified in model serializer
    if (typeof this.legacySupport === 'function') {
      resourceHash = this.legacySupport(resourceHash);
    }

    return this._super(modelClass, resourceHash, prop);
  },

  /*
   * implement encryption
   */
  serializeAttribute(snapshot, json, key, attribute) {
    this._super(snapshot, json, key, attribute);

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
      json[key] = this.get('encryption').encrypt(json[key]);
    }
  }
});
