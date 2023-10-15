import Controller, { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import config from 'croodle/config/environment';
import { tracked } from '@glimmer/tracking';

export default class PollParticipationController extends Controller {
  @service encryption;
  @service router;

  @controller('poll')
  pollController;

  @tracked name = '';
  @tracked savingFailed = false;

  @action
  async submit() {
    const { formData, poll } = this.model;
    const { name } = formData;
    const { answers, isFreeText } = poll;
    const selections = formData.selections.map(({ value }) => {
      if (value === null) {
        return {};
      }

      if (isFreeText) {
        return {
          label: value,
        };
      }

      // map selection to answer if it's not freetext
      let answer = answers.findBy('type', value);
      let { icon, label, labelTranslation, type } = answer;

      return {
        icon,
        label,
        labelTranslation,
        type,
      };
    });

    let user = this.store.createRecord('user', {
      creationDate: new Date(),
      name,
      poll,
      selections,
      version: config.APP.version,
    });

    this.newUserRecord = user;
    await this.save(user);
  }

  @action
  async save() {
    const { model, newUserRecord: user } = this;
    const { poll } = model;

    try {
      await user.save();

      this.savingFailed = false;
    } catch (error) {
      // couldn't save user model
      this.savingFailed = true;

      return;
    }

    this.router.transitionTo('poll.evaluation', poll.id, {
      queryParams: { encryptionKey: this.encryption.key },
    });
  }
}
