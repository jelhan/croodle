import Route from '@ember/routing/route';
import { tracked } from '@glimmer/tracking';
import IntlMessage from '../../utils/intl-message';

class FormData {
  @tracked title;
  @tracked description;

  get titleValidation() {
    const { title } = this;

    if (!title) {
      return new IntlMessage(
        'create.meta.input.title.validations.valueMissing',
      );
    }

    if (title.length < 2) {
      return new IntlMessage('create.meta.input.title.validations.tooShort');
    }

    return null;
  }

  constructor({ title, description }) {
    this.title = title;
    this.description = description;
  }
}

export default class MetaRoute extends Route {
  model() {
    const { title, description } = this.modelFor('create');

    return {
      formData: new FormData({ title, description }),
      poll: this.modelFor('create'),
    };
  }
}
