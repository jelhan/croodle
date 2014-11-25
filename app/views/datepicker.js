import Ember from "ember";

export default Ember.View.extend({
  classNames: ['datepicker'],

  didInsertElement: function() {
    var self = this,
        selectedDates = [];

    this._super();

    Ember.$('.datepicker').datepicker({
      format: "yyyy-mm-dd hh:mm:ss",
      multidate: true,
      multidateSeparator: ";",
      calendarWeeks: true,
      todayHighlight: true,
      language: this.get('controller.language.selected')
    })
    // bind date changes to dates option array in model
    .on('changeDate', function(e){
      var dates = e.dates,
          newDates = [];

      // sort dates
      dates.sort(function(a,b){
        return new Date(a) - new Date(b);
      });

      // get array in correct form
      dates.forEach(function(option) {
        newDates.pushObject({title: option});
      });

      // set options
      self.set('_parentView.controller.optionsDates', newDates);
    });
    
    // get selected dates in a simple array of date objects
    this.get('controller.optionsDates').forEach(function(date){
      console.log(date.title);
      selectedDates.push( new Date(date.title) );
    });
    
    if(selectedDates.length > 0) {
      // set selected dates on init
      Ember.$('#' + this.elementId).datepicker('setDates', selectedDates);
    }
  }
});