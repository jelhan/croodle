import Ember from 'ember';

export default Ember.View.extend({
  actions: {
    moreOptions() {
      // create new Option
      this.get('controller.optionsTexts').pushObject({
        'value': ''
      });
    }
  }
});
