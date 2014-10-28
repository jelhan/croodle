import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';

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
        if (typeof encryptedJSON === 'undefined' ||
                encryptedJSON === null) {
            return null;
        }

        // try to decrypt value
        try {
            decryptedJSON = sjcl.decrypt(encryptKey, encryptedJSON);
            decryptedValue = JSON.parse(decryptedJSON);
        } catch (e) {
            // TODO: should throw an error
            decryptedValue = '';
        }
        
        switch (dataType) {
            case 'array':
                return Ember.isNone(decryptedValue) ? null : decryptedValue;
            
            case 'date':
                // https://github.com/emberjs/data/blob/master/packages/ember-data/lib/transforms/date.js
                var type = typeof decryptedValue;
                if (type === "string") {
                  return new Date(Ember.Date.parse(decryptedValue));
                } else if (type === "number") {
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
                var type = typeof decryptedValue;
                if (type === "boolean") {
                  return decryptedValue;
                } else if (type === "string") {
                  return decryptedValue.match(/^true$|^t$|^1$/i) !== null;
                } else if (type === "number") {
                  return decryptedValue === 1;
                } else {
                  return false;
                }
        }
    });
};

var App = Ember.Application.extend({
  modulePrefix: 'croodle', // TODO: loaded via config
  Resolver: Resolver
});

import extendTextField from 'croodle/ext/text-field';
extendTextField();

import formattedDateHelper from 'croodle/helpers/formatted-date';
Ember.Handlebars.registerBoundHelper('formattedDate', formattedDateHelper);

loadInitializers(App, 'croodle');

export default App;
