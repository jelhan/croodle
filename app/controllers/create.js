import Ember from "ember";
import moment from "moment";
/* global jstz */

export default Ember.Controller.extend({
  optionsDates: [],
  optionsDateTimes: [],
  optionsTexts: [{value: ''}, {value: ''}],
  
  updateOptions: function() {
    var self = this,
        options = [];
    
    /*
     * find a date
     * options are dates or datetimes
     */
    if (this.get('model.isFindADate')) {
      
      if (this.get('model.isDateTime')) {
        // merge days and times
        this.get('optionsDateTimes').forEach(function(day) {
          // map dates and times
          var validTimeFound = false;
          day.get('times').forEach(function(timeObject) {
            var date = new Date( day.title ),
                timeString = timeObject.value;
            
            if (self.validateTimeString(timeString)) {
              var time = timeString.split(':');
              
              date.setHours(time[0]);
              date.setMinutes(time[1]);

              options.pushObject(
                self.store.createFragment('option', {
                  title: moment(date).toISOString()
                })
              );

              validTimeFound = true;
            }
          });
        });
      }
      else {
        // set options to days
        options = this.get('optionsDates').map(
          day => this.store.createFragment('option', {
            // ISO 8601 date format
            title: moment( day.title ).format('YYYY-MM-DD')
          })
        );
      }

      // days should be sorted to get them in correct order
      options.sort(function(a, b){
        if (a.get('title') === b.get('title')) {
          return 0;
        }
        else {
          return a.get('title') > b.get('title') ? 1 : -1;
        }
      });
    }
    /*
     * make a poll
     * options are text strings
     */
    else {
      // remove all empty strings
      
      this.get('optionsTexts').forEach(function(optionText){
        var textString = optionText.value.trim();
        
        if (textString !== '') {
          options.pushObject(
            self.store.createFragment('option', {
              title: textString
            })
          );
        }
      });
    }

    this.set('model.options', options);
  }.observes('optionsDates.@each.title', 'optionsDateTimes.@each.title', 'optionsDateTimes.@each.@eachTimesValue', 'optionsTexts.@each.value', 'model.isDateTime'),
  
  updateDateTimesAfterDateChange: function() {
    var optionsDates = this.get('optionsDates'),
        newOptionsDateTimes = [],
        self = this;
    
    optionsDates.forEach(function(optionDate){
      var dateTime = self.get('optionsDateTimesObject').create({
        title: optionDate.title,
        times: [{value: ''}, {value: ''}]
      });

      newOptionsDateTimes.pushObject( dateTime );
    });
    
    this.set('optionsDateTimes', newOptionsDateTimes);
    
  }.observes('optionsDates.@each.value'),
  
  /*
   * helper Object as work-a-round to observe a nested array
   */
  optionsDateTimesObject: Ember.Object.extend({
    '@eachTimesValue': function(){
      var times = [];
      this.get('times').forEach(function(value){
        times.push(value.value);
      });
      return times;
    }.property('times.@each.value')
  }),
  
  /*
   * uncomsumed computed property does not trigger observers
   * therefore we have to retrieve computed property helper to observer
   * nested array
   * 
   * More Information in Ember 1.0 RC8 Release Changelog:
   * Unconsumed Computed Properties Do Not Trigger Observers
   * http://emberjs.com/blog/2013/08/29/ember-1-0-rc8.html
   */
  fixObserverOnOptionsDateTimesObject: function() {
    this.get('optionsDateTimes').forEach(function(dateTime) {
      dateTime.get('@eachTimesValue');
    });
  }.observes('optionsDateTimes.@each.@eachTimesValue').on('init'),

  /*
   * sets timezone property of model to users timezone if dates with
   * times are specified
   * otherwise we don't need to store timezone of user created the poll
   */
  setTimezone: function() {
    if(
      this.get('model.isFindADate') &&
      this.get('model.isDateTime')
    ) {
      this.set('model.timezone', jstz.determine().name());
    }
    else {
      this.set('model.timezone', '');
    }
  }.observes('model.isDateTime', 'model.isFindADate'),

  /*
   * validate if a given time string is in valid format
   */
  validateTimeString: function(timeString) {
    var time = timeString.split(':');
    
    if (time.length === 2) {
      var hours = time[0],
          minutes = time[1];

      if (hours >= 0 && hours <= 23 &&
          minutes >= 0 && minutes <= 60) {
        return true;
      }
    }
    
    return false;
  }
});
