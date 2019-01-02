import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { observer, computed, get } from '@ember/object';
import { run, next } from '@ember/runloop';
import BsFormElement from 'ember-bootstrap/components/bs-form/element';
import { any } from 'ember-awesome-macros/array';

export default Component.extend({
  actions: {
    addOption(element) {
      let fragment = this.store.createFragment('option');
      let options = this.options;
      let position = this.options.indexOf(element) + 1;
      options.insertAt(
        position,
        fragment
      );

      next(() => {
        this.notifyPropertyChange('_childViews');
      });
    },
    deleteOption(element) {
      let position = this.options.indexOf(element);
      this.options.removeAt(position);

      next(() => {
        this.notifyPropertyChange('_childViews');
      });
    }
  },

  anyElementHasFeedback: any('childFormElements.@each.hasFeedback', function(childFormElement) {
    return get(childFormElement, 'hasFeedback');
  }),

  anyElementIsInvalid: any('childFormElements.@each.validation', function(childFormElement) {
    return get(childFormElement, 'validation') === 'error';
  }),

  everyElementIsValid: computed('childFormElements.@each.validation', function() {
    const anyElementIsInvalid = this.anyElementIsInvalid;
    if (anyElementIsInvalid) {
      return false;
    }

    // childFormElements contains button wrapper element which should not be taken into account here
    const childFormElements = this.childFormElements.filterBy('hasValidator');
    if (childFormElements) {
      return childFormElements.every((childFormElement) => {
        return childFormElement.get('hasFeedback') && childFormElement.get('validation') === 'success';
      });
    } else {
      return false;
    }
  }),

  childFormElements: computed('_childViews', function() {
    return this.childViews.filter((childView) => {
      return childView instanceof BsFormElement;
    });
  }),

  // Can't use a computed property cause Ember Bootstrap seem to modify validation twice in a single render.
  // Therefor we use the scheduleOnce trick.
  // This is the same for {{create-options-datetime}} component.
  labelValidationClass: 'label-has-no-validation',
  updateLabelValidationClass: observer('anyElementHasFeedback', 'anyElementIsInvalid', 'everyElementIsValid', function() {
    run.scheduleOnce('sync', () => {
      let validationClass;

      if (!this.anyElementHasFeedback) {
        validationClass = 'label-has-no-validation';
      } else if (this.anyElementIsInvalid) {
        validationClass = 'label-has-error';
      } else if (this.everyElementIsValid) {
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
      let options = this.options;
      for (let missingOptions = 2 - this.get('options.length'); missingOptions > 0; missingOptions--) {
        options.pushObject(
          this.store.createFragment('option')
        );
      }
    }
  }).on('init'),

  store: service('store'),

  didInsertElement() {
    // childViews is not observeable by default. Need to notify about a change manually.
    // Lucky enough we know that child views will only be changed on init and if times are added / removed.
    // Use a custom variable to avoid any complications with framework.
    this.notifyPropertyChange('_childViews');
  }
});
