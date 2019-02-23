import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    nextPage() {
      if (this.isFindADate) {
        this.transitionToRoute('create.options-datetime');
      } else {
        this.transitionToRoute('create.settings');
      }
    },
    previousPage() {
      this.transitionToRoute('create.meta');
    },
  },

  isFindADate: alias('model.isFindADate')
});
