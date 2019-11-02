import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';
import { assert } from '@ember/debug';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import DS from 'ember-data';
import moment from 'moment';
import Fragment from 'ember-data-model-fragments/fragment';
import { fragmentOwner } from 'ember-data-model-fragments/attributes';
import {
  validator, buildValidations
}
from 'ember-cp-validations';

const { attr } = DS;

const Validations = buildValidations({
  isPartiallyFilled: validator('falsy', {
    messageKey: 'errors.time.notPartially',
    dependentKeys: ['model.i18n.locale'],
  }),
  title: [
    validator('iso8601', {
      active: readOnly('model.poll.isFindADate'),
      validFormats: [
        'YYYY-MM-DD',
        'YYYY-MM-DDTHH:mmZ',
        'YYYY-MM-DDTHH:mm:ssZ',
        'YYYY-MM-DDTHH:mm:ss.SSSZ'
      ],
      dependentKeys: ['model.i18n.locale']
    }),
    validator('presence', {
      presence: true,
      dependentKeys: ['model.i18n.locale']
    }),
    validator('unique', {
      parent: 'poll',
      attributeInParent: 'options',
      dependentKeys: ['model.poll.options.[]', 'model.poll.options.@each.title', 'model.i18n.locale'],
      descriptionKey: computed('model.poll.isFindADate', function() {
        let isFindADate = this.get('model.poll.isFindADate');
        return isFindADate ? 'times' : 'options';
      })
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
    }),
    // alias is partially filled validation as that's part of time validation
    validator('alias', {
      alias: 'isPartiallyFilled',
    }),
  ]
});

export default Fragment.extend(Validations, {
  poll: fragmentOwner(),
  title: attr('string'),

  date: computed('title', function() {
    const allowedFormats = [
      'YYYY-MM-DD',
      'YYYY-MM-DDTHH:mm:ss.SSSZ'
    ];
    const value = this.title;
    if (isEmpty(value)) {
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
    const date = this.date;
    if (!moment.isMoment(date)) {
      return;
    }
    return date.format('YYYY-MM-DD');
  }),

  dayFormatted: computed('date', 'i18n.locale', function() {
    let date = this.date;
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
    return moment.isMoment(this.date) &&
           this.title.length === 'YYYY-MM-DDTHH:mm:ss.SSSZ'.length;
  }),

  // isPartiallyFilled should be set only for times on creation if input is filled
  // partially (e.g. "11:--"). It's required cause ember-cp-validations does not
  // provide any method to push a validation error into validations. It's only
  // working based on a property of the model.
  isPartiallyFilled: false,

  time: computed('date', {
    get() {
      const date = this.date;
      if (!moment.isMoment(date)) {
        return;
      }
      // verify that value is an ISO 8601 date string containg time
      // testing length is faster than parsing with moment
      const value = this.title;
      if (value.length !== 'YYYY-MM-DDTHH:mm:ss.SSSZ'.length) {
        return;
      }

      return date.format('HH:mm');
    },
    set(key, value) {
      let date = this.date;
      assert(
        'can not set a time if current value is not a valid date',
        moment.isMoment(date)
      );

      // set time to undefined if value is false
      if (isEmpty(value)) {
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

  i18n: service(),
  init() {
    this.get('i18n.locale');
  }
});
