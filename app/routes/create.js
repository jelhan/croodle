import Ember from 'ember';
/* global moment */

export default Ember.Route.extend({
  actions: {
    transitionToPoll(poll) {
      this.transitionTo('poll', poll, {
        queryParams: {
          encryptionKey: this.get('encryptionKey')
        }
      });
    }
  },

  beforeModel(transition) {
    // enforce that wizzard is started at create.index
    if (transition.targetName !== 'create.index') {
      this.transitionTo('create.index');
    }

    // set encryption key
    this.get('encryption').generateKey();
  },

  encryption: Ember.inject.service(),
  encryptionKey: Ember.computed.alias('encryption.key'),

  model() {
    // create empty poll
    return this.store.createRecord('poll', {
      answerType: 'YesNo',
      creationDate: new Date(),
      forceAnswer: true,
      anonymousUser: false,
      pollType: 'FindADate',
      timezone: null,
      expirationDate: moment().add(3, 'month').toISOString(),
      version: this.buildInfo.semver
    });
  }
});
