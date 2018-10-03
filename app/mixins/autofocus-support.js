import Ember from 'ember';

/*
 * A work-a-round to support autofocus in Ember.js components.
 * Background: https://github.com/emberjs/ember.js/issues/12589
 */

export default Ember.Mixin.create({
  didInsertElement() {
    this._super(...arguments);

    if (this.get('autofocus')) {
      this.$().focus();
    }
  }
});
