import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    nextPage() {
      if (this.get('isFindADate')) {
        this.transitionToRoute('create.options-datetime');
      } else {
        this.transitionToRoute('create.settings');
      }
    }
  },

  isFindADate: Ember.computed.alias('model.isFindADate')
});
