import classic from 'ember-classic-decorator';
import Model, { belongsTo, attr } from '@ember-data/model';
import {
  fragmentArray
} from 'ember-data-model-fragments/attributes';

@classic
export default class User extends Model {
  /*
   * relationship
   */
  @belongsTo('poll')
  poll;

  /*
   * properties
   */
  // ISO 8601 date + time string
  @attr('date')
  creationDate;

  // user name
  @attr('string')
  name;

  // array of users selections
  // must be in same order as options property of poll
  @fragmentArray('selection')
  selections;

  // Croodle version user got created with
  @attr('string', {
    encrypted: false
  })
  version;
}
