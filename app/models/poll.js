import Model, { hasMany, attr } from '@ember-data/model';
import { fragmentArray } from 'ember-data-model-fragments/attributes';
import { computed } from '@ember/object';
import { equal } from '@ember/object/computed';

export default Model.extend({
  /*
   * relationships
   */
  users: hasMany('user', { async: false }),

  /*
   * properties
   */
  // Is participation without user name possibile?
  anonymousUser: attr('boolean'),

  // array of possible answers
  answers: fragmentArray('answer'),

  // YesNo, YesNoMaybe or Freetext
  answerType: attr('string'),

  // ISO-8601 combined date and time string in UTC
  creationDate: attr('date'),

  // polls description
  description: attr('string', {
    defaultValue: ''
  }),

  // ISO 8601 date + time string in UTC
  expirationDate: attr('string', {
    includePlainOnCreate: 'serverExpirationDate'
  }),

  // Must all options been answered?
  forceAnswer: attr('boolean'),

  // array of polls options
  options: fragmentArray('option'),

  // FindADate or MakeAPoll
  pollType: attr('string'),

  // timezone poll got created in (like "Europe/Berlin")
  timezone: attr('string'),

  // polls title
  title: attr('string'),

  // Croodle version poll got created with
  version: attr('string', {
    encrypted: false
  }),

  /*
   * computed properties
   */
  hasTimes: computed('options.[]', function() {
    if (this.isMakeAPoll) {
      return false;
    }

    return this.options.any((option) => {
      let dayStringLength = 10; // 'YYYY-MM-DD'.length
      return option.title.length > dayStringLength;
    });
  }),

  isFindADate: equal('pollType', 'FindADate'),
  isFreeText: equal('answerType', 'FreeText'),
  isMakeAPoll: equal('pollType', 'MakeAPoll'),
});
