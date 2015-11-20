import DS from "ember-data";
/* global MF */

export default DS.Model.extend({
  /*
   * relationship
   */
  poll : DS.belongsTo('poll'),

  /*
   * properties
   */
  // ISO 8601 date + time string
  creationDate : DS.attr('date'),

  // user name
  name : DS.attr('string'),

  // array of users selections
  // must be in same order as options property of poll
  selections : MF.fragmentArray('selection'),

  // Croodle version user got created with
  version : DS.attr('string', {
    encrypted: false
  })
});
