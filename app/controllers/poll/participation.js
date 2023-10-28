import Controller, { inject as controller } from '@ember/controller';
import User from '../../models/user';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class PollParticipationController extends Controller {
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
      let answer = answers.find(({ type }) => type === value);
      let { icon, label, labelTranslation, type } = answer;

      return {
        icon,
        label,
        labelTranslation,
        type,
      };
    });

    this.newUserRecord = {
      name,
      poll,
      selections,
    };
    await this.save();
  }

  @action
  async save() {
    const { model, newUserRecord: user } = this;
    const { poll } = model;
    const { encryptionKey } = this.router.currentRoute.parent.queryParams;

    try {
      await User.create(user, encryptionKey);

      this.savingFailed = false;
    } catch (error) {
      // couldn't save user model
      this.savingFailed = true;

      return;
    }

    this.router.transitionTo('poll.evaluation', poll.id, {
      queryParams: { encryptionKey },
    });
  }
}
