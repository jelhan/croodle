import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';
import { attr } from '@ember-data/model';
import { assert } from '@ember/debug';
import { isEmpty } from '@ember/utils';
import moment from 'moment';
import { DateTime } from 'luxon';
import Fragment from 'ember-data-model-fragments/fragment';
import { fragmentOwner } from 'ember-data-model-fragments/attributes';
import {
  validator, buildValidations
}
from 'ember-cp-validations';

const Validations = buildValidations({
  isPartiallyFilled: validator('falsy', {
    descriptionKey: 'errors.timeNotPartially',
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
    }),
    validator('presence', {
      presence: true,
    }),
    validator('unique', {
      parent: 'poll',
      attributeInParent: 'options',
      dependentKeys: ['model.poll.options.[]', 'model.poll.options.@each.title', 'model.intl.locale'],
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

@classic
export default class Option extends Fragment.extend(Validations) {
  @service
  intl;

  @fragmentOwner()
  poll;

  @attr('string')
  title;

  // isPartiallyFilled should be set only for times on creation if input is filled
  // partially (e.g. "11:--"). It's required cause ember-cp-validations does not
  // provide any method to push a validation error into validations. It's only
  // working based on a property of the model.
  isPartiallyFilled = false;

  get datetime() {
    const { title } = this;

    if (isEmpty(title)) {
      return null;
    }

    return DateTime.fromISO(title);
  }

  get day() {
    const { datetime } = this;

    if (!datetime) {
      return null;
    }

    return datetime.toISODate();
  }

  @computed('title')
  get date() {
    const allowedFormats = [
      'YYYY-MM-DD',
      'YYYY-MM-DDTHH:mm:ss.SSSZ'
    ];
    const value = this.title;
    if (isEmpty(value)) {
      return null;
    }

    const format = allowedFormats.find((f) => {
      // if format length does not match value length
      // string can't be in this format
      return f.length === value.length && moment(value, f, true).isValid();
    });
    if (isEmpty(format)) {
      return null;
    }

    return moment(value, format, true);
  }

  @computed('date', 'title.length')
  get hasTime() {
    return moment.isMoment(this.date) &&
           this.title.length === 'YYYY-MM-DDTHH:mm:ss.SSSZ'.length;
  }

  @computed('date', 'title')
  get time() {
    const date = this.date;
    if (!moment.isMoment(date)) {
      return null;
    }
    // verify that value is an ISO 8601 date string containg time
    // testing length is faster than parsing with moment
    const value = this.title;
    if (value.length !== 'YYYY-MM-DDTHH:mm:ss.SSSZ'.length) {
      return null;
    }

    return date.format('HH:mm');
  }
  set time(value) {
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

  init() {
    super.init(...arguments);

    // current locale needs to be consumed in order to be observeable
    // for localization of validation messages
    this.intl.locale;
  }
}
