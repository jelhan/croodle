import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { TrackedArray, TrackedSet } from 'tracked-built-ins';
import IntlMessage from '../utils/intl-message';
import { tracked } from '@glimmer/tracking';
import type RouterService from '@ember/routing/router-service';
import type { CreateOptionsRouteModel } from '../routes/create/options';
import type Transition from '@ember/routing/transition';
import type Owner from '@ember/owner';

export class FormDataOption {
  @tracked value;
  formData;

  get valueValidation() {
    const { formData, value } = this;

    // Every option must have a label
    if (!value) {
      return new IntlMessage('create.options.error.valueMissing');
    }

    // Options must be unique. There must not be another option having the
    // same value before
    const isUnique = !formData.options
      .slice(0, this.formData.options.indexOf(this))
      .some((option) => option.value === this.value);
    if (!isUnique) {
      return new IntlMessage('create.options.error.duplicatedOption');
    }

    return null;
  }

  get isValid() {
    return this.valueValidation === null;
  }

  constructor(formData: FormData, value: string) {
    this.formData = formData;
    this.value = value;
  }
}

class FormData {
  @tracked options;

  get optionsValidation() {
    const { options } = this;

    if (options.length < 1) {
      // UI enforces that there is at least one option if poll type is `MakeAPoll`.
      // This validation error can only happen if poll type is `FindADate`.
      return new IntlMessage('create.options.error.notEnoughDates');
    }

    if (options.some((option) => !option.isValid)) {
      return new IntlMessage('create.options.error.invalidOption');
    }

    return null;
  }

  @action
  updateOptions(values: string[]) {
    this.options = new TrackedArray(
      values.map((value) => new FormDataOption(this, value)),
    );
  }

  @action
  addOption(value: string, afterPosition = this.options.length - 1) {
    const option = new FormDataOption(this, value);

    this.options.splice(afterPosition + 1, 0, option);
  }

  @action
  deleteOption(option: FormDataOption) {
    this.options.splice(this.options.indexOf(option), 1);
  }

  constructor(
    { options }: { options: Set<string> },
    { defaultOptionCount }: { defaultOptionCount: number },
  ) {
    const normalizedOptions =
      options.size === 0 && defaultOptionCount > 0
        ? ['', '']
        : Array.from(options);

    this.options = new TrackedArray(
      normalizedOptions.map((value) => new FormDataOption(this, value)),
    );
  }
}

export interface CreateOptionsSignature {
  Args: {
    poll: CreateOptionsRouteModel;
  };
}

export default class CreateOptions extends Component<CreateOptionsSignature> {
  @service declare router: RouterService;

  formData = new FormData(
    { options: this.options },
    { defaultOptionCount: this.args.poll.pollType === 'MakeAPoll' ? 2 : 0 },
  );

  get options() {
    const { poll } = this.args;
    const { dateOptions, freetextOptions, pollType } = poll;

    return pollType === 'FindADate' ? dateOptions : freetextOptions;
  }

  @action
  previousPage() {
    this.router.transitionTo('create.meta');
  }

  @action
  submit() {
    const { pollType } = this.args.poll;

    if (pollType === 'FindADate') {
      this.router.transitionTo('create.options-datetime');
    } else {
      this.router.transitionTo('create.settings');
    }
  }

  updatePoll() {
    const { poll } = this.args;
    const { pollType } = poll;
    const { options } = this.formData;
    const pollOptions = options.map(({ value }) => value);

    if (pollType === 'FindADate') {
      poll.dateOptions = new TrackedSet(pollOptions.sort());
    } else {
      poll.freetextOptions = new TrackedSet(pollOptions);
    }
  }

  constructor(owner: Owner, args: CreateOptionsSignature['Args']) {
    super(owner, args);

    const handleTransition = (transition: Transition) => {
      if (transition.from?.name === 'create.options') {
        this.updatePoll();
        this.router.off('routeWillChange', handleTransition);
      }
    };

    // Cannot use a destructor because that one runs _after_ the other component
    // rendered by the next route is initialized.
    this.router.on('routeWillChange', handleTransition);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CreateOptions: typeof CreateOptions;
  }
}
