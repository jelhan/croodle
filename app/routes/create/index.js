import Route from '@ember/routing/route';
import { tracked } from '@glimmer/tracking';

class FormData {
  @tracked pollType;

  constructor({ pollType }) {
    this.pollType = pollType;
  }
}

export default class IndexRoute extends Route {
  model() {
    const { pollType } = this.modelFor('create');

    return {
      formData: new FormData({ pollType }),
      poll: this.modelFor('create'),
    };
  }
}
