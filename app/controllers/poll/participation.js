import Ember from "ember";
import EmberValidations from 'ember-validations';

export default Ember.Controller.extend(EmberValidations.Mixin, {
  dates: Ember.computed.reads('pollController.dates'),
  dateGroups: Ember.computed.reads('pollController.dateGroups'),
  encryption: Ember.inject.service(),
  newUserName: '',
  pollController: Ember.inject.controller('poll'),

  actions: {
    addNewUser: function(){
      var newUser = {
        name: this.get('newUserName'),
        selections: []
      };
      var self = this;

      // work-a-round cause value is not retrived otherwise
      this.get('newUserSelections').forEach(function(selection) {
        if(typeof selection.get('value') === 'string') {
          newUser.selections.pushObject(
            self.store.createFragment('selection', {
              label: selection.get('value')
            })
          );
        }
        else {
          newUser.selections.pushObject(
            self.store.createFragment('selection', {
              type: selection.get('value.type'),
              label: selection.get('value.label'),
              labelTranslation: selection.get('value.labelTranslation'),
              icon: selection.get('value.icon')
            })
          );
        }
      });

      // send new user to controller for saving
      this.send('saveNewUser', newUser);

      // clear input fields
      this.set('newUserName', '');
      this.get('newUserSelections').forEach(function(selection){
        selection.set('value', '');
      });

      // reset validation erros
      this.set('errors.newUserName', '');
      this.set('errors.everyOptionIsAnswered', '');

      Ember.run.scheduleOnce('afterRender', this, function(){
        // recalculate fixedHeaders
        Ember.$('.user-selections-table').floatThead('reflow');
      });

      Ember.run.scheduleOnce('afterRender', this, function(){
        // resize top scrollbars
        Ember.$('.top-scrollbar div').css('width', Ember.$('.user-selections-table').width() );
        Ember.$('.top-scrollbar-floatThead').css('width', Ember.$('.table-scroll').outerWidth() );
        Ember.$('.top-scrollbar-floatThead div').css('width', Ember.$('.user-selections-table').width() );
      });
    },

    /*
     * save a new user
     */
    saveNewUser: function(user){
      var self = this;

      // create new user record in store
      var newUser = this.store.createRecord('user', {
        name: user.name,
        creationDate: new Date(),
        poll: this.get('model'),
        selections: user.selections,
        version: this.buildInfo.semver
      });

      // save new user
      newUser.save()
        .then(() => {
          this.transitionTo('poll.evaluation', this.get('model'), {
            queryParams: { encryptionKey: this.get('encryption.key') }
          });
        })
        .catch(function(){
        // error: new user is not saved
        self.send('openModal', {
          template: 'save-retry',
          model: {
            record: newUser
          }
        });
      });
    },

    submitNewUser: function(){
      var self = this;
      this.validate().then(function() {
        self.send('addNewUser');
      }).catch(function(){
        Ember.$.each(Ember.View.views, function(id, view) {
          if(view.isEasyForm) {
            view.focusOut();
          }
        });
      });
    }
  },

  /*
   * returns true if user has selected an answer for every option provided
   */
  everyOptionIsAnswered: function(){
    try {
      var newUserSelections = this.get('newUserSelections'),
          allAnswered = true;

      if (typeof newUserSelections === 'undefined') {
        return false;
      }

      newUserSelections.forEach(function(item){
        if (Ember.isEmpty(item.value)) {
          allAnswered = false;
        }
      });

      return allAnswered;
    }
    catch (e) {
      return false;
    }
  }.property('newUserSelections.@each.value'),

  /*
   * switch isValid state
   * is needed for disable submit button
   */
  isNotValid: function(){
    return !this.get('isValid');
  }.property('isValid'),

  // array to store selections of new user
  newUserSelections: function(){
    var newUserSelections = Ember.A(),
        options = this.get('model.options');

    options.forEach(function(){
      var newSelection = Ember.Object.create({value: ''});
      newUserSelections.pushObject(newSelection);
    });

    return newUserSelections;
  }.property('model.options'),

  optionCount: function() {
    return this.get('model.options.length');
  }.property('model.options'),

  validations: {
    everyOptionIsAnswered: {
      /*
       * validate if every option is answered
       * if it's forced by poll settings (forceAnswer === true)
       *
       * using a computed property therefore which returns true / false
       * in combinatoin with acceptance validator
       *
       * ToDo: Show validation errors
       */
      acceptance: {
        if: function(object){
            return object.get('model.forceAnswer');
        },
        message: Ember.I18n.t('poll.error.newUser.everyOptionIsAnswered')
      }
    },

    newUserName: {
      presence: {
        message: Ember.I18n.t('poll.error.newUserName'),

        /*
         * validate if a user name is given
         * if it's forced by poll settings (anonymousUser === false)
         */
        unless: function(object){
            /* have in mind that anonymousUser is undefined on init */
            return object.get('model.anonymousUser');
        }
      }
    }
  }
});
