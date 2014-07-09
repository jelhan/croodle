export default Ember.ObjectController.extend(Ember.Validations.Mixin, {
  actions: {
    /*
     * increase number of inputs fields for time
     */
    moreTimes: function(){
      this.set('datetimesInputFields', this.get('datetimesInputFields') + 1);
      
      this.get('datetimes').forEach(function(datetime){
        datetime.times.pushObject({
          value: ''
        });
      });
    },
    
    /*
     * set new options depending on selected times
     */
    submitDatetimes: function(){
      var datetimes = this.get('datetimes'),
          newOptions = [],
          self = this;
      
      datetimes.forEach(function(datetime){
        datetime.times.forEach(function(t){
          var date = new Date(datetime.title),
              delimiter = '';
                    
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
      
      // tricker save action
      this.send('save');
    },
    
    save: function(){
      // redirect to create/settings route
      this.transitionToRoute('create.settings');
    }
  },
  
  /*
   * only used on init, not on increasing number of input fields!
   */
  datetimes: function(){
    var datetimes = [],
        dates = this.get('options'),
        datetimesCount = this.get('datetimesInputFields');
        
    dates.forEach(function(date){
      var o = {
        title: date.title,
        times: []
      };
      
      for(var i = 1; i<=datetimesCount; i++) {
        o.times.pushObject({
          value: ''
        });
      }
      
      datetimes.pushObject(o);
    });

    return datetimes;
  }.property('options'),
  
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
      }
    }
    else {
      return false;
    }
  }
});