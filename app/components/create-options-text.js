import Ember from 'ember';
import BsForm from 'ember-bootstrap/components/bs-form';
import { anyBy } from 'ember-array-computed-macros';

const { Component, computed, inject, observer, on, run } = Ember;

export default Component.extend({
  actions: {
    addOption(element) {
      let fragment = this.get('store').createFragment('option');
      let options = this.get('options');
      let position = this.get('options').indexOf(element) + 1;
      options.insertAt(
        position,
        fragment
      );
    },
    deleteOption(element) {
      let position = this.get('options').indexOf(element);
      this.get('options').removeAt(position);
    }
  },

  anyElementHasFeedback: anyBy('form.childFormElements', 'hasFeedback'),

  anyElementIsInvalid: anyBy('form.childFormElements', 'validation', function(value) {
    return value === 'error';
  }),

  everyElementIsValid: computed('form.childFormElements.@each.validation', function() {
    const anyElementIsInvalid = this.get('anyElementIsInvalid');
    if (anyElementIsInvalid) {
      return false;
    }

    // childFormElements contains button wrapper element which should not be taken into account here
    const childFormElements = this.get('form.childFormElements').filterBy('hasValidator');
    if (childFormElements) {
      return childFormElements.every((childFormElement) => {
        return childFormElement.get('hasFeedback') && childFormElement.get('validation') === 'success';
      });
    } else {
      return false;
    }
  }),

  form: null,
  registerForm: on('didInsertElement', function() {
    this.set('form', this.nearestOfType(BsForm));
  }),

  labelValidationClass: 'label-has-no-validation',
  updateLabelValidationClass: observer('anyElementHasFeedback', 'anyElementIsInvalid', 'everyElementIsValid', function() {
    run.scheduleOnce('sync', () => {
      let validationClass;

      if (!this.get('anyElementHasFeedback')) {
        validationClass = 'label-has-no-validation';
      } else if (this.get('anyElementIsInvalid')) {
        validationClass = 'label-has-error';
      } else if (this.get('everyElementIsValid')) {
        validationClass = 'label-has-success';
      } else {
        validationClass = 'label-has-no-validation';
      }

      this.set('labelValidationClass', validationClass);
    });
  }).on('init'),

  classNameBindings: ['labelValidationClass'],

  enforceMinimalOptionsAmount: observer('options', 'isMakeAPoll', function() {
    if (this.get('options.length') < 2) {
      let options = this.get('options');
      for (let missingOptions = 2 - this.get('options.length'); missingOptions > 0; missingOptions--) {
        options.pushObject(
          this.get('store').createFragment('option')
        );
      }
    }
  }).on('init'),

  store: inject.service('store')
});
