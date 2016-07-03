import DS from 'ember-data';
import Ember from 'ember';
import moment from 'moment';
import {
  validator, buildValidations
}
from 'ember-cp-validations';
/* global MF */

const { assert, computed, isEmpty } = Ember;

const Validations = buildValidations({
  title: [
    validator('iso8601', {
      active() {
        return this.get('model.poll.isFindADate');
      },
      validFormats: [
        'YYYY-MM-DD',
        'YYYY-MM-DDTHH:mmZ',
        'YYYY-MM-DDTHH:mm:ssZ',
        'YYYY-MM-DDTHH:mm:ss.SSSZ'
      ],
      dependentKeys: ['i18n.locale']
    }),
    validator('presence', {
      presence: true,
      dependentKeys: ['i18n.locale']
    }),
    validator('unique', {
      parent: 'poll',
      attributeInParent: 'options',
      dependentKeys: ['poll.options.[]', 'poll.options.@each.title', 'i18n.locale'],
      descriptionKey() {
        const isFindADate = this.get('model.poll.isFindADate');
        if (isFindADate) {
          return 'times';
        } else {
          return 'options';
        }
      }
    })
  ],
  time: [
    validator('time', {
      allowEmpty: true
    }),
    // alias title validation especially for unique validation
    validator('alias', {
      alias: 'title',
      firstMessageOnly: true
    })
  ]
});

export default MF.Fragment.extend(Validations, {
  poll: MF.fragmentOwner(),
  title: DS.attr('string'),

  date: computed('title', function() {
    const allowedFormats = [
      'YYYY-MM-DD',
      'YYYY-MM-DDTHH:mm:ss.SSSZ'
    ];
    const value = this.get('title');
    if (Ember.isEmpty(value)) {
      return;
    }

    const format = allowedFormats.find((f) => {
      // if format length does not match value length
      // string can't be in this format
      return f.length === value.length && moment(value, f, true).isValid();
    });
    if (isEmpty(format)) {
      return;
    }

    return moment(value, format, true);
  }),

  day: computed('date', function() {
    const date = this.get('date');
    if (!moment.isMoment(date)) {
      return;
    }
    return date.format('YYYY-MM-DD');
  }),

  dayFormatted: computed('date', 'i18n.locale', function() {
    let date = this.get('date');
    if (!moment.isMoment(date)) {
      return;
    }

    const locale = this.get('i18n.locale');
    const format = moment.localeData(locale)
                         .longDateFormat('LLLL')
                         .replace(
                           moment.localeData(locale).longDateFormat('LT'), '')
                         .trim();

    // momentjs object caches the locale on creation
    if (date.locale() !== locale) {
      // we clone the date to allow adjusting timezone without changing the object
      date = date.clone();
      date.locale(locale);
    }

    return date.format(format);
  }),

  hasTime: computed('title', function() {
    return moment.isMoment(this.get('date')) &&
           this.get('title').length === 'YYYY-MM-DDTHH:mm:ss.SSSZ'.length;
  }),

  time: computed('date', {
    get() {
      const date = this.get('date');
      if (!moment.isMoment(date)) {
        return;
      }
      // verify that value is an ISO 8601 date string containg time
      // testing length is faster than parsing with moment
      const value = this.get('title');
      if (value.length !== 'YYYY-MM-DDTHH:mm:ss.SSSZ'.length) {
        return;
      }

      return date.format('HH:mm');
    },
    set(key, value) {
      const date = this.get('date');
      assert(
        'can not set a time if current value is not a valid date',
        moment.isMoment(date)
      );

      // set time to undefined if value is false
      if (Ember.isEmpty(value)) {
        this.set('title', date.format('YYYY-MM-DD'));
        return value;
      }

      if (!moment(value, 'HH:mm', true).isValid()) {
        return value;
      }

      const [ hour, minute ] = value.split(':');
      this.set('title', date.hour(hour).minute(minute).toISOString());
      return value;
    }
  }),

  i18n: Ember.inject.service(),
  init() {
    this.get('i18n.locale');
  }
});
