import Ember from "ember";
import {
    validator, buildValidations
}
from 'ember-cp-validations';
/* global moment */

var validCollection = function(collection) {
  // return false if any object in collection is inValid
  return !collection.any((object) => {
    return object.get('validations.isInvalid');
  });
};
var Validations = buildValidations({
  name: validator('presence', {
    presence() {
      // only force presence if anonymousUser poll setting is false
      if (!this.get('model.anonymousUser')) {
        return true;
      }
      else {
        // disable presence validation
        return null;
      }
    },
    dependentKeys: ['anonymousUser']
  }),

  selections: [
    validator('collection', true),

    // all selection objects must be valid
    // if forceAnswer is true in poll settings
    validator(validCollection, {
      dependentKeys: ['forceAnswer', 'selections.[]', 'selections.@each.value']
    })
  ]
});

var SelectionValidations = buildValidations({
  value: validator('presence', {
    presence() {
      // only force present value if forceAnswer is true in poll settings
      if (this.get('model.forceAnswer')) {
        return true;
      }
    },
    dependentKeys: ['forceAnswer']
  })
});

export default Ember.Controller.extend(Validations, {
  actions: {
    submit() {
      if (this.get('validations.isValid')) {
        var user = this.store.createRecord('user', {
          creationDate: new Date(),
          name: this.get('name'),
          poll: this.get('pollController.model'),
          version: this.buildInfo.semver
        });

        var selections = user.get('selections'),
            possibleAnswers = this.get('pollController.model.answers');

        this.get('selections').forEach((selection) => {
          if (selection.get('value') !== null) {
            if (this.get('isFreeText')) {
              selections.createFragment({
                label: selection.get('value')
              });
            }
            else {
              var answer = possibleAnswers.findBy('type', selection.get('value'));
              selections.createFragment({
                icon: answer.get('icon'),
                label: answer.get('label'),
                labelTranslation: answer.get('labelTranslation'),
                type: answer.get('type')
              });
            }
          }
          else {
            selections.createFragment();
          }
        });

        user.save()
        .catch(() => {
          // error: new user is not saved
          this.send('openModal', {
            template: 'save-retry',
            model: {
              record: user
            }
          });
        })
        .then(() => {
          // reset form
          this.set('name', '');
          this.get('selections').forEach((selection) => {
            selection.set('value', null);
          });

          this.transitionToRoute('poll.evaluation', this.get('model'), {
            queryParams: { encryptionKey: this.get('encryption.key') }
          });
        });
      }
    }
  },

  anonymousUser: Ember.computed.readOnly('pollController.model.anonymousUser'),
  encryption: Ember.inject.service(),
  forceAnswer: Ember.computed.readOnly('pollController.model.forceAnswer'),
  isDateTime: Ember.computed.readOnly('pollController.model.isDateTime'),
  isFreeText: Ember.computed.readOnly('pollController.model.isFreeText'),
  isFindADate: Ember.computed.readOnly('pollController.model.isFindADate'),

  name: '',

  pollController: Ember.inject.controller('poll'),

  possibleAnswers: Ember.computed('pollController.model.answers', function() {
    return this.get('pollController.model.answers').map((answer) => {
      var label;

      if (!Ember.isEmpty(answer.get('labelTranslation'))) {
        label = Ember.I18n.t(answer.get('labelTranslation'));
      } else {
        label = answer.get('label');
      }

      return Ember.Object.extend({
        icon: answer.get('icon'),
        label: label,
        type: answer.get('type')
      }).create();
    });
  }),

  selections: Ember.computed('pollController.model.options', 'pollController.dates', function() {
    var options,
        isFindADate = this.get('isFindADate'),
        isDateTime = this.get('isDateTime'),
        dateFormat,
        lastDate;

    if (this.get('isFindADate')) {
      options = this.get('pollController.dates');
    }
    else {
      options = this.get('pollController.model.options');
    }

    if (isDateTime) {
      dateFormat = 'LLLL';
    } else {
      // local specific long date format without times
      dateFormat =
        moment.localeData().longDateFormat('LLLL')
        .replace(
          moment.localeData().longDateFormat('LT'), '')
        .trim();
    }

    return options.map((option) => {
      var label;

      // format label
      if (isFindADate) {
        if (isDateTime && lastDate && option.title.format('YYYY-MM-DD') === lastDate.format('YYYY-MM-DD')) {
          // do not repeat dates for different times
          label = option.title.format('LT');
        } else {
          label = option.title.format(dateFormat);
          lastDate = option.title;
        }
      }
      else {
        label = option.get('title');
      }

      // https://github.com/offirgolan/ember-cp-validations#basic-usage---objects
      // To lookup validators, container access is required which can cause an issue with Ember.Object creation
      // if the object is statically imported. The current fix for this is as follows.
      var container = this.get('container');
      return Ember.Object.extend(SelectionValidations, {
        container,

        // force Answer must be included in model
        // cause otherwise validations can't depend on it
        forceAnswer: this.get('forceAnswer'),

        label: label,
        value: null
      }).create();
    });
  })
});
