// app initialization
Ember.MODEL_FACTORY_INJECTIONS = true;

window.App = Ember.Application.create({
    LOG_TRANSITIONS: true,
    
    ready: function(){
        this.register('encryption:current', App.Encryption, {singleton: true});
        this.inject('controller:poll', 'encryption', 'encryption:current');
        this.inject('route:create', 'encryption', 'encryption:current');
        this.inject('model', 'encryption', 'encryption:current');
    }
});

// adapter initialization
App.ApplicationAdapter = DS.EmbeddedAdapter.extend({
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
Ember.computed.encrypted = function(encryptedField) {
    return Ember.computed(encryptedField, function(key, decryptedValue) {
        var encryptKey = this.get('encryption.key'),
            encryptedValue;

        // check if encryptKey is set
        if (typeof encryptKey === 'undefined') {
            return;
        }

        // setter
        if (arguments.length === 2) {
            encryptedValue = Ember.isNone(decryptedValue) ? null : String(sjcl.encrypt(encryptKey , decryptedValue));
            this.set(encryptedField, encryptedValue);
        }
        
        // get value of field to decrypt
        encryptedValue = this.get(encryptedField);
        
        // check if encryptedField is defined and not null
        if (typeof encryptedValue === 'undefined' ||
                encryptedValue === null) {
            return null;
        }

        // try to decrypt value
        try {
            decryptedValue = sjcl.decrypt(encryptKey, encryptedValue);
        } catch (e) {
            console.log('Error on decrypting ' + encryptedField);
            console.log(e);
            console.log('Perhaps a wrong encryption key?');
            decryptedValue = '';
        }
        return Ember.isNone(encryptedValue) ? null : String(decryptedValue);
    });
};

/*
 * array as attribute for models
 */
App.ArrayTransform = DS.Transform.extend({
    // If the outgoing json is already a valid javascript array
    // then pass it through untouched. In all other cases, replace it
    // with an empty array.  This means null or undefined values
    // automatically become empty arrays when serializing this type.
    serialize: function (jsonData) {
        if (Em.typeOf(jsonData) === 'array') {
            return jsonData;
        }
        else {
            return [];
        }
    },

    // If the incoming data is a javascript array, pass it through.
    // If it is a string, then coerce it into an array by splitting
    // it on commas and trimming whitespace on each element.
    // Otherwise pass back an empty array.  This has the effect of
    // turning all other data types (including nulls and undefined
    // values) into empty arrays.
    deserialize: function (externalData) {
        switch (Em.typeOf(externalData)) {
            case 'array':
                return externalData;
            case 'string':
                return externalData.split(',').map( function(item) { return jQuery.trim(item) } );
            default:
                return [];
        }               
    }
}),

/*
 * models
 */

// poll model
App.Poll = DS.Model.extend({
    encryptedTitle : DS.attr('string'),
    title : Ember.computed.encrypted('encryptedTitle'),
    encryptedDescription : DS.attr('string'),
    description: Ember.computed.encrypted('encryptedDescription'),
    encryptedPollType : DS.attr('string'),
    pollType : Ember.computed.encrypted('encryptedPollType'),
    encryptedAnswerType: DS.attr('string'),
    answerType : Ember.computed.encrypted('encryptedAnswerType'),
    answers : DS.attr('array'),
    options : DS.attr('array', {defaultValue: [{title: ''}, {title: ''}]}),
    users : DS.hasMany('user', {async: true}),
    creationDate : DS.attr('date')
});

// user model
// used by poll model
App.User = DS.Model.extend({
    poll : DS.belongsTo('poll', {async: true}),
    encryptedName : DS.attr('string'),
    name : Ember.computed.encrypted('encryptedName'),
    selections : DS.hasMany('selection', {async: true}),
    creationDate : DS.attr('date')
});

// selection model
// used by user model
App.Selection = DS.Model.extend({
    encryptedValue : DS.attr('string'),
    value : Ember.computed.encrypted('encryptedValue')
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

App.UserSerializer = App.ApplicationSerializer.extend({
    attrs: {
        selections: {embedded: 'always'}
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
            creationDate : new Date()
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

    // redirect to create/options if less then two options are defined
    afterModel: function(create){
        if (create.get('options.length') < 2) {
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
App.CreateIndexController = Ember.ObjectController.extend({
   actions: {
       save: function(){
           // redirect to CreateMeta
           this.transitionToRoute('create.meta');
       }
   }
});

App.CreateMetaController = Ember.ObjectController.extend({
   actions: {
       save: function(){
           // redirect to CreateOptions
           this.transitionToRoute('create.options');
       }
   }
});

App.CreateOptionsController = Ember.ObjectController.extend({
    actions: {           
        saveOptions: function() {
            var options = this.get('model.options'),
                newOptions = [];
        
            // remove options without value
            options.forEach(function(option) {
                if (option.title !== '') {
                     newOptions.pushObject(option);
                }
            });
            
            // check if options have been removed
            // if so set reduced options as actual options
            if (options.length !== newOptions.length) {
                this.set('model.options', newOptions);
            }
            
            // tricker save action
            this.send('save');
        },

        save: function(){
            // redirect to CreateSettings
            this.transitionToRoute('create.settings');
        }
    }
});

App.CreateSettingsController = Ember.ObjectController.extend({
    actions: {
        save: function(){
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
    }.observes('answerType')
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
                poll: this.get('model')
            });

            // create new selection record in store and assign it to the new user
            var newSelections = [];
            user.selections.forEach(function(selection){
                // create new selection record in store
                var newSelection = self.store.createRecord('selection', {
                    value: selection.value
                });
               
                // store new selections in an array
                newSelections.push(newSelection);
            });
            
            newUser.get('selections').then(function(selections){
                // map over all new selections and assign them to user
                $.each(newSelections, function(){
                    selections.pushObject(this);
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
            });
        }
    },
    
    isFreeText: function() {
        var answerType = this.get('answerType');
        if (answerType === 'FreeText') {
            return true;
        }
        else {
            return false;
        }
    }.property('answerType'),
    
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

App.PollView = Ember.View.extend({
    newUserName: '',
    newUserSelections: [],
            
    actions: {
        addNewUser: function(){
            var newUser = {
                name: this.get('newUserName'),
                selections: this.get('newUserSelections')
            };
            
            this.get('controller').send('saveNewUser', newUser);
            
            // clear input fields
            this.set('newUserName', '');
            this.get('newUserSelections').forEach(function(selection){
                selection.set('value', '');
            });
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