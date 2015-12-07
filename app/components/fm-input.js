import FmInput from 'ember-form-master-2000/components/fm-input';
export default FmInput.reopen({
  polyfill: function() {
    this.$().updatePolyfill();
  }.on('didInsertElement')
});
