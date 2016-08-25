import Ember from 'ember';

const { on } = Ember;

/*
 * A work-a-round to support autofocus in Ember.js components.
 * Background: https://github.com/emberjs/ember.js/issues/12589
 */

export default Ember.Mixin.create({
  autofocusSupport: on('didInsertElement', function() {
    if (this.get('autofocus')) {
      this.$().focus();
    }
  })
});
