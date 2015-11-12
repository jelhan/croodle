import FmRadioGroup from 'ember-form-master-2000/components/fm-radio-group';
import Ember from 'ember';

export default FmRadioGroup.reopen({
  actions: {
    // backport feature: do not show errors before user interaction
    userInteraction() {
      if (!this.get('shouldShowErrors')) {
        this.set('shouldShowErrors', true);
      }
    }
  },

  // backport
  // * fix: do not show has-errors if errors array is empty
  //   https://github.com/Emerson/ember-form-master-2000/pull/33
  // * feature: do not show errors before user interaction
  errorClass: Ember.computed('errors', 'shouldShowErrors', function() {
    if(!Ember.isEmpty(this.get('errors')) && this.get('shouldShowErrors')) {
      return this.fmconfig.errorClass;
    }
  }),

  fieldWrapperClass: Ember.computed(function() {
    return this.fmconfig.fieldWrapperClass;
  }),

  labelClass: Ember.computed(function() {
    return this.fmconfig.labelClass;
  }),

  // backport feature: do not show errors before user interaction
  shouldShowErrors: false
});
