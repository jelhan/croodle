import Ember from 'ember';
import DS from 'ember-data';
import {
  fragmentArray
} from 'ember-data-model-fragments/attributes';

const {
  attr,
  hasMany,
  Model
} = DS;

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
  isFindADate: Ember.computed('pollType', function() {
    return this.get('pollType') === 'FindADate';
  }),

  isFreeText: Ember.computed('answerType', function() {
    return this.get('answerType') === 'FreeText';
  }),

  isMakeAPoll: Ember.computed('pollType', function() {
    return this.get('pollType') === 'MakeAPoll';
  })
});
