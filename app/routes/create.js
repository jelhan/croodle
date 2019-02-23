import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import config from 'croodle/config/environment';
import answersForAnswerType from 'croodle/utils/answers-for-answer-type';
/* global moment */

export default Route.extend({
  beforeModel(transition) {
    // enforce that wizzard is started at create.index
    if (transition.targetName !== 'create.index') {
      this.transitionTo('create.index');
    }

    // set encryption key
    this.encryption.generateKey();
  },

  encryption: service(),

  model() {
    // create empty poll
    return this.store.createRecord('poll', {
      answerType: 'YesNo',
      answers: answersForAnswerType('YesNo'),
      creationDate: new Date(),
      forceAnswer: true,
      anonymousUser: false,
      pollType: 'FindADate',
      timezone: null,
      expirationDate: moment().add(3, 'month').toISOString(),
      version: config.APP.version,
    });
  }
});
