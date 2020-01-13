import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import { equal } from '@ember/object/computed';
import Model, { hasMany, attr } from '@ember-data/model';
import { fragmentArray } from 'ember-data-model-fragments/attributes';

@classic
export default class Poll extends Model {
  /*
   * relationships
   */
  @hasMany('user', { async: false })
  users;

  /*
   * properties
   */
  // Is participation without user name possibile?
  @attr('boolean')
  anonymousUser;

  // array of possible answers
  @fragmentArray('answer')
  answers;

  // YesNo, YesNoMaybe or Freetext
  @attr('string')
  answerType;

  // ISO-8601 combined date and time string in UTC
  @attr('date')
  creationDate;

  // polls description
  @attr('string', {
    defaultValue: ''
  })
  description;

  // ISO 8601 date + time string in UTC
  @attr('string', {
    includePlainOnCreate: 'serverExpirationDate'
  })
  expirationDate;

  // Must all options been answered?
  @attr('boolean')
  forceAnswer;

  // array of polls options
  @fragmentArray('option')
  options;

  // FindADate or MakeAPoll
  @attr('string')
  pollType;

  // timezone poll got created in (like "Europe/Berlin")
  @attr('string')
  timezone;

  // polls title
  @attr('string')
  title;

  // Croodle version poll got created with
  @attr('string', {
    encrypted: false
  })
  version;

  /*
   * computed properties
   */
  @computed('options.[]')
  get hasTimes() {
    if (this.isMakeAPoll) {
      return false;
    }

    return this.options.any((option) => {
      let dayStringLength = 10; // 'YYYY-MM-DD'.length
      return option.title.length > dayStringLength;
    });
  }

  @equal('pollType', 'FindADate')
  isFindADate;

  @equal('answerType', 'FreeText')
  isFreeText;

  @equal('pollType', 'MakeAPoll')
  isMakeAPoll;
}
