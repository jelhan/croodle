export default Ember.ObjectController.extend(Ember.Validations.Mixin, {
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
            newUser.save().then(function(){
                self.get('model.users').then(function(users){
                    // assign new user to poll
                    users.pushObject(newUser);
                });
                // reload as workaround for bug: duplicated records after save
                self.get('model').reload();
            });
        }
    },
    
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
                options: $.extend([], options)
            });
        });
        // create object for no answer if answers are not forced
        if (!this.get('forceAnswer')){
            evaluation.push({
                id: null,
                label: 'no answer',
                options: $.extend([], options)
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
                if (typeof lookup[selection.value] === 'undefined') {
                    answerindex = lookup[null];
                }
                else {
                    answerindex = lookup[selection.value];
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
            
            newUserSelections.forEach(function(item, index, enumerable){
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
    
    pollUrl: function() {
        return window.location.href;
    }.property('currentPath', 'encryptionKey'),
            
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
                if: function(object, validator){
                    return object.get('forceAnswer');
                }
            }
        },

        newUserName: {
            presence: {
                /*
                 * validate if a user name is given
                 * if it's forced by poll settings (anonymousUser === false)
                 */
                unless: function(object, validator){
                    /* have in mind that anonymousUser is undefined on init */
                    return object.get('anonymousUser');
                }
            }
        }
    },
            
    /*
     * have to manually rerun validation when encryption key is present in model
     * otherwise ember-validation is not using correct values for properties in
     * conditional validators
     */
    validationsFixBug: function() {
        if(!Ember.isEmpty(this.get('model.encryption.key'))) {
            this.validate();
        }
    }.observes('model.encryption.key'),
});