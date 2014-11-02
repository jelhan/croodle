import Ember from "ember";
import EmberValidations from 'ember-validations';

export default Ember.ObjectController.extend(EmberValidations.Mixin, {
  actions: {
    /*
     * copy first line
     */
    copyFirstLine: function(){
      var datetimes = this.get('datetimes'),
          firstLine = datetimes[0];
      
      datetimes.forEach(function(datetime, key) {
        // skip first element
        if (key > 0) {
          var newTimes = [];
          firstLine.contents.times.forEach(function(time){
            newTimes.pushObject({
              value: time.value
            });
          });
          
          datetime.set('contents.times', newTimes);
        }
      });
    },
    
    /*
     * increase number of inputs fields for time
     */
    moreTimes: function(){
      this.set('datetimesInputFields', this.get('datetimesInputFields') + 1);
      
      this.get('datetimes').forEach(function(datetime){
        datetime.contents.times.pushObject({
          value: ''
        });
      });

      // update polyfill used for legacy support of html5 input time after new form elements have been insert
      // has to wait after dom is updated
      Ember.run.next(this, function() { Ember.$('input[type=time]').updatePolyfill(); });
    },
    
    save: function(){
      /*
       * set new options depending on selected times
       */
      
      var datetimes = this.get('datetimes'),
          newOptions = [],
          self = this;
      
      datetimes.forEach(function(datetime){
        datetime.contents.times.forEach(function(t){
          var date = new Date(datetime.contents.title);
                    
          // check if there is a value for time
          if (Ember.isEmpty(t.value)) {
            return;
          }
          
          // try to split time in minutes and hours
          var time = self.getHoursAndMinutesFromInput(t.value);
                    
          // check time for valid format
          if (time !== false) {
            // hours and minutes seems valid, so update the date
            date.setHours(time.hours);
            date.setMinutes(time.minutes);
            
            newOptions.pushObject({
              title: date
            });
          }
        });
      });
      
      // check if we have at least 2 options now
      if (newOptions.length < 2) {
        return;
      }
      
      this.set('options', newOptions);
      
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
   * only used on init, not on increasing number of input fields!
   */
  datetimes: function(){
    var datetimes = Ember.A(),
        dates = this.get('options'),
        datetimesCount = this.get('datetimesInputFields'),
        self = this;
    
    if (typeof dates !== 'undefined') {
      dates.forEach(function(date){
        var o = {
          title: date.title,
          times: Ember.A()
        };

        for(var i = 1; i<=datetimesCount; i++) {
          o.times.pushObject({
            value: ''
          });
        }

        datetimes.pushObject(self.get('datetimesTimesArray').create({'contents':o}));
      });
    }

    return datetimes;
  }.property('options'),
  
  /*
   * helper Object as work-a-round to observe a nested array
   */
  datetimesTimesArray: Ember.Object.extend({
    '@eachTimesValue': function(){
      var times = [];
      this.get('contents.times').forEach(function(value){
        times.push(value.value);
      });
      return times;
    }.property('contents.times.@each.value')
  }),
  
  /*
   * check if all times are in correct format
   */
  correctTimeFormat: function(){
    var datetimes = this.get('datetimes'),
        self = this;

    return datetimes.every(function(value, key){
      var times = self.get('datetimes.' + key + '.@eachTimesValue');
      
      return times.every(function(time){
        return Ember.isEmpty(time) ||
               self.getHoursAndMinutesFromInput(time) !== false;
      });
    });
  }.property('datetimes.@each.@eachTimesValue'),
  
  /*
   * check if there is atleast one time per date
   */
  enoughTimes: function(){
    var datetimes = this.get('datetimes'),
        self = this,
        isValid = true;
        
    datetimes.forEach(function(value, key){
      var times = self.get('datetimes.' + key + '.@eachTimesValue'),
          valid = false;
      
      times.forEach(function(time){
        if(self.getHoursAndMinutesFromInput(time) !== false){
          valid = true;
        }
      });
      
      if (valid === false) {
        isValid = false;
      }
    });
    
    return isValid;
  }.property('datetimes.@each.@eachTimesValue'),
  
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