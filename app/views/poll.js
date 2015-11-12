import Ember from "ember";
/* global moment */

export default Ember.View.extend(Ember.I18n.TranslateableProperties, {
  showEvaluation: false,

  actions: {
    useLocalTimezone: function() {
      this.set('controller.useLocalTimezone', true);
    }
  },

  didInsertElement : function(){
    this._super();
    /*
     * show timezone modal if
     * - local timezone differs to timezone poll got created with and
     * - poll is datetime
     */
    if( this.get('controller.timezoneDiffers') && this.get('controller.model.isDateTime') ) {
      Ember.$('#timezoneDiffers').modal();
    }
  },

  creationDateFormatted: function() {
    return moment( this.get('controller.model.creationDate') ).format('LLLL');
  }.property('controller.model.creationDate')
});
