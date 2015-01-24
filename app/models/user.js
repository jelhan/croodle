import DS from "ember-data";
import Ember from "ember";

export default DS.Model.extend({
  // relationship
  poll : DS.belongsTo('poll'),

  // properties
  encryptedName : DS.attr('string'),
  name : Ember.computed.encrypted('encryptedName', 'string'),

  encryptedSelections : DS.attr('string'),
  selections : Ember.computed.encrypted('encryptedSelections', 'array'),

  encryptedCreationDate : DS.attr('string'),
  creationDate : Ember.computed.encrypted('encryptedCreationDate', 'date'),

  version : DS.attr('string')
});