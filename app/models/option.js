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

  get isDate() {
    const { datetime } = this;
    return datetime !== null && datetime.isValid;
  }

  get day() {
    if (!this.isDate) {
      return null;
    }

    return this.datetime.toISODate();
  }

  get hasTime() {
    return this.isDate &&
           this.title.length >= 'YYYY-MM-DDTHH:mm'.length;
  }

  get time() {
    if (!this.isDate || !this.hasTime) {
      return null;
    }

    return this.datetime.toISOTime().substring(0, 5);
  }
  set time(value) {
    assert(
      'can not set a time if current value is not a valid date',
      this.isDate
    );

    // set time to undefined if value is false
    if (isEmpty(value)) {
      this.set('title', this.day);
      return;
    }

    if (!moment(value, 'HH:mm', true).isValid()) {
      return;
    }

    const [ hours, minutes ] = value.split(':');
    this.set('title', this.datetime.set({ hours, minutes }).toISO());
  }

  init() {
    super.init(...arguments);

    // current locale needs to be consumed in order to be observeable
    // for localization of validation messages
    this.intl.locale;
  }
}
