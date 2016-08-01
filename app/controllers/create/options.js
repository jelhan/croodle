import Ember from 'ember';

const { computed, Controller } = Ember;

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

  isFindADate: computed.alias('model.isFindADate')
});
