import FmInput from 'ember-form-master-2000/components/fm-input';
export default FmInput.reopen({
  // backport feature: do not show errors before user interaction
  focusOut() {
    this.sendAction('onUserInteraction');
  }
});
