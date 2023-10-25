import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import config from 'croodle/config/environment';
import { DateTime } from 'luxon';

@classic
export default class CreateRoute extends Route {
  @service encryption;
  @service router;
  @service store;

  beforeModel(transition) {
    // enforce that wizzard is started at create.index
    if (transition.targetName !== 'create.index') {
      this.router.transitionTo('create.index');
    }

    // set encryption key
    this.encryption.generateKey();
  }

  model() {
    // create empty poll
    return this.store.createRecord('poll', {
      answerType: 'YesNo',
      creationDate: new Date(),
      forceAnswer: true,
      anonymousUser: false,
      pollType: 'FindADate',
      timezone: null,
      expirationDate: DateTime.local().plus({ months: 3 }).toISO(),
      version: config.APP.version,
    });
  }

  activate() {
    let controller = this.controllerFor(this.routeName);
    controller.listenForStepChanges();
  }

  deactivate() {
    let controller = this.controllerFor(this.routeName);
    controller.clearListenerForStepChanges();
  }
}
