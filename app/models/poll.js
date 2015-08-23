import DS from "ember-data";

export default DS.Model.extend({
  /*
   * relationships
   */
  users : DS.hasMany('user'),
  
  /*
   * properties
   */
  // Is participation without user name possibile?
  anonymousUser : DS.attr('boolean'),
  
  // array of possible answers
  answers : DS.attr('array'),

  // YesNo, YesNoMaybe or Freetext
  answerType: DS.attr('string'),

  // ISO-8601 combined date and time string in UTC
  creationDate : DS.attr('date'),

  // polls description
  description : DS.attr('string', {
    defaultValue: ''
  }),

  // ISO 8601 date + time string in UTC
  expirationDate : DS.attr('string', {
    includePlainOnCreate: 'serverExpirationDate'
  }),

  // Must all options been answered?
  forceAnswer : DS.attr('boolean'),

  // If poll type is FindADate: are options only dates or dates + times?
  isDateTime : DS.attr('boolean'),

  // array of polls options
  options : DS.attr('array'),

  // FindADate or MakeAPoll
  pollType : DS.attr('string'),

  // timezone poll got created in (like "Europe/Berlin")
  timezone : DS.attr('string'),

  // polls title
  title : DS.attr('string'),

  // Croodle version poll got created with
  version : DS.attr('string', {
    encrypted: false
  }),
  
  /*
   * computed properties
   */
  isFindADate: function() {
    return this.get('pollType') === 'FindADate';
  }.property('pollType'),
  
  isFreeText: function() {
    return this.get('answerType') === 'FreeText';
  }.property('answerType'),
  
  isMakeAPoll: function() {
    return this.get('pollType') === 'MakeAPoll';
  }.property('pollType'),
});
