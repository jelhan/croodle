import Route from '@ember/routing/route';
import { tracked } from '@glimmer/tracking';
import { TrackedArray } from 'tracked-built-ins';
import IntlMessage from 'croodle/utils/intl-message';
import type Poll from 'croodle/models/poll';
import type Option from 'croodle/models/option';

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

export default class ParticipationRoute extends Route {
  model() {
    const poll = this.modelFor('poll') as Poll;
    const { anonymousUser, forceAnswer, options, users } = poll;
    const formData = new FormData(options, {
      nameIsRequired: !anonymousUser,
      namesTaken: users.map(({ name }) => name),
      selectionIsRequired: forceAnswer,
    });

    return {
      formData,
      poll,
    };
  }
}
