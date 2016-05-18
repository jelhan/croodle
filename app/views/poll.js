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
     * - poll has times
     */
    if (this.get('controller.timezoneDiffers') && this.get('controller.hasTimes')) {
      Ember.$('#timezoneDiffers').modal();
    }
  }
});
