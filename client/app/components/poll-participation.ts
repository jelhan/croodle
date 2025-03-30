import Component from '@glimmer/component';
import User from '../models/user';
import type { PollParticipationRouteModel } from 'croodle/routes/poll/participation';
import type RouterService from '@ember/routing/router-service';
import type Poll from 'croodle/models/poll';
import type Option from 'croodle/models/option';
import type { SelectionInput } from 'croodle/models/selection';
import type PollSettingsService from 'croodle/services/poll-settings';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { TrackedArray } from 'tracked-built-ins';
import IntlMessage from 'croodle/utils/intl-message';

class FormDataSelections {
  @tracked value = null;
  valueIsRequired;

  get valueValidation() {
    const { value, valueIsRequired } = this;

    if (!value && valueIsRequired) {
      return new IntlMessage('poll.error.selection.valueMissing');
    }

    return null;
  }

  get isValid() {
    return this.valueValidation === null;
  }

  constructor(valueIsRequired: boolean) {
    this.valueIsRequired = valueIsRequired;
  }
}

class FormData {
  @tracked name: null | string = null;
  nameIsRequired;
  namesTaken;
  selections;

  get nameValidation() {
    const { name, nameIsRequired, namesTaken } = this;

    if (!name && nameIsRequired) {
      return new IntlMessage('poll.error.name.valueMissing');
    }

    if (name && namesTaken.includes(name)) {
      return new IntlMessage('poll.error.name.duplicate');
    }

    return null;
  }

  get selectionsValidation() {
    const isValid = this.selections.every((selection) => selection.isValid);

    if (!isValid) {
      return new IntlMessage('poll.error.newUser.everyOptionIsAnswered');
    }

    return null;
  }

  constructor(
    options: Option[],
    {
      nameIsRequired,
      namesTaken,
      selectionIsRequired,
    }: {
      nameIsRequired: boolean;
      namesTaken: string[];
      selectionIsRequired: boolean;
    },
  ) {
    this.nameIsRequired = nameIsRequired;
    this.namesTaken = namesTaken;
    this.selections = new TrackedArray(
      options.map(() => new FormDataSelections(selectionIsRequired)),
    );
  }
}

export interface PollParticipationSignature {
  // The arguments accepted by the component
  Args: {
    poll: PollParticipationRouteModel;
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

  formData = new FormData(this.args.poll.options, {
    nameIsRequired: !this.args.poll.anonymousUser,
    namesTaken: this.args.poll.users
      .map(({ name }) => name)
      .filter((_) => _ !== null),
    selectionIsRequired: this.args.poll.forceAnswer,
  });

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
    const { args, formData } = this;
    const { poll } = args;
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
    } catch {
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
