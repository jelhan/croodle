import FmFieldComponent from 'ember-form-master-2000/components/fm-field';
import Ember from 'ember';

export default FmFieldComponent.reopen({
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
  // * backport feature: do not show errors before user interaction
  errorClass: Ember.computed('errors', 'shouldShowErrors', function() {
    if(!Ember.isEmpty(this.get('errors')) && this.get('shouldShowErrors')) {
      return this.fmconfig.errorClass;
    }
  }),

  fieldWrapperClass: Ember.computed(function() {
    return this.fmconfig.fieldWrapperClass;
  }),

  // make labelClass overrideable
  init() {
    var labelClass = this.get('labelClass');
    this._super();
    if (!Ember.isEmpty(labelClass)) {
      this.set('labelClass', labelClass);
    }
  },

  // backport feature: do not show errors before user interaction
  shouldShowErrors: false
});
