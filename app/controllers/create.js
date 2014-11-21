import Ember from "ember";

export default Ember.ObjectController.extend({
  optionsDates: [],
  optionsDateTimes: [],
  optionsTexts: [{value: ''}, {value: ''}],
  
  updateOptions: function() {
    var self = this;
    
    /*
     * find a date
     * options are dates or datetimes
     */
    if (this.get('isFindADate')) {
      if (this.get('isDateTime')) {
        // merge days and times
        var options = [],
            optionsDateTimes = this.get('optionsDateTimes');
        optionsDateTimes.forEach(function(day) {
          day.get('times').forEach(function(timeObject) {
            var date = new Date( day.title ),
                timeString = timeObject.value;
            
            if (self.validateTimeString(timeString)) {
              var time = timeString.split(':');
              
              date.setHours(time[0]);
              date.setMinutes(time[1]);

              options.pushObject({
                title: date
              });
            }
          });
        });
        
        this.set('options', options);
      }
      else {
        // set options to days
        this.set('options', this.get('optionsDates'));
      }
    }
    /*
     * make a poll
     * options are text strings
     */
    else {
      // remove all empty strings
      var texts = [];
      
      this.get('optionsTexts').forEach(function(optionText){
        var textString = optionText.value.trim();
        
        if (textString !== '') {
          texts.pushObject({
            title: textString
          });
        }
      });
      
      this.set('options', texts);
    }
  }.observes('optionsDates.@each.title', 'optionsDateTimes.@each.title', 'optionsDateTimes.@each.@eachTimesValue', 'optionsTexts.@each.value'),
  
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