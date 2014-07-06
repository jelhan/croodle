export default Ember.ObjectController.extend(Ember.Validations.Mixin, {
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
    
    /*
     * set answers depending on selected answer type
     */
    updateAnswers: function(){
        var selectedAnswer = this.get('model.answerType'),
            answers = [];
        
        if (selectedAnswer !== null) {
            for (var i=0; i < App.AnswerTypes.length; i++) {
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