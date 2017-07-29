import Ember from 'ember';
import {
    validator, buildValidations
}
from 'ember-cp-validations';
import moment from 'moment';

const {
  computed,
  Controller,
  getOwner,
  inject,
  isEmpty,
  Object: EmberObject
} = Ember;

const validCollection = function(collection) {
  // return false if any object in collection is inValid
  return !collection.any((object) => {
    return object.get('validations.isInvalid');
  });
};
const Validations = buildValidations({
  name: [
    validator('presence', {
      presence() {
        // only force presence if anonymousUser poll setting is false
        if (!this.get('model.anonymousUser')) {
          return true;
        } else {
          // disable presence validation
          return null;
        }
      },
      dependentKeys: ['anonymousUser', 'i18n.locale']
    }),
    validator('unique', {
      parent: 'pollController.model',
      attributeInParent: 'users',
      dependentKeys: ['poll.users.[]', 'poll.users.@each.name', 'i18n.locale'],
      disable() {
        return this.get('model.anonymousUser');
      },
      messageKey: 'unique.name'
    })
  ],

  selections: [
    validator('collection', true),

    // all selection objects must be valid
    // if forceAnswer is true in poll settings
    validator(validCollection, {
      dependentKeys: ['forceAnswer', 'selections.[]', 'selections.@each.value', 'i18n.locale']
    })
  ]
});

const SelectionValidations = buildValidations({
  value: validator('presence', {
    presence() {
      // only force present value if forceAnswer is true in poll settings
      if (this.get('model.forceAnswer')) {
        return true;
      }
    },
    messageKey() {
      if (this.get('model.isFreeText')) {
        return 'errors.present';
      } else {
        return 'errors.present.answer.selection';
      }
    },
    dependentKeys: ['isFreeText', 'forceAnswer', 'i18n.locale']
  })
});

export default Controller.extend(Validations, {
  actions: {
    submit() {
      if (this.get('validations.isValid')) {
        const user = this.store.createRecord('user', {
          creationDate: new Date(),
          poll: this.get('pollController.model'),
          version: this.buildInfo.semver
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

  anonymousUser: computed.readOnly('pollController.model.anonymousUser'),
  encryption: inject.service(),
  forceAnswer: computed.readOnly('pollController.model.forceAnswer'),
  i18n: inject.service(),

  init() {
    this.get('i18n.locale');
  },

  isFreeText: computed.readOnly('pollController.model.isFreeText'),
  isFindADate: computed.readOnly('pollController.model.isFindADate'),

  name: '',

  pollController: inject.controller('poll'),

  possibleAnswers: computed('pollController.model.answers', function() {
    return this.get('pollController.model.answers').map((answer) => {
      const owner = getOwner(this);

      const AnswerObject = EmberObject.extend({
        icon: answer.get('icon'),
        type: answer.get('type')
      });

      if (!isEmpty(answer.get('labelTranslation'))) {
        return AnswerObject.extend(owner.ownerInjection(), {
          i18n: inject.service(),
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

  selections: computed('pollController.model.options', 'pollController.dates', function() {
    let options;
    let isFindADate = this.get('isFindADate');
    let lastDate;

    if (this.get('isFindADate')) {
      options = this.get('pollController.dates');
    } else {
      options = this.get('pollController.model.options');
    }

    return options.map((option) => {
      let labelFormat;
      let labelValue;

      // format label
      if (isFindADate) {
        if (option.get('hasTime') && lastDate && option.get('date').format('YYYY-MM-DD') === lastDate.format('YYYY-MM-DD')) {
          // do not repeat dates for different times
          labelValue = option.get('date');
          labelFormat = 'time';
        } else {
          labelValue = option.get('date');
          labelFormat = option.get('hasTime') ? 'day-with-time' : 'day';
          lastDate = option.get('date');
        }
      } else {
        labelValue = option.get('title');
        labelFormat = 'plain';
      }

      // https://github.com/offirgolan/ember-cp-validations#basic-usage---objects
      // To lookup validators, container access is required which can cause an issue with Object creation
      // if the object is statically imported. The current fix for this is as follows.
      const owner = getOwner(this);
      return EmberObject.extend(owner.ownerInjection(), SelectionValidations, {
        // forceAnswer and isFreeText must be included in model
        // cause otherwise validations can't depend on it
        forceAnswer: this.get('forceAnswer'),
        isFreeText: this.get('isFreeText'),

        // a little bit hacky
        // wasn't able to observe moment.locale since it should be in sync
        // with i18n.locale we observe this one
        // moment object stores it locale once it was created, therefore has
        // to update the locale
        // momentFormat from ember-moment does not currently observes locale
        // changes https://github.com/stefanpenner/ember-moment/issues/108
        // but that should be the way to go
        label: computed('i18n.locale', function() {
          let labelFormat = this.get('labelFormat');

          if (labelFormat === 'plain') {
            return this.get('labelValue');
          }

          let currentLocale = this.get('i18n.locale');
          let momentFormat;

          switch (labelFormat) {
            case 'time':
              momentFormat = 'LT';
              break;

            case 'day-with-time':
              momentFormat = 'LLLL';
              break;

            case 'day':
              momentFormat = moment.localeData(currentLocale)
                .longDateFormat('LLLL')
                .replace(moment.localeData(currentLocale).longDateFormat('LT'), '')
                .trim();
              break;
          }

          return this.get('labelValue')
                   .locale(currentLocale)
                   .format(momentFormat);
        }),
        labelFormat,
        labelValue,
        i18n: inject.service(),
        init() {
          this.get('i18n.locale');
        },
        value: null
      }).create();
    });
  })
});
