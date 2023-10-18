import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { TrackedArray } from 'tracked-built-ins';
import IntlMessage from '../utils/intl-message';
import { tracked } from '@glimmer/tracking';

class FormDataOption {
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

  constructor(formData, value) {
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
  updateOptions(values) {
    this.options = new TrackedArray(
      values.map((value) => new FormDataOption(this, value)),
    );
  }

  @action
  addOption(value, afterPosition = this.options.length - 1) {
    const option = new FormDataOption(this, value);

    this.options.splice(afterPosition + 1, 0, option);
  }

  @action
  deleteOption(option) {
    this.options.splice(this.options.indexOf(option), 1);
  }

  constructor({ options }, { defaultOptionCount }) {
    const normalizedOptions =
      options.length === 0 && defaultOptionCount > 0 ? ['', ''] : options;

    this.options = new TrackedArray(
      normalizedOptions.map(({ title }) => new FormDataOption(this, title)),
    );
  }
}

export default class CreateOptionsComponent extends Component {
  @service router;

  formData = new FormData(
    { options: this.args.options },
    { defaultOptionCount: this.args.isMakeAPoll ? 2 : 0 },
  );

  @action
  previousPage() {
    this.args.onPrevPage();
  }

  @action
  handleSubmit() {
    this.args.onNextPage();
  }

  @action
  handleTransition(transition) {
    if (transition.from?.name === 'create.options') {
      this.args.updateOptions(this.formData.options);
      this.router.off('routeWillChange', this.handleTransition);
    }
  }

  constructor() {
    super(...arguments);

    this.router.on('routeWillChange', this.handleTransition);
  }
}
