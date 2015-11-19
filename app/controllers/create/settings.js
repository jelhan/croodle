import Ember from "ember";
import {
  validator, buildValidations
}
from 'ember-cp-validations';
/* global moment */

var Validations = buildValidations({
  anonymousUser: validator('presence', true),
  answerType: [
    validator('presence', true),
    validator('inclusion', {
      in: ['YesNo', 'YesNoMaybe', 'FreeText']
    })
  ],
  forceAnswer: validator('presence', true)
});

export default Ember.Controller.extend(Validations, {
  actions: {
    submit: function(){
      // save poll
      this.get('model').save().then((model) => {
        // reload as workaround for bug: duplicated records after save
        model.reload().then((model) => {
           // redirect to new poll
           this.get('target').send('transitionToPoll', model);
        });
      });
    }
  },

  anonymousUser: Ember.computed.alias('model.anonymousUser'),
  answerType: Ember.computed.alias('model.answerType'),

  answerTypes: function() {
    return [
      Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
          id : "YesNo",
          labelTranslation : "answerTypes.yesNo.label",
          answers : [
                  this.store.createFragment('answer', {
                    type: "yes",
                    labelTranslation: "answerTypes.yes.label",
                    icon: "glyphicon glyphicon-thumbs-up"
                  }),
                  this.store.createFragment('answer', {
                    type: "no",
                    labelTranslation: "answerTypes.no.label",
                    icon: "glyphicon glyphicon-thumbs-down"
                  })
              ]
      }),
      Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
          id : "YesNoMaybe",
          labelTranslation : "answerTypes.yesNoMaybe.label",
          answers : [
                  this.store.createFragment('answer', {
                    type: "yes",
                    labelTranslation: "answerTypes.yes.label",
                    icon: "glyphicon glyphicon-thumbs-up"
                  }),
                  this.store.createFragment('answer', {
                    type: "maybe",
                    labelTranslation: "answerTypes.maybe.label",
                    icon: "glyphicon glyphicon-hand-right"
                  }),
                  this.store.createFragment('answer', {
                    type: "no",
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

  expirationDuration: 'P3M',

  expirationDurations: function() {
    return [
      Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
        id: 'P7D',
        labelTranslation: 'create.settings.expirationDurations.P7D'
      }),
      Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
        id: 'P1M',
        labelTranslation: 'create.settings.expirationDurations.P1M'
      }),
      Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
        id: 'P3M',
        labelTranslation: 'create.settings.expirationDurations.P3M'
      }),
      Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
        id: 'P6M',
        labelTranslation: 'create.settings.expirationDurations.P6M'
      }),
      Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
        id: 'P1Y',
        labelTranslation: 'create.settings.expirationDurations.P1Y'
      }),
      Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
        id: '',
        labelTranslation: 'create.settings.expirationDurations.never'
      })
    ];
  }.property(),

  forceAnswer: Ember.computed.alias('model.forceAnswer'),

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
            answers = answerTypes[i].answers.map(answer => Ember.copy(answer));
        }
      }

      this.set('model.answers', answers);
    }
  }.observes('model.answerType'),

  updateExpirationDate: function() {
    var expirationDuration = this.get('expirationDuration');

    if(Ember.isEmpty(expirationDuration)) {
      this.set('model.expirationDate', '');
    }
    else {
      this.set('model.expirationDate',
        moment().add(
          moment.duration(expirationDuration)
        ).toISOString()
      );
    }
  }.observes('expirationDuration')
});
