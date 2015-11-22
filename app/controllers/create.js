import Ember from "ember";
import moment from "moment";
import {
  validator, buildValidations
} from 'ember-cp-validations';
/* global jstz */

var OptionsTextsObject = Ember.Object.extend(
  buildValidations({
    value: validator('presence', true)
  }), {
    value: ''
  }
);

var OptionsDateTimesObjectValidations = buildValidations({
  times: [
    validator('collection', true),
    validator('valid-collection', {
      dependentKeys: ['times.@each.isValid']
    }),
    // atleast one time per day
    validator(function(value) {
      return value.get('length') >= 1;
    }, {
      dependentKeys: ['times.[]'],
      // message: Ember.I18n.t('create.options-datetime.error.notEnoughTimes')
    })
  ]
});

var OptionsDateTimesObject = Ember.Object.extend(OptionsDateTimesObjectValidations, {
  label: Ember.computed('title', function() {
    return moment(this.get('title')).format(
      moment.localeData().longDateFormat('LLLL')
        .replace(
          moment.localeData().longDateFormat('LT'), '')
        .trim()
    );
  }),
  title: null,
  times: [],
  isValid: Ember.computed.alias('validations.isValid'),

  // helper Object as work-a-round to observe a nested array
  // if times.@each.value has to be observed, @eachTimesValue could be observed instead
  '@eachTimesValue': Ember.computed('times.@each.value', function(){
    return JSON.stringify(this.get('times').map(function(time){
      return time.value;
    }));
  })
});

var OptionsDateTimesTimeObjectValidations = buildValidations({
  // time is vali
  value: [
    validator('presence'),
    validator('time', {
      // message: Ember.I18n.t('create.options-datetime.error.correctTimeFormat')
    })
  ]
});

var OptionsDateTimesTimeObject = Ember.Object.extend(
  // implement copyable for "copy first line"-action of create/options-datetime
  Ember.Copyable,
  OptionsDateTimesTimeObjectValidations,
  {
    copy() {
      // To lookup validators, container access is required which can cause an issue with Ember.Object
      // creation if the object is statically imported. The current fix for this is as follows.
      // https://github.com/offirgolan/ember-cp-validations/blob/master/README.md#basic-usage---objects
      var container = this.get('container');
      return OptionsDateTimesTimeObject.create({
       value: this.get('value'),
        container
      });
    },
    isValid: Ember.computed.alias('validations.isValid'),
    value: ''
  }
);

export default Ember.Controller.extend({
  optionsDates: [],
  optionsDateTimes: [],
  optionsDateTimesObject: OptionsDateTimesObject,
  optionsDateTimesTimeObject: OptionsDateTimesTimeObject,
  optionsTexts: Ember.computed(function() {
    // To lookup validators, container access is required which can cause an issue with Ember.Object
    // creation if the object is statically imported. The current fix for this is as follows.
    // https://github.com/offirgolan/ember-cp-validations/blob/master/README.md#basic-usage---objects
    var container = this.get('container');
    return [
      this.get('optionsTextsObject').create({container}),
      this.get('optionsTextsObject').create({container})
    ];
  }),
  optionsTextsObject: OptionsTextsObject,

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
    // To lookup validators, container access is required which can cause an issue with Ember.Object
    // creation if the object is statically imported. The current fix for this is as follows.
    // https://github.com/offirgolan/ember-cp-validations/blob/master/README.md#basic-usage---objects
    var container = this.get('container');

    this.set('optionsDateTimes',
      this.get('optionsDates').map((optionDate) => {
        return OptionsDateTimesObject.create({
          title: optionDate.title,
          times: [
            OptionsDateTimesTimeObject.create({container}),
            OptionsDateTimesTimeObject.create({container})
          ],
          container
        });
      })
    );
  }.observes('optionsDates.@each.value'),

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
    this.get('optionsDateTimes').map((dateTime) => {
      return dateTime.get('@eachTimesValue');
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
    if (typeof timeString === "undefined") {
      return false;
    }

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
