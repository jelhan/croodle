import FmFormComponent from 'ember-form-master-2000/components/fm-form';
export default FmFormComponent.reopen({
  submit(e) {
    e.preventDefault();

    // backport feature: do not show errors before user interaction
    this.get('childViews').forEach((childView) => {
      if (typeof childView.get('shouldShowErrors') !== 'undefined') {
        childView.send('userInteraction');
      }
    });

    if (this.get('isValid') === false) {
      return false;
    }

    this.sendAction('action', this.get('for'));
  }
});
