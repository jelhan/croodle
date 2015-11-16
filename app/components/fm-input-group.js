import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    add(element) {
      var content = this.get('content'),
          index = content.indexOf(element);

      content
        .insertAt(
          index + 1,
          this.get('elementObject').create()
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
