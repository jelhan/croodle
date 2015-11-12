import FmCheckboxComponent from 'ember-form-master-2000/components/fm-checkbox';
import Ember from 'ember';

export default FmCheckboxComponent.reopen({
  // backport fix: do not show has-errors if errors array is empty
  // https://github.com/Emerson/ember-form-master-2000/pull/33
  errorClass: Ember.computed('errors', function() {
    if(!Ember.isEmpty(this.get('errors'))) {
      return this.fmconfig.errorClass;
    }
  }),
});
