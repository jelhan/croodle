import Mixin from '@ember/object/mixin';

/*
 * A work-a-round to support autofocus in Ember.js components.
 * Background: https://github.com/emberjs/ember.js/issues/12589
 */

export default Mixin.create({
  didInsertElement() {
    this._super(...arguments);

    if (this.autofocus) {
      this.element.focus();
    }
  }
});
