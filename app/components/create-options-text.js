import { inject as service } from '@ember/service';
import { filter } from '@ember/object/computed';
import Component from '@ember/component';
import { observer, computed, get } from '@ember/object';
import { run } from '@ember/runloop';
import BsFormElement from 'ember-bootstrap/components/bs-form/element';
import { any } from 'ember-awesome-macros/array';

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

  anyElementHasFeedback: any('childFormElements.@each.hasFeedback', function(childFormElement) {
    return get(childFormElement, 'hasFeedback');
  }),

  anyElementIsInvalid: any('childFormElements.@each.validation', function(childFormElement) {
    return get(childFormElement, 'validation') === 'error';
  }),

  everyElementIsValid: computed('childFormElements.@each.validation', function() {
    const anyElementIsInvalid = this.get('anyElementIsInvalid');
    if (anyElementIsInvalid) {
      return false;
    }

    // childFormElements contains button wrapper element which should not be taken into account here
    const childFormElements = this.get('childFormElements').filterBy('hasValidator');
    if (childFormElements) {
      return childFormElements.every((childFormElement) => {
        return childFormElement.get('hasFeedback') && childFormElement.get('validation') === 'success';
      });
    } else {
      return false;
    }
  }),

  childFormElements: filter('childViews', function(childView) {
    return childView instanceof BsFormElement;
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

  store: service('store')
});
