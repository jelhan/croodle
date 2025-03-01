import Component from '@glimmer/component';
import User from '../models/user';
import type { PollParticipationRouteModel } from 'croodle/routes/poll/participation';
import type RouterService from '@ember/routing/router-service';
import type Poll from 'croodle/models/poll';
import type { SelectionInput } from 'croodle/models/selection';
import type PollSettingsService from 'croodle/services/poll-settings';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export interface PollParticipationSignature {
  // The arguments accepted by the component
  Args: {
    formData: PollParticipationRouteModel['formData'];
    poll: PollParticipationRouteModel['poll'];
  };
  // Any blocks yielded by the component
  Blocks: {
    default: [];
  };
  // The element to which `...attributes` is applied in the component template
  Element: null;
}

export default class PollParticipation extends Component<PollParticipationSignature> {
  @service('poll-settings') declare pollSettingsService: PollSettingsService;
  @service declare router: RouterService;

  @tracked name = '';
  @tracked savingFailed = false;

  newUserData: {
    name: string | null;
    poll: Poll;
    selections: SelectionInput[];
  } | null = null;

  get pollSettings() {
    const { poll } = this.args;

    return this.pollSettingsService.getSettings(poll);
  }

  @action
  async submit() {
    const { formData, poll } = this.args;
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
    const { newUserData: userData } = this;
    const { poll } = this.args;
    // As know that the route is `poll.participation`, which means that there
    // is a parent `poll` for sure.
    const { encryptionKey } = this.router.currentRoute?.parent?.queryParams as {
      encryptionKey: string;
    };

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

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    PollParticipation: typeof PollParticipation;
  }
}
