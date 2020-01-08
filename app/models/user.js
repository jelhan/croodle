import Model, { belongsTo, attr } from '@ember-data/model';
import {
  fragmentArray
} from 'ember-data-model-fragments/attributes';

export default Model.extend({
  /*
   * relationship
   */
  poll: belongsTo('poll'),

  /*
   * properties
   */
  // ISO 8601 date + time string
  creationDate: attr('date'),

  // user name
  name: attr('string'),

  // array of users selections
  // must be in same order as options property of poll
  selections: fragmentArray('selection'),

  // Croodle version user got created with
  version: attr('string', {
    encrypted: false
  })
});
