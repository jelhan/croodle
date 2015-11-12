import FmRadio from 'ember-form-master-2000/components/fm-radio';
import Ember from 'ember';

export default FmRadio.reopen({
  change() {
    this.set('parentView.value', this.get('value'));

    // backport feature: do not show errors before user interaction
    this.sendAction('onUserInteraction');
  },
  icon: Ember.computed('parentView.optionIconPath', function() {
    if(this.get('parentView.optionIconPath')) {
      return this.get(this.get('parentView.optionIconPath'));
    } else {
      return null;
    }
  })
});
