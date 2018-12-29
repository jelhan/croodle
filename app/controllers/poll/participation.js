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
      parent: 'pollController.model',
      attributeInParent: 'users',
      dependentKeys: ['model.poll.users.[]', 'model.poll.users.@each.name', 'model.i18n.locale'],
      disable: readOnly('model.anonymousUser'),
      messageKey: 'unique.name'
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
    submit() {
      if (this.get('validations.isValid')) {
        const user = this.store.createRecord('user', {
          creationDate: new Date(),
          poll: this.get('pollController.model'),
          version: config.APP.version,
        });

        user.set('name', this.get('name'));

        const selections = user.get('selections');
        const possibleAnswers = this.get('pollController.model.answers');

        this.get('selections').forEach((selection) => {
          if (selection.get('value') !== null) {
            if (this.get('isFreeText')) {
              selections.createFragment({
                label: selection.get('value')
              });
            } else {
              const answer = possibleAnswers.findBy('type', selection.get('value'));
              selections.createFragment({
                icon: answer.get('icon'),
                label: answer.get('label'),
                labelTranslation: answer.get('labelTranslation'),
                type: answer.get('type')
              });
            }
          } else {
            selections.createFragment();
          }
        });

        this.set('newUserRecord', user);
        this.send('save');
      }
    },
    save() {
      const user = this.get('newUserRecord');
      user.save()
      .then(() => {
        this.set('savingFailed', false);

        // reset form
        this.set('name', '');
        this.get('selections').forEach((selection) => {
          selection.set('value', null);
        });

        this.transitionToRoute('poll.evaluation', this.get('model'), {
          queryParams: { encryptionKey: this.get('encryption.key') }
        });
      }, () => {
        this.set('savingFailed', true);
      });
    }
  },

  anonymousUser: readOnly('pollController.model.anonymousUser'),
  currentLocale: readOnly('i18n.locale'),
  encryption: service(),
  forceAnswer: readOnly('pollController.model.forceAnswer'),
  i18n: service(),

  init() {
    this._super(...arguments);

    this.get('i18n.locale');
  },

  isFreeText: readOnly('pollController.model.isFreeText'),
  isFindADate: readOnly('pollController.model.isFindADate'),

  momentLongDayFormat: readOnly('pollController.momentLongDayFormat'),

  name: '',

  options: readOnly('pollController.model.options'),

  pollController: controller('poll'),

  possibleAnswers: computed('pollController.model.answers', function() {
    return this.get('pollController.model.answers').map((answer) => {
      const owner = getOwner(this);

      const AnswerObject = EmberObject.extend({
        icon: answer.get('icon'),
        type: answer.get('type')
      });

      if (!isEmpty(answer.get('labelTranslation'))) {
        return AnswerObject.extend(owner.ownerInjection(), {
          i18n: service(),
          label: computed('i18n.locale', function() {
            return this.get('i18n').t(this.get('labelTranslation'));
          }),
          labelTranslation: answer.get('labelTranslation')
        }).create();
      } else {
        return AnswerObject.extend({
          label: answer.get('label')
        });
      }
    });
  }),

  savingFailed: false,

  selections: computed('options', 'pollController.dates', function() {
    let options = this.get('options');
    let isFindADate = this.get('isFindADate');
    let lastDate;

    // https://github.com/offirgolan/ember-cp-validations#basic-usage---objects
    // To lookup validators, container access is required which can cause an issue with Object creation
    // if the object is statically imported. The current fix for this is as follows.
    let owner = getOwner(this);
    let SelectionObject = EmberObject.extend(owner.ownerInjection(), SelectionValidations, {
      // forceAnswer and isFreeText must be included in model
      // cause otherwise validations can't depend on it
      forceAnswer: this.get('forceAnswer'),
      isFreeText: this.get('isFreeText'),
      value: null
    });

    return options.map((option) => {
      let labelValue;
      let momentFormat;
      let value = option.get('title');

      // format label
      if (isFindADate) {
        let hasTime = value.length > 10; // 'YYYY-MM-DD'.length === 10
        let timezone = this.get('timezone');
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

      return SelectionObject.create({
        labelValue,
        momentFormat
      });
    });
  }),

  timezone: readOnly('pollController.timezone')
});
