import DS from "ember-data";
import Ember from "ember";

export default DS.Model.extend({
  // relationship
  users : DS.hasMany('user'),
  
  // properties
  encryptedTitle : DS.attr('string'),
  title : Ember.computed.encrypted('encryptedTitle', 'string'),
  
  encryptedDescription : DS.attr('string'),
  description: Ember.computed.encrypted('encryptedDescription', 'string'),
  
  encryptedPollType : DS.attr('string'),
  pollType : Ember.computed.encrypted('encryptedPollType', 'string'),
  
  encryptedAnswerType: DS.attr('string'),
  answerType : Ember.computed.encrypted('encryptedAnswerType', 'string'),
  
  encryptedAnswers : DS.attr('string'),
  answers : Ember.computed.encrypted('encryptedAnswers', 'array'),
  
  encryptedOptions : DS.attr('string'),
  options : Ember.computed.encrypted('encryptedOptions', 'array'),
  
  encryptedCreationDate : DS.attr('string'),
  creationDate : Ember.computed.encrypted('encryptedCreationDate', 'date'),
  
  encryptedForceAnswer : DS.attr('string'),
  forceAnswer : Ember.computed.encrypted('encryptedForceAnswer', 'boolean'),
  
  encryptedAnonymousUser : DS.attr('string'),
  anonymousUser : Ember.computed.encrypted('encryptedAnonymousUser', 'boolean'),
  
  encryptedIsDateTime : DS.attr('string'),
  isDateTime : Ember.computed.encrypted('encryptedIsDateTime', 'boolean'),
  
  encryptedTimezone : DS.attr('string'),
  timezone : Ember.computed.encrypted('encryptedTimezone', 'string'),

  encryptedExpirationDate : DS.attr('string'),
  expirationDate : Ember.computed.encrypted('encryptedExpirationDate', 'string'),

  // store expiration date unencrypted on create
  serverExpirationDate : DS.attr('string'),

  version : DS.attr('string'),
  
  // computed properties
  isFindADate: function() {
    return this.get('pollType') === 'FindADate';
  }.property('pollType'),
  
  isFreeText: function() {
    return this.get('answerType') === 'FreeText';
  }.property('answerType'),
  
  isMakeAPoll: function() {
    return this.get('pollType') === 'MakeAPoll';
  }.property('pollType')
});
