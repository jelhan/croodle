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
      Em.Object.extend(Em.I18n.TranslateableProperties, {}).create({
          id : "YesNo",
          labelTranslation : "answerTypes.yesNo.label",
          answers : [
                  Em.Object.extend(Em.I18n.TranslateableProperties, {}).create({
                    id: "yes",
                    labelTranslation: "answerTypes.yes.label",
                    icon: "glyphicon glyphicon-thumbs-up"
                  }),
                  Em.Object.extend(Em.I18n.TranslateableProperties, {}).create({
                    id: "no",
                    labelTranslation: "answerTypes.no.label",
                    icon: "glyphicon glyphicon-thumbs-down"
                  })
              ]
      }),
      Em.Object.extend(Em.I18n.TranslateableProperties, {}).create({
          id : "YesNoMaybe",
          labelTranslation : "answerTypes.yesNoMaybe.label",
          answers : [
                  Em.Object.extend(Em.I18n.TranslateableProperties, {}).create({
                    id: "yes",
                    labelTranslation: "answerTypes.yes.label",
                    icon: "glyphicon glyphicon-thumbs-up"
                  }),
                  Em.Object.extend(Em.I18n.TranslateableProperties, {}).create({
                    id: "maybe",
                    labelTranslation: "answerTypes.maybe.label",
                    icon: "glyphicon glyphicon-hand-right"
                  }),
                  Em.Object.extend(Em.I18n.TranslateableProperties, {}).create({
                    id: "no",
                    labelTranslation: "answerTypes.no.label",
                    icon: "glyphicon glyphicon-thumbs-down"
                  })
              ]
      }),
      Em.Object.extend(Em.I18n.TranslateableProperties, {}).create({
          id : "FreeText",
          labelTranslation : "answerTypes.freeText.label",
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