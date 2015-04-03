import Ember from "ember";
import EmberValidations from 'ember-validations';

export default Ember.ObjectController.extend(EmberValidations.Mixin, {
    encryptionKey: '',
    newUserName: '',
    queryParams: ['encryptionKey'],

    actions: {
        addNewUser: function(){
            var newUser = {
                name: this.get('newUserName'),
                selections: this.get('newUserSelections')
            };
            
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
            selections: user.selections
          });

          // save new user
          newUser.save().catch(function(){
            // error: new user is not saved
            self.send('openModal', {
              template: 'save-retry',
              model: {
                record: newUser
              }
            });
          });
        },
        
        submitNewUser: function() {
          this.validate();
          
          Ember.$.each(Ember.View.views, function(id, view) {
            if(view.isEasyForm) {
              view.focusOut();
            }
          });

          if (this.get('isValid')) {
            // tricker save action
            this.send('addNewUser');
          }
        }
    },
    
    dateGroups: function() {
      // group dates only for find a date with times
      if ( this.get('isFindADate') !== true ||
           this.get('isDateTime') !== true ) {
        return [];
      }
      
      var datetimes = this.get('dates'),
          dateGroups = [];
      
      var count = 0,
          lastDate = null;
      datetimes.forEach(function(el){
        var date;
        date = new Date( el.title );
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        
        if (lastDate === null) {
          lastDate = date;
        }
        
        if (date.getTime() === lastDate.getTime()) {
          count++;
        }
        else {
          // push last values;
          dateGroups.pushObject({
            "value": lastDate,
            "colspan": count
          });
          
          // set lastDate to current date and reset count
          lastDate = date;
          count = 1;
        }
      });
      dateGroups.pushObject({
        "value": lastDate,
        "colspan": count
      });
      
      return dateGroups;
    }.property('dates.@each'),
    
    /*
     * handles options if they are dates
     */
    dates: function() {
      // if poll type is find a date
      // we return an empty array
      if( !this.get('isFindADate') ) {
        return [];
      }
      
      // if current timezone doesn't differ to timezone poll got created with or
      // if local timezone should be used
      // we return original options array
      if (
           !this.get('timezoneDiffers') ||
           this.get('useLocalTimezone')
         ) {
        return Ember.copy( this.get('options') );
      }
      else {
        var timezoneDifference = new Date().getTimezoneOffset() - this.get('timezoneOffset'),
            dates = [];
        this.get('options').forEach(function(option){
          dates.pushObject({
            title: new Date( option.title ).setMinutes(
                     timezoneDifference
                   )
          });
        });
        return dates;
      }
    }.property('options.@each', 'useLocalTimezone'),
    
    /*
     * evaluates poll data
     * if free text answers are allowed evaluation is disabled
     */
    evaluation: function() {
        // disable evaluation if answer type is free text
        if (this.get('answerType') === 'FreeText') {
            return [];
        }

        var evaluation = [],
            options = [],
            lookup = [];
    
        // init options array
        this.get('options').forEach(function(option, index){
            options[index] = 0;
        });
    
        // init array of evalutation objects
        // create object for every possible answer
        this.get('answers').forEach(function(answer){
            evaluation.push({
                id: answer.label,
                label: answer.label,
                options: Ember.$.extend([], options)
            });
        });
        // create object for no answer if answers are not forced
        if (!this.get('forceAnswer')){
            evaluation.push({
                id: null,
                label: 'no answer',
                options: Ember.$.extend([], options)
            });
        }
        
        // create lookup array
        evaluation.forEach(function(value, index){
            lookup[value.id] = index;
        });
    
        // loop over all users
        this.get('users').forEach(function(user){
            // loop over all selections of the user
            user.get('selections').forEach(function(selection, optionindex){
                var answerindex;
                
                // get answer index by lookup array
                if (typeof lookup[selection.value.label] === 'undefined') {
                    answerindex = lookup[null];
                }
                else {
                    answerindex = lookup[selection.value.label];
                }
                
                // increment counter
                try {
                    evaluation[answerindex]['options'][optionindex] = evaluation[answerindex]['options'][optionindex] + 1;
                } catch (e) {
                    // ToDo: Throw an error
                }
            });
        });
        
        return evaluation;
    }.property('users.@each'),
    
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
     * calculate colspan for a row which should use all columns in table
     * used by evaluation row
     */
    fullRowColspan: function(){
        var colspan = this.get('options.length') + 2;
        return colspan;
    }.property('options.@each'),
    
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
            options = this.get('options');
    
        options.forEach(function(){
            var newSelection = Ember.Object.create({value: ''});
            newUserSelections.pushObject(newSelection);
        });
        
        return newUserSelections;
    }.property('options'),
    
    optionCount: function() {
      return this.get('options.length');
    }.property('options'),
    
    pollUrl: function() {
        return window.location.href;
    }.property('currentPath', 'encryptionKey'),
    
    /*
     * return true if current timezone differs from timezone poll got created with
     */
    timezoneDiffers: function() {
        return new Date().getTimezoneOffset() !== this.get('timezoneOffset');
    }.property('timezoneOffset'),
    
    updateEncryptionKey: function() {
        // update encryption key
        this.set('encryption.key', this.get('encryptionKey'));
        
        // reload content to recalculate computed properties
        // if encryption key was set before
        if (this.get('encryption.isSet') === true) {
            this.get('content').reload();
        }
        
        this.set('encryption.isSet', true);
    }.observes('encryptionKey'),
    
    useLocalTimezone: function() {
      return false;
    }.property(),
    
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
                    return object.get('forceAnswer');
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
                    return object.get('anonymousUser');
                }
            }
        }
    }
});
