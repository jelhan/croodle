export default Ember.ObjectController.extend(Ember.Validations.Mixin, {
  actions: {
    submitDatetimes: function(){
      var datetimes = this.get('datetimes'),
          newOptions = [];
      
      datetimes.forEach(function(datetime){
        datetime.times.forEach(function(time){
          var date = new Date(datetime.title),
              delimiter = '';
                    
          // check if there is a value for time
          if (Ember.isEmpty(time.value)) {
            return;
          }
          
          // try to split time in minutes and hours
          var t;
          if (time.value.indexOf(':') !== -1) {
            t = time.value.split(':');
          }
          else if (time.value.indexOf('.') !== -1) {
            t = time.value.split('.');
          }
          else {
            // could not determine the delimiter
            return;
          }
          
          // get hours and minutes
          var h = parseInt(t[0]),
              m = parseInt(t[1]);
                    
          // check time for valid format
          if (h >= 0 && h <= 23 &&
              m >= 0 && m <= 59) {
            // hours and minutes seems valid, so update the date
            date.setHours(h);
            date.setMinutes(m);
            
            newOptions.pushObject({
              title: date
            });
          }
        });
      });
      
      // check if we have at least 2 options now
      if (newOptions.length < 2) {
        // ToDo: Should throw error
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
  
  datetimes: function(){
    var datetimes = [],
        dates = this.get('options');

    dates.forEach(function(date){
      datetimes.pushObject({
        title: date.title,
        times: [
          {
            value: ''
          },
          {
            value: ''
          }
        ]
      });
    });

    return datetimes;
  }.property('options')
});