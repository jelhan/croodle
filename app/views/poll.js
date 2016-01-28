import Ember from 'ember';

export default Ember.View.extend({
  showEvaluation: false,

  actions: {
    useLocalTimezone() {
      this.set('controller.useLocalTimezone', true);
    }
  },

  didInsertElement() {
    this._super();
    /*
     * show timezone modal if
     * - local timezone differs to timezone poll got created with and
     * - poll is datetime
     */
    if (this.get('controller.timezoneDiffers') && this.get('controller.model.isDateTime')) {
      Ember.$('#timezoneDiffers').modal();
    }
  }
});
