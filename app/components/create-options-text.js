import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    addOption(position) {
      let fragment = this.get('store').createFragment('option'),
          options = this.get('options');
      options.insertAt(
        position,
        fragment
      );
    },
    deleteOption(position) {
      this.get('options').removeAt(position);
    }
  },

  enforceMinimalOptionsAmount: Ember.observer('options', 'isMakeAPoll', function() {
    if (this.get('options.length') < 2) {
      let options = this.get('options');
      for (let missingOptions = 2 - this.get('options.length'); missingOptions > 0; missingOptions--) {
        options.pushObject(
          this.get('store').createFragment('option')
        );
      }
    }
  }).on('init'),

  store: Ember.inject.service('store')
});
