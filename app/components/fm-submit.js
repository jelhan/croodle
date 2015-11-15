import FmSubmitComponent from 'ember-form-master-2000/components/fm-submit';
import Ember from 'ember';

export default FmSubmitComponent.reopen({
  fieldWrapperClass: Ember.computed(function() {
    return this.fmconfig.fieldWrapperClass;
  }),
});
