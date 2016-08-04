import Ember from 'ember';
import {
    validator, buildValidations
}
from 'ember-cp-validations';
import moment from 'moment';

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

export default Ember.Controller.extend(Validations, {
  actions: {
    submit() {
      if (this.get('validations.isValid')) {
        const user = this.get('newUserRecord') || this.store.createRecord('user', {
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

  anonymousUser: Ember.computed.readOnly('pollController.model.anonymousUser'),
  encryption: Ember.inject.service(),
  forceAnswer: Ember.computed.readOnly('pollController.model.forceAnswer'),
  i18n: Ember.inject.service(),

  init() {
    this.get('i18n.locale');
  },

  isFreeText: Ember.computed.readOnly('pollController.model.isFreeText'),
  isFindADate: Ember.computed.readOnly('pollController.model.isFindADate'),

  name: '',

  pollController: Ember.inject.controller('poll'),

  possibleAnswers: Ember.computed('pollController.model.answers', function() {
    return this.get('pollController.model.answers').map((answer) => {
      const container = this.get('container');

      const AnswerObject = Ember.Object.extend({
        icon: answer.get('icon'),
        type: answer.get('type')
      });

      if (!Ember.isEmpty(answer.get('labelTranslation'))) {
        return AnswerObject.extend({
          container,
          i18n: Ember.inject.service(),
          label: Ember.computed('i18n.locale', function() {
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

  selections: Ember.computed('pollController.model.options', 'pollController.dates', function() {
    let options;
    const isFindADate = this.get('isFindADate');
    let lastDate;
    const dateFormat = moment.localeData()
      .longDateFormat('LLLL')
      .replace(
        moment.localeData().longDateFormat('LT'), '')
      .trim();
    const dateTimeFormat = 'LLLL';

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
        if (option.hasTime && lastDate && option.title.format('YYYY-MM-DD') === lastDate.format('YYYY-MM-DD')) {
          // do not repeat dates for different times
          labelValue = option.title;
          labelFormat = 'LT';
        } else {
          labelValue = option.title;
          labelFormat = option.hasTime ? dateTimeFormat : dateFormat;
          lastDate = option.title;
        }
      } else {
        labelValue = option.get('title');
        labelFormat = false;
      }

      // https://github.com/offirgolan/ember-cp-validations#basic-usage---objects
      // To lookup validators, container access is required which can cause an issue with Ember.Object creation
      // if the object is statically imported. The current fix for this is as follows.
      const container = this.get('container');
      return Ember.Object.extend(SelectionValidations, {
        container,

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
        label: Ember.computed('i18n.locale', function() {
          if (this.get('labelFormat') === false) {
            return this.get('labelValue');
          } else {
            return this.get('labelValue').locale(this.get('i18n.locale')).format(this.get('labelFormat'));
          }
        }),
        labelFormat,
        labelValue,
        i18n: Ember.inject.service(),
        init() {
          this.get('i18n.locale');
        },
        value: null
      }).create();
    });
  })
});
