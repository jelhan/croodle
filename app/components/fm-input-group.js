import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    add(element) {
      this.sendAction('addElement', element);
    },

    del(element) {
      if (this.get('canDeleteInputFields')) {
        this.sendAction('deleteElement', element);
      }
    },

    userInteraction() {
      if (!this.get('shouldShowErrors')) {
        this.set('shouldShowErrors', true);
      }
    }
  },

  canDeleteInputFields: Ember.computed('minimumInputFields', 'content.[]', function() {
    if (this.get('content.length') > this.get('minimumInputFields')) {
      return true;
    } else {
      return false;
    }
  }),

  canNotDeleteInputFields: Ember.computed('canDeleteInputFields', function() {
    return !this.get('canDeleteInputFields');
  }),

  classNames: ['grouped-input'],
  classNameBindings: ['errorClass'],

  errors: [],

  errorClass: Ember.computed('showErrors', 'errors', function() {
    if (this.get('showErrors')) {
      return this.get('fmConfig').errorClass;
    }
  }),

  fmConfig: Ember.inject.service('fm-config'),

  minimumInputFields: 1,

  shouldShowErrors: false,

  step: undefined,

  type: undefined
});
