import Ember from "ember";
/* global moment */

export default Ember.Route.extend({
  beforeModel: function(){
    // set encryption key
    this.get('encryption').generateKey();
  },

  encryption: Ember.inject.service(),
  encryptionKey: Ember.computed.alias('encryption.key'),

  events: {
    transitionToPoll: function(poll){
      this.transitionTo('poll', poll, {
        queryParams: {
          encryptionKey: this.get('encryptionKey')
        }
      });
    }
  },

  model: function(){
    // create empty poll
    return this.store.createRecord('poll', {
      answerType: 'YesNo',
      creationDate : new Date(),
      forceAnswer: true,
      anonymousUser: false,
      datetime: false,
      datetimesInputFields: 2,
      isDateTime: false,
      pollType: 'FindADate',
      timezone: '',
      expirationDate: moment().add(3, 'month').toISOString(),
      version: this.buildInfo.semver
    });
  }
});
