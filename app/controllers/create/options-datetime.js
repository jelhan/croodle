import Ember from "ember";
import {
  validator, buildValidations
} from 'ember-cp-validations';

var Validations = buildValidations({
  optionsDateTimes: validator('valid-collection', {
    dependentKeys: ['optionsDateTimes.@each.isValid']
  })
});

export default Ember.Controller.extend(Validations, {
  needs: 'create',

  optionsDateTimes: Ember.computed.alias("controllers.create.optionsDateTimes"),
  optionsDateTimesTimeObject: Ember.computed.alias("controllers.create.optionsDateTimesTimeObject"),

  actions: {
    /*
     * copy first line
     */
    copyFirstLine: function(){
      var dateTimes = this.get('optionsDateTimes'),
          firstLine = dateTimes[0];

      dateTimes.slice(1).forEach((dateTime) => {
        dateTime.set('times', Ember.copy(firstLine.get('times'), true));
      });
    },

    submit: function(){
      if (this.get('validations.isValid')) {
        // redirect to create/settings route
        this.transitionToRoute('create.settings');
      }
    }
  },

  /*
   * check if all times are in correct format
   */
  correctTimeFormat: function(){
    var datetimes = this.get('optionsDateTimes'),
        self = this;

    return datetimes.every(function(datetime){
      var times = datetime.times;

      return times.every(function(time){
        return Ember.isEmpty(time.value) ||
               self.getHoursAndMinutesFromInput(time.value) !== false;
      });
    });
  }.property('optionsDateTimes.@each.@eachTimesValue'),

  getHoursAndMinutesFromInput: function(time){
    if (typeof time === 'undefined' || time === null) {
      return false;
    }

    // try to split time in minutes and hours
    var t;
    if (time.indexOf(':') !== -1) {
      t = time.split(':');
    }
    else {
      // time is not in a correct format
      return false;
    }

    if (t.length !== 2) {
      // time is not in a correct format
      return false;
    }

    // get hours and minutes
    var h = parseInt(t[0]),
        m = parseInt(t[1]);

    // check time for valid format
    if (h >= 0 && h <= 23 &&
        m >= 0 && m <= 59) {
      return {
        hours: h,
        minutes: m
      };
    }
    else {
      return false;
    }
  }
});
