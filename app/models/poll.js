import DS from "ember-data";

export default DS.Model.extend({
  // relationship
  users : DS.hasMany('user'),
  
  // properties
  title : DS.attr('string'),
  description : DS.attr('string'),
  pollType : DS.attr('string'),
  answerType: DS.attr('string'),
  answers : DS.attr('array'),
  options : DS.attr('array'),
  creationDate : DS.attr('date'),
  forceAnswer : DS.attr('boolean'),
  anonymousUser : DS.attr('boolean'),
  isDateTime : DS.attr('boolean'),
  timezone : DS.attr('string'),
  
  // expiration date is stored twice:
  // * encrypted to retrieve by clients
  // * unencrypted to use by server only
  expirationDate : DS.attr('string'),
  serverExpirationDate : DS.attr('string', {'encrypted': false}),
  
  version : DS.attr('string', {'encrypted': false}),
  
  // computed properties
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
