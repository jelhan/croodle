import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    add(element) {
      let content = this.get('content');
      let index = content.indexOf(element);

      this.sendAction('addElement', index + 1);
    },

    del(element) {
      if (this.get('canDeleteInputFields')) {
        let content = this.get('content');
        let index = content.indexOf(element);
        this.sendAction('deleteElement', index);
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
  showErrors: Ember.computed('shouldShowErrors', 'errors', function() {
    return this.get('shouldShowErrors') && !Ember.isEmpty(this.get('errors'));
  }),

  step: undefined,

  type: undefined
});
