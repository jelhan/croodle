import DS from "ember-data";

export default DS.Model.extend({
  // relationship
  poll : DS.belongsTo('poll'),
  
  // properties
  name : DS.attr('string'),
  selections : DS.attr('array'),
  creationDate : DS.attr('date'),
  version : DS.attr('string', {encrypted: false})
});
