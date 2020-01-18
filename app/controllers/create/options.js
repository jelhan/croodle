import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';

@classic
export default class CreateOptionsController extends Controller {
  @action
  nextPage() {
    if (this.isFindADate) {
      this.transitionToRoute('create.options-datetime');
    } else {
      this.transitionToRoute('create.settings');
    }
  }

  @action
  previousPage() {
    this.transitionToRoute('create.meta');
  }

  @alias('model.isFindADate')
  isFindADate;
}
