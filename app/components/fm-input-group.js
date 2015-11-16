import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    add(element) {
      var content = this.get('content'),
          index = content.indexOf(element);

      // To lookup validators, container access is required which can cause an issue with Ember.Object
      // creation if the object is statically imported. The current fix for this is as follows.
      // https://github.com/offirgolan/ember-cp-validations/blob/master/README.md#basic-usage---objects
      var container = this.get('container'),
          newObject = this.get('elementObject').create({container});

      content
        .insertAt(
          index + 1,
          newObject
        );
    },

    del(element) {
      var content = this.get('content'),
          index = content.indexOf(element);

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

  errorClass: Ember.computed('errors', 'shouldShowErrors', function() {
    if(!Ember.isEmpty(this.get('errors')) && this.get('shouldShowErrors')) {
      return this.fmconfig.errorClass;
    }
  }),

  minimumInputFields: 1,

  shouldShowErrors: false
});
