// app initialization
Ember.MODEL_FACTORY_INJECTIONS = true;

window.App = Ember.Application.create({
    ready: function(){
        this.register('encryption:current', App.Encryption, {singleton: true});
        this.inject('controller:poll', 'encryption', 'encryption:current');
        this.inject('route:create', 'encryption', 'encryption:current');
        this.inject('model', 'encryption', 'encryption:current');
    }
});

// adapter initialization
App.ApplicationAdapter = DS.RESTAdapter.extend({
    // set namespace to api.php in same subdirectory
    namespace: window.location.pathname
            // remove index.html if it's there
            .replace(/index.html$/, '')
            // remove leading and trailing slash
            .replace(/\/$/, '')
            // add api.php
            .concat('/api.php?')
            // remove leading slash
            .replace(/^\//g, '')
});

// serializer initialization
App.ApplicationSerializer = DS.EmbeddedSerializer.extend();

// adding support for attribut data-option-id to input fields
Ember.TextField.reopen({
    attributeBindings: ['data-option']
});

// decrypt / encrypt computed property helper
Ember.computed.encrypted = function(encryptedField, dataType) {
    return Ember.computed(encryptedField, function(key, decryptedValue) {
        var encryptKey = this.get('encryption.key'),
            encryptedValue;

        // check if encryptKey is set
        if (typeof encryptKey === 'undefined') {
            return;
        }

        // setter
        if (arguments.length === 2) {
            var decryptedJSON = JSON.stringify(decryptedValue);
            
            encryptedValue = Ember.isNone(decryptedValue) ? null : String(sjcl.encrypt(encryptKey , decryptedJSON));
            this.set(encryptedField, encryptedValue);
        }
        
        // get value of field to decrypt
        encryptedJSON = this.get(encryptedField);
        
        // check if encryptedField is defined and not null
        if (typeof encryptedJSON === 'undefined' ||
                encryptedJSON === null) {
            return null;
        }

        // try to decrypt value
        try {
            decryptedJSON = sjcl.decrypt(encryptKey, encryptedJSON);
            decryptedValue = JSON.parse(decryptedJSON);
        } catch (e) {
            console.log('Error on decrypting ' + encryptedField);
            console.log(e);
            console.log('Perhaps a wrong encryption key?');
            decryptedValue = '';
        }
        
        switch (dataType) {
            case 'array':
                return Ember.isNone(decryptedValue) ? null : decryptedValue;
                break;
            
            case 'date':
                return Ember.isNone(decryptedValue) ? null : Date(decryptedValue);
                break;
                
            case 'string':
                return Ember.isNone(decryptedValue) ? null : String(decryptedValue);
                break;
                
            case 'boolean':
                return Ember.isNone(decryptedValue) ? null : Boolean(decryptedValue);
                break;
        }
    });
};

/*
 * models
 */

// poll model
App.Poll = DS.Model.extend({
    encryptedTitle : DS.attr('string'),
    title : Ember.computed.encrypted('encryptedTitle', 'string'),
    encryptedDescription : DS.attr('string'),
    description: Ember.computed.encrypted('encryptedDescription', 'string'),
    encryptedPollType : DS.attr('string'),
    pollType : Ember.computed.encrypted('encryptedPollType', 'string'),
    encryptedAnswerType: DS.attr('string'),
    answerType : Ember.computed.encrypted('encryptedAnswerType', 'string'),
    encryptedAnswers : DS.attr('string'),
    answers : Ember.computed.encrypted('encryptedAnswers', 'array'),
    encryptedOptions : DS.attr('string'),
    options : Ember.computed.encrypted('encryptedOptions', 'array'),
    users : DS.hasMany('user', {async: true}),
    encryptedCreationDate : DS.attr('string'),
    creationDate : Ember.computed.encrypted('encryptedCreationDate', 'date'),
    encryptedForceAnswer : DS.attr('string'),
    forceAnswer : Ember.computed.encrypted('encryptedForceAnswer', 'boolean'),
    encryptedAnonymousUser : DS.attr('string'),
    anonymousUser : Ember.computed.encrypted('encryptedAnonymousUser', 'boolean'),
    
    isFindADate: function() {
        return this.get('pollType') === 'FindADate';
    }.property('pollType'),
    isFreeText: function() {
        return this.get('answerType') === 'FreeText';
    }.property('answerType'),
    isMakeAPoll: function() {
        return this.get('pollType') === 'MakeAPoll';
    }.property('pollType')
});

// user model
// used by poll model
App.User = DS.Model.extend({
    poll : DS.belongsTo('poll', {async: true}),
    encryptedName : DS.attr('string'),
    name : Ember.computed.encrypted('encryptedName', 'string'),
    encryptedSelections : DS.attr('string'),
    selections : Ember.computed.encrypted('encryptedSelections', 'array'),
    encryptedCreationDate : DS.attr('string'),
    creationDate : Ember.computed.encrypted('encryptedCreationDate', 'date')
});

App.Encryption = Ember.Object.extend({
    key : '',
    isSet: false
});

App.PollTypes = [
   Ember.Object.create({
        id : "FindADate",
        label : "Find a date"
   }),
   Ember.Object.create({
        id : "MakeAPoll",
        label : "Make a poll"
   })
];

App.AnswerTypes = [
    Ember.Object.create({
        id : "YesNo",
        label : "yes, no",
        answers : [
                {label: "yes"},
                {label: "no"}
            ]
    }),
    Ember.Object.create({
        id : "YesNoMaybe",
        label : "yes, no, maybe",
        answers : [
                {label: "yes"},
                {label: "no"},
                {label: "maybe"}
            ]
    }),
    Ember.Object.create({
        id : "FreeText",
        label : "free text",
        answers : []
    })
];

/*
 * Serializer
 */
App.PollSerializer = App.ApplicationSerializer.extend({
    attrs: {
        users: {embedded: 'load'}
    }
});

/*
 * routes
 */

// defining routes of app
App.Router.map(function(){
     this.route('poll', { path: '/poll/:poll_id' });
     this.resource('create', function(){
         this.route('meta');
         this.route('options');
         this.route('settings');
     });
});

App.CreateRoute = Ember.Route.extend({
    beforeModel: function(){
        // generate encryptionKey
        var encryptionKeyLength = 40;
        var encryptionKeyChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

        var encryptionKey = '';
        var list = encryptionKeyChars.split('');
        var len = list.length, i = 0;
        do {
            i++;
            var index = Math.floor(Math.random() * len);
            encryptionKey += list[index];
        } while(i < encryptionKeyLength);

        // set encryption key
        this.set('encryption.key', encryptionKey);
    },
    
    model: function(){
        // create empty poll
        return this.store.createRecord('poll', {
            creationDate : new Date(),
            options : [{title: ''}, {title: ''}],
            forceAnswer: true,
            anonymousUser: false
        });
    }
});

App.CreateIndexRoute = Ember.Route.extend({
    model: function(){
        return this.modelFor('create');
    }
});

App.CreateMetaRoute = Ember.Route.extend({
    model: function(){
        return this.modelFor('create');
    },

    // redirect to create/index if poll type is not set
    afterModel: function(create){
        if (create.get('pollType') === null) {
            this.transitionTo('create.index');
        }
    }
});

App.CreateOptionsRoute = Ember.Route.extend({
    model: function(){
        return this.modelFor('create');
    },

    // redirect to create/meta if title is not set
    afterModel: function(create){
        if (create.get('title') === null) {
            this.transitionTo('create.meta');
        }
    }
});

App.CreateSettingsRoute = Ember.Route.extend({
    model: function(){
        return this.modelFor('create');
    },

    // redirect to create/options if not enough options are defined
    afterModel: function(create){
        var self = this;
        
        // check if only default options are defined
        if (create.get('options.length') === 2) {
            create.get('options').forEach(function(option) {
                if (option.title === '') {
                   self.transitionTo('create.options');
                }
            });
        }
        // check if less then two options are defined
        else if (create.get('options.length') < 2) {
            this.transitionTo('create.options');
        }
    }
});

App.PollRoute = Ember.Route.extend({
    model: function(params){
        return this.store.find('poll', params.poll_id).then(function(poll) {
            return poll;
        });
    }
});

/*
 * controller
 */
App.CreateIndexController = Ember.ObjectController.extend(Ember.Validations.Mixin);
App.CreateIndexController.reopen({
    actions: {
        submit: function(){
            // redirect to CreateMeta
            this.transitionToRoute('create.meta');
        }
    },
           
    validations: {
        pollType: {
            presence: true,
            inclusion: {
                in: ['FindADate', 'MakeAPoll']
            }
        }
    }
});

App.CreateMetaController = Ember.ObjectController.extend(Ember.Validations.Mixin);
App.CreateMetaController.reopen({
    actions: {
        submit: function(){
            // redirect to CreateOptions
            this.transitionToRoute('create.options');
        }
    },
           
    validations: {
        title: {
            presence: true,
            length: {
                minimum: 2
            }
        }
    }
});

App.CreateOptionsController = Ember.ObjectController.extend({
    actions: {           
        submitMakeAPoll: function() {
            var options = this.get('model.options'),
                newOptions = [];
            
            // remove options without value
            options.forEach(function(option) {
                if (option.title !== '') {
                     newOptions.pushObject(option);
                }
            });
            
            // set updated options
            // 
            // we have to hardly set new options even if they wasn't changed to
            // trigger computed property; push on array doesn't trigger computed
            // property to recalculate
            this.set('model.options', newOptions);
            
            // tricker save action
            this.send('save');
        },
                
        submitFindADate: function() {
            var options = $('.datepicker').datepicker('getDates'),
                newOptions = [];
            
            // sort dates
            options.sort(function(a,b){
                return new Date(a) - new Date(b);
            });
            
            // get array in correct form
            options.forEach(function(option) {
                newOptions.pushObject({title: option});
            });
            
            // set options
            this.set('model.options', newOptions);
            
            // tricker save action
            this.send('save');
        },

        save: function(){
            // redirect to CreateSettings
            this.transitionToRoute('create.settings');
        }
    }
});

App.CreateSettingsController = Ember.ObjectController.extend(Ember.Validations.Mixin);
App.CreateSettingsController.reopen({
    actions: {
        submit: function(){
            // check if answer type is selected
            if (this.get('answerType') === null) {
                return;
            }
            
            // save poll
            var self = this;
            this.get('model').save().then(function(model){
                // reload as workaround for bug: duplicated records after save
                model.reload().then(function(model){
                   // redirect to new poll
                   self.transitionToRoute('poll', model, {queryParams: {encryptionKey: self.get('encryption.key')}}); 
                });
            });
        }
    },
    
    updateAnswers: function(){
        var selectedAnswer = this.get('model.answerType'),
            answers = [];
        
        if (selectedAnswer !== null) {
            for (var i=0; i<App.AnswerTypes.length; i++) {
                if (App.AnswerTypes[i].id === selectedAnswer) {
                    answers = App.AnswerTypes[i].answers;
                }
            }

            this.set('answers', answers);
        }
    }.observes('answerType'),
            
    validations: {
        answerType: {
            presence: true,
            inclusion: {
                in: ["YesNo", "YesNoMaybe", "FreeText"]
            }
        },
        anonymousUser: {
            presence: true
        },
        forceAnswer: {
            presence: true
        }
    }
});

App.PollController = Ember.ObjectController.extend({
    queryParams: ['encryptionKey'],
    encryptionKey: '',

    actions: {
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
    
    colspan: function(){
        var colspan = this.get('options.length') + 2;
        return colspan;
    }.property('options.@each'),
    
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
                options: jQuery.extend([], options)
            });
        });
        // create object for no answer if answers are not forced
        if (!this.get('forceAnswer')){
            evaluation.push({
                id: null,
                label: 'no answer',
                options: jQuery.extend([], options)
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
                    console.log(e);
                }
            });
        });
        
        return evaluation;
    }.property('users.@each'),
    
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
    }.observes('encryptionKey')
});

/*
 * views
 */
App.CreateOptionsView = Ember.View.extend({
    title: '',
    
    actions: {
        moreOptions: function(){
            // create new Option
            this.get('controller.model.options').pushObject({title: ''});
       }
    }
});

App.PollView = Ember.View.extend(Ember.Validations.Mixin);
App.PollView.reopen({
    newUserName: '',
    newUserSelections: [],
            
    actions: {
        addNewUser: function(){
            var newUser = {
                name: this.get('newUserName'),
                selections: this.get('newUserSelections')
            };
            
            // check if anonymous user are allowed
            if(!this.get('controller.anonymousUser')) {
                // anonymous user are prohibited
                // check for a username
                if (this.get('newUserName') === '') {
                    alert('You have to enter a name.');
                    return;
                }
            }
            
            // check if answers are forced
            if(this.get('controller.forceAnswer')) {
                // check if a selection is null
                if (newUser.selections.isAny("value", null)) {
                    alert('You have to select answers for all options.');
                    return;
                }
            }
            
            // send new user to controller for saving
            this.get('controller').send('saveNewUser', newUser);

            // clear input fields
            this.set('newUserName', '');
            this.get('newUserSelections').forEach(function(selection){
                selection.set('value', '');
            });
            
            // reset validation erros
            this.set('errors.newUserName', '');
        }
    },
    
    isNotValid: function(){
        return !this.get('isValid');
    }.property('isValid'),
    
    validations: {
        newUserName: {
            presence: {
                unless: function(object, validator){
                    return object.get('controller.anonymousUser');
                }.observes('controller.anonymousUser')
            }
        }
    },
    
    // generate selection array for new user
    willInsertElement: function(){
        var newUserSelections = Ember.A(),
            self = this,
            options = this.get('controller.model.options');
    
        options.forEach(function(){
            newSelection = Ember.Object.create({value: ''});
            newUserSelections.pushObject(newSelection);
        });
        self.set('newUserSelections', newUserSelections);
    }
});

App.Datepicker = Em.View.extend({
    classNames: ['datepicker'],
    
    didInsertElement: function() {
        this._super();
        
        $('.datepicker').datepicker({
            format: "yyyy-mm-dd hh:mm:ss",
            multidate: true,
            multidateSeparator: ";",
            calendarWeeks: true,
            todayHighlight: true
        });
    }
});

/*
 * Handlebars helper
 */
Ember.Handlebars.registerBoundHelper('formattedDate', function(date, format) {
  return moment(date).format(format);
});