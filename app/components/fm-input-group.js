import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    add(element) {
      let content = this.get('content');
      let index = content.indexOf(element);

      // To lookup validators, container access is required which can cause an issue with Ember.Object
      // creation if the object is statically imported. The current fix for this is as follows.
      // https://github.com/offirgolan/ember-cp-validations/blob/master/README.md#basic-usage---objects
      let container = this.get('container');
      let newObject = this.get('elementObject').create({ container });

      content
        .insertAt(
          index + 1,
          newObject
        );
    },

    del(element) {
      let content = this.get('content');
      let index = content.indexOf(element);

      if (this.get('canDeleteInputFields')) {
        content
          .removeAt(
            index,
            1
          );
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
