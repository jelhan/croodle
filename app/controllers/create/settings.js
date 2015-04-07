import Ember from "ember";
import EmberValidations from 'ember-validations';

export default Ember.ObjectController.extend(EmberValidations.Mixin, {
  actions: {
    save: function(){
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
    },
    
    submit: function(){
      var self = this;
      this.validate().then(function() {
        self.send('save');
      }).catch(function(){
        Ember.$.each(Ember.View.views, function(id, view) {
          if(view.isEasyForm) {
            view.focusOut();
          }
        });
      });
    }
  },
  
  answerTypes: function() {
    return [
      Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
          id : "YesNo",
          labelTranslation : "answerTypes.yesNo.label",
          answers : [
                  Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
                    id: "yes",
                    labelTranslation: "answerTypes.yes.label",
                    icon: "glyphicon glyphicon-thumbs-up"
                  }),
                  Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
                    id: "no",
                    labelTranslation: "answerTypes.no.label",
                    icon: "glyphicon glyphicon-thumbs-down"
                  })
              ]
      }),
      Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
          id : "YesNoMaybe",
          labelTranslation : "answerTypes.yesNoMaybe.label",
          answers : [
                  Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
                    id: "yes",
                    labelTranslation: "answerTypes.yes.label",
                    icon: "glyphicon glyphicon-thumbs-up"
                  }),
                  Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
                    id: "maybe",
                    labelTranslation: "answerTypes.maybe.label",
                    icon: "glyphicon glyphicon-hand-right"
                  }),
                  Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
                    id: "no",
                    labelTranslation: "answerTypes.no.label",
                    icon: "glyphicon glyphicon-thumbs-down"
                  })
              ]
      }),
      Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
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
