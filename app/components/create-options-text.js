import Ember from 'ember';
import BsForm from 'ember-bootstrap/components/bs-form';

export default Ember.Component.extend({
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

  anyElementHasFeedback: Ember.computed('form.childFormElements.@each.hasFeedback', function() {
    const childFormElements = this.get('form.childFormElements');

    if (childFormElements) {
      return childFormElements.any((childFormElement) => {
        return childFormElement.get('hasFeedback');
      });
    } else {
      return false;
    }
  }),

  anyElementIsInvalid: Ember.computed('form.childFormElements.@each.validation', function() {
    const childFormElements = this.get('form.childFormElements');

    if (childFormElements) {
      return childFormElements.any((childFormElement) => {
        return childFormElement.get('validation') === 'error';
      });
    } else {
      return false;
    }
  }),

  everyElementIsValid: Ember.computed('form.childFormElements.@each.validation', function() {
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
  registerForm: Ember.on('didInsertElement', function() {
    this.set('form', this.nearestOfType(BsForm));
  }),

  labelValidationClass: Ember.computed('anyElementHasFeedback', 'anyElementIsInvalid', 'everyElementIsValid', function() {
    if (!this.get('anyElementHasFeedback')) {
      return 'label-has-no-validation';
    } else if (this.get('anyElementIsInvalid')) {
      return 'label-has-error';
    } else if (this.get('everyElementIsValid')) {
      return 'label-has-success';
    } else {
      return 'label-has-no-validation';
    }
  }),

  classNameBindings: ['labelValidationClass'],

  enforceMinimalOptionsAmount: Ember.observer('options', 'isMakeAPoll', function() {
    if (this.get('options.length') < 2) {
      let options = this.get('options');
      for (let missingOptions = 2 - this.get('options.length'); missingOptions > 0; missingOptions--) {
        options.pushObject(
          this.get('store').createFragment('option')
        );
      }
    }
  }).on('init'),

  store: Ember.inject.service('store')
});
