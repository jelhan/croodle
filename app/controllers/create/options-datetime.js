import Ember from "ember";
import EmberValidations from 'ember-validations';

export default Ember.ObjectController.extend(EmberValidations.Mixin, {
  needs: 'create',
  
  optionsDateTimes: Ember.computed.alias("controllers.create.optionsDateTimes"),
    
  actions: {
    /*
     * copy first line
     */
    copyFirstLine: function(){
      var datetimes = this.get('optionsDateTimes'),
          firstLine = datetimes[0];
      
      datetimes.forEach(function(datetime, key) {
        // skip first element
        if (key > 0) {
          var newTimes = [];
          firstLine.times.forEach(function(time){
            newTimes.pushObject({
              value: time.value
            });
          });
          
          datetime.set('times', newTimes);
        }
      });
    },
    
    /*
     * increase number of inputs fields for time
     */
    moreTimes: function(){
      this.get('optionsDateTimes').forEach(function(datetime){
        datetime.times.pushObject({
          value: ''
        });
      });

      // update polyfill used for legacy support of html5 input time after new form elements have been insert
      // has to wait after dom is updated
      Ember.run.next(this, function() { Ember.$('input[type=time]').updatePolyfill(); });
    },
    
    save: function(){      
      // redirect to create/settings route
      this.transitionToRoute('create.settings');
    },
    
    submit: function(){
      this.validate();
      
      Ember.$.each(Ember.View.views, function(id, view) {
        if(view.isEasyForm) {
          view.focusOut();
        }
      });
      
      if (this.get('isValid')) {
        // tricker save action
        this.send('save');
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
  
  /*
   * check if enough times are inserted
   */
  enoughTimes: function(){
    var datetimes = this.get('optionsDateTimes'),
        self = this,
        isValid = true,
        requiredTimesPerDate;

    // set requiredTimesPerDate
    if (datetimes.length === 1) {
      // if there is only one date, we require atleast two times
      requiredTimesPerDate = 2;
    }
    else {
      // if there are atleast two dates we require one time per date
      requiredTimesPerDate = 1;
    }
    
    datetimes.forEach(function(datetime){
      var times = datetime.times,
          validTimes = 0;

      times.forEach(function(time){
        if(self.getHoursAndMinutesFromInput(time.value) !== false){
          validTimes ++;
        }
      });

      if (validTimes < requiredTimesPerDate) {
        isValid = false;
      }
    });

    return isValid;
  }.property('optionsDateTimes.@each.@eachTimesValue'),
  
  getHoursAndMinutesFromInput: function(time){
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
  },
  
  validations: {
    enoughTimes: {
      acceptance: {
        message: Ember.I18n.t('create.options-datetime.error.notEnoughTimes')
      }
    },
    
    correctTimeFormat: {
      acceptance: {
        message: Ember.I18n.t('create.options-datetime.error.correctTimeFormat')
      }
    }
  }
});