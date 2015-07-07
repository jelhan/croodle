import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';
/* global sjcl */
/* global webshim */

// decrypt / encrypt computed property helper
Ember.computed.encrypted = function(encryptedField, dataType) {
  return Ember.computed(encryptedField, function(key, decryptedValue) {
    var encryptKey = this.get('encryption.key'),
        encryptedValue,
        decryptedJSON,
        encryptedJSON;

    // check if encryptKey is set
    if (Ember.isEmpty(encryptKey)) {
      return null;
    }

    // setter
    if (arguments.length === 2) {
      decryptedJSON = JSON.stringify(decryptedValue);
      
      encryptedValue = Ember.isNone(decryptedValue) ? null : String(sjcl.encrypt(encryptKey , decryptedJSON));
      this.set(encryptedField, encryptedValue);
    }
    
    // get value of field to decrypt
    encryptedJSON = this.get(encryptedField);
    
    // check if encryptedField is defined and not null
    if ( typeof encryptedJSON === 'undefined' ||
         encryptedJSON === null
       ) {
      return null;
    }

    // try to decrypt value
    try {
      decryptedJSON = sjcl.decrypt(encryptKey, encryptedJSON);
      decryptedValue = JSON.parse(decryptedJSON);
    } catch (e) {
      throw new Ember.Error("Decryption failed. Please double check the url.");
    }
    
    switch (dataType) {
      case 'array':
        return Ember.isNone(decryptedValue) ? null : decryptedValue;
      
      case 'date':
        // https://github.com/emberjs/data/blob/master/packages/ember-data/lib/transforms/date.js
        if (typeof decryptedValue === "string") {
          return new Date(Ember.Date.parse(decryptedValue));
        } else if (typeof decryptedValue === "number") {
          return new Date(decryptedValue);
        } else if (decryptedValue === null || decryptedValue === undefined) {
          // if the value is not present in the data,
          // return undefined, not null.
          return decryptedValue;
        }
        return null;
      
      case 'number':
        // https://github.com/emberjs/data/blob/master/packages/ember-data/lib/transforms/number.js
        return Ember.isNone(decryptedValue) ? null : Number(decryptedValue);
      
      case 'string':
        // https://github.com/emberjs/data/blob/master/packages/ember-data/lib/transforms/string.js
        return Ember.isNone(decryptedValue) ? null : String(decryptedValue);
          
      case 'boolean':
        // https://github.com/emberjs/data/blob/master/packages/ember-data/lib/transforms/boolean.js
        if (typeof decryptedValue === "boolean") {
          return decryptedValue;
        } else if (typeof decryptedValue === "string") {
          return decryptedValue.match(/^true$|^t$|^1$/i) !== null;
        } else if (typeof decryptedValue === "number") {
          return decryptedValue === 1;
        } else {
          return false;
        }
    }
  });
};

var App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
});

import formattedDateHelper from 'croodle/helpers/formatted-date';
Ember.Handlebars.registerBoundHelper('formattedDate', formattedDateHelper);

loadInitializers(App, config.modulePrefix);

webshim.polyfill('forms forms-ext');

export default App;
