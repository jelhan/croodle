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
  i18n: Ember.inject.service(),
  label: Ember.computed('title', 'i18n.locale', function() {
    return moment(this.get('title')).locale(this.get('i18n.locale')).format(
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
  optionsDateTimes: Ember.computed('model.options.[]', 'model.options.@each.title', {
    get() {
      if (!Ember.isArray(this.get('model.options'))) {
        return [];
      }

      var dates = this.get('model.options').filter((option) => {
        return moment(option.get('title'), 'YYYY-MM-DD', true).isValid();
      });

      // To lookup validators, container access is required which can cause an issue with Ember.Object
      // creation if the object is statically imported. The current fix for this is as follows.
      // https://github.com/offirgolan/ember-cp-validations/blob/master/README.md#basic-usage---objects
      var container = this.get('container');

      return dates.map((option) => {
        return OptionsDateTimesObject.create({
          title: moment(option.get('title')),
          times: [
            OptionsDateTimesTimeObject.create({container}),
            OptionsDateTimesTimeObject.create({container})
          ],
          container
        });
      });
    }
  }),
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
