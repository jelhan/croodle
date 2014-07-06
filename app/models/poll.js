export default DS.Model.extend({
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
    users : DS.hasMany('user', {async: true}),
    encryptedCreationDate : DS.attr('string'),
    creationDate : Ember.computed.encrypted('encryptedCreationDate', 'date'),
    encryptedForceAnswer : DS.attr('string'),
    forceAnswer : Ember.computed.encrypted('encryptedForceAnswer', 'boolean'),
    encryptedAnonymousUser : DS.attr('string'),
    anonymousUser : Ember.computed.encrypted('encryptedAnonymousUser', 'boolean'),
    
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