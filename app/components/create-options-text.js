import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { observer } from '@ember/object';

export default Component.extend({
  actions: {
    addOption(element) {
      let fragment = this.store.createFragment('option');
      let options = this.options;
      let position = this.options.indexOf(element) + 1;
      options.insertAt(
        position,
        fragment
      );
    },
    deleteOption(element) {
      let position = this.options.indexOf(element);
      this.options.removeAt(position);
    }
  },

  enforceMinimalOptionsAmount: observer('options', 'isMakeAPoll', function() {
    if (this.get('options.length') < 2) {
      let options = this.options;
      for (let missingOptions = 2 - this.get('options.length'); missingOptions > 0; missingOptions--) {
        options.pushObject(
          this.store.createFragment('option')
        );
      }
    }
  }).on('init'),

  store: service('store'),
});
