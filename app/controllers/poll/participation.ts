import Controller, { inject as controller } from '@ember/controller';
import User from '../../models/user';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type RouterService from '@ember/routing/router-service';
import type PollController from '../poll';
import type { PollParticipationRouteModel } from 'croodle/routes/poll/participation';
import type Poll from 'croodle/models/poll';
import type { SelectionInput } from 'croodle/models/selection';

export default class PollParticipationController extends Controller {
  @service declare router: RouterService;

  @controller('poll') declare pollController: PollController;

  declare model: PollParticipationRouteModel;

  @tracked name = '';
  @tracked savingFailed = false;

  newUserData: {
    name: string | null;
    poll: Poll;
    selections: SelectionInput[];
  } | null = null;

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
      const answer = answers.find(({ type }) => type === value);
      if (!answer) {
        throw new Error('Mapping selection to answer failed');
      }

      const { icon, labelTranslation, type } = answer;

      return {
        icon,
        labelTranslation,
        type,
      };
    });

    this.newUserData = {
      name,
      poll,
      selections,
    };
    await this.save();
  }

  @action
  async save() {
    const { model, newUserData: userData } = this;
    const { poll } = model;
    // As know that the route is `poll.participation`, which means that there
    // is a parent `poll` for sure.
    const { encryptionKey } = this.router.currentRoute.parent!.queryParams;

    if (!userData) {
      throw new Error(
        'save method called before submit method has set the user data',
      );
    }

    if (!encryptionKey) {
      throw new Error('Can not lookup encryption key');
    }

    try {
      await User.create(userData, encryptionKey);

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

  @action
  resetSavingStatus() {
    this.savingFailed = false;
  }
}
