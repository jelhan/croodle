import { inject as service } from '@ember/service';
import { readOnly, not } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';
import { getOwner } from '@ember/application';
import { isPresent, isEmpty } from '@ember/utils';
import EmberObject, { computed } from '@ember/object';
import {
    validator, buildValidations
}
from 'ember-cp-validations';
import moment from 'moment';
import config from 'croodle/config/environment';

const validCollection = function(collection) {
  // return false if any object in collection is inValid
  return !collection.any((object) => {
    return object.get('validations.isInvalid');
  });
};
const Validations = buildValidations({
  name: [
    validator('presence', {
      presence: true,
      disabled: readOnly('model.anonymousUser'),
      dependentKeys: ['model.i18n.locale']
    }),
    validator('unique', {
      parent: 'poll',
      attributeInParent: 'users',
      dependentKeys: ['model.poll.users.[]', 'model.poll.users.@each.name', 'model.i18n.locale'],
      disable: readOnly('model.anonymousUser'),
      messageKey: 'errors.unique.name',
      ignoreNewRecords: true,
    })
  ],

  selections: [
    validator('collection', true),

    // all selection objects must be valid
    // if forceAnswer is true in poll settings
    validator(validCollection, {
      dependentKeys: ['model.forceAnswer', 'model.selections.[]', 'model.selections.@each.value', 'model.i18n.locale']
    })
  ]
});

const SelectionValidations = buildValidations({
  value: validator('presence', {
    presence: true,
    disabled: not('model.forceAnswer'),
    messageKey: computed('model.isFreeText', function() {
      return this.get('model.isFreeText') ? 'errors.present' : 'errors.present.answer.selection';
    }),
    dependentKeys: ['model.i18n.locale']
  })
});

export default Controller.extend(Validations, {
  actions: {
    async submit() {
      if (!this.get('validations.isValid')) {
        return;
      }

      let poll = this.poll;
      let selections = this.selections.map(({ value }) => {
        if (value === null) {
          return {};
        }

        if (this.isFreeText) {
          return {
            label: value,
          };
        }

        // map selection to answer if it's not freetext
        let answer = poll.answers.findBy('type', value);
        let { icon, label, labelTranslation, type } = answer;

        return {
          icon,
          label,
          labelTranslation,
          type,
        };
      });
      let user = this.store.createRecord('user', {
        creationDate: new Date(),
        name: this.name,
        poll,
        selections,
        version: config.APP.version,
      });

      this.set('newUserRecord', user);
      await this.actions.save.bind(this)();
    },
    async save() {
      let user = this.newUserRecord;

      try {
        await user.save();

        this.set('savingFailed', false);
      } catch (error) {
        // couldn't save user model
        this.set('savingFailed', true);

        return;
      }

      // reset form
      this.set('name', '');
      this.selections.forEach((selection) => {
        selection.set('value', null);
      });

      this.transitionToRoute('poll.evaluation', this.model, {
        queryParams: { encryptionKey: this.encryption.key }
      });
    }
  },

  anonymousUser: readOnly('poll.anonymousUser'),
  currentLocale: readOnly('i18n.locale'),
  encryption: service(),
  forceAnswer: readOnly('poll.forceAnswer'),
  i18n: service(),

  init() {
    this._super(...arguments);

    this.get('i18n.locale');
  },

  isFreeText: readOnly('poll.isFreeText'),
  isFindADate: readOnly('poll.isFindADate'),

  momentLongDayFormat: readOnly('pollController.momentLongDayFormat'),

  name: '',

  options: readOnly('poll.options'),

  poll: readOnly('model'),
  pollController: controller('poll'),

  possibleAnswers: computed('poll.answers', function() {
    return this.get('poll.answers').map((answer) => {
      const owner = getOwner(this);

      const AnswerObject = EmberObject.extend({
        icon: answer.get('icon'),
        type: answer.get('type')
      });

      if (!isEmpty(answer.get('labelTranslation'))) {
        return AnswerObject.extend({
          i18n: service(),
          label: computed('i18n.locale', function() {
            return this.i18n.t(this.labelTranslation);
          }),
          labelTranslation: answer.get('labelTranslation')
        }).create(owner.ownerInjection());
      } else {
        return AnswerObject.extend({
          label: answer.get('label')
        });
      }
    });
  }),

  savingFailed: false,

  selections: computed('options', 'pollController.dates', function() {
    let options = this.options;
    let isFindADate = this.isFindADate;
    let lastDate;

    let SelectionObject = EmberObject.extend(SelectionValidations, {
      // forceAnswer and isFreeText must be included in model
      // cause otherwise validations can't depend on it
      forceAnswer: this.forceAnswer,
      isFreeText: this.isFreeText,
      value: null
    });

    return options.map((option) => {
      let labelValue;
      let momentFormat;
      let value = option.get('title');

      // format label
      if (isFindADate) {
        let hasTime = value.length > 10; // 'YYYY-MM-DD'.length === 10
        let timezone = this.timezone;
        let date = isPresent(timezone) ? moment.tz(value, timezone) : moment(value);
        if (hasTime && lastDate && date.format('YYYY-MM-DD') === lastDate.format('YYYY-MM-DD')) {
          labelValue = value;
          // do not repeat dates for different times
          momentFormat = 'LT';
        } else {
          labelValue = value;
          momentFormat = hasTime ? 'LLLL' : 'day';
          lastDate = date;
        }
      } else {
        labelValue = value;
      }

      // https://github.com/offirgolan/ember-cp-validations#basic-usage---objects
      // To lookup validators, container access is required which can cause an issue with Object creation
      // if the object is statically imported. The current fix for this is as follows.
      let owner = getOwner(this);
      return SelectionObject.create(owner.ownerInjection(), {
        labelValue,
        momentFormat
      });
    });
  }),

  timezone: readOnly('pollController.timezone')
});
