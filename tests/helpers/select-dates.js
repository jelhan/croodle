import Ember from 'ember';

export default Ember.Test.registerAsyncHelper('selectDates', function(app, datepickerElement, dates) {
  var normalizedDates = dates.map((date) => {
    if (typeof date.toDate === 'function') {
      date = date.toDate();
    }
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  });
  $(datepickerElement).datepicker('setDates', normalizedDates);
});
