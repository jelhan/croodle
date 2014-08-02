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
  
  answerTypes: function() {
    return [
      Ember.Object.create({
          id : "YesNo",
          label : "yes, no",
          answers : [
                  {
                    label: "yes",
                    glyphicon: "glyphicon glyphicon-thumbs-up"
                  },
                  {
                    label: "no",
                    glyphicon: "glyphicon glyphicon-thumbs-down"
                  }
              ]
      }),
      Ember.Object.create({
          id : "YesNoMaybe",
          label : "yes, no, maybe",
          answers : [
                  {
                    label: "yes",
                    glyphicon: "glyphicon glyphicon-thumbs-up"
                  },
                  {
                    label: "maybe",
                    glyphicon: "glyphicon glyphicon-hand-right"
                  },
                  {
                    label: "no",
                    glyphicon: "glyphicon glyphicon-thumbs-down"
                  }
              ]
      }),
      Ember.Object.create({
          id : "FreeText",
          label : "free text",
          answers : []
      })
    ];
  }.property(),
  
  /*
   * set answers depending on selected answer type
   */
  updateAnswers: function(){
    var selectedAnswer = this.get('model.answerType'),
        answers = [],
        answerTypes = this.get('answerTypes');

    if (selectedAnswer !== null) {
      for (var i=0; i < answerTypes.length; i++) {
        if (answerTypes[i].id === selectedAnswer) {
            answers = answerTypes[i].answers;
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