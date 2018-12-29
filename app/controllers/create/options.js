import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    nextPage() {
      if (this.get('isFindADate')) {
        this.transitionToRoute('create.options-datetime');
      } else {
        this.transitionToRoute('create.settings');
      }
    }
  },

  isFindADate: alias('model.isFindADate')
});
