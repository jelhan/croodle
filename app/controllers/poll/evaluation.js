import Ember from "ember";

export default Ember.Controller.extend({
  usersSorting: ['creationDate'],
  sortedUsers: Ember.computed.sort('pollController.model.users', 'usersSorting'),
  pollController: Ember.inject.controller('poll'),
  dates: Ember.computed.reads('pollController.dates'),
  dateGroups: Ember.computed.reads('pollController.dateGroups'),

  /*
   * evaluates poll data
   * if free text answers are allowed evaluation is disabled
   */
  evaluation: function() {
    // disable evaluation if answer type is free text
    if (this.get('model.answerType') === 'FreeText') {
      return [];
    }

    var evaluation = [],
        options = [],
        lookup = [];

    // init options array
    this.get('model.options').forEach(function(option, index){
      options[index] = 0;
    });

    // init array of evalutation objects
    // create object for every possible answer
    this.get('model.answers').forEach(function(answer){
      evaluation.push({
        id: answer.label,
        label: answer.label,
        options: Ember.$.extend([], options)
      });
    });
    // create object for no answer if answers are not forced
    if (!this.get('model.forceAnswer')){
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
    this.get('model.users').forEach(function(user){
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
  }.property('model.users.@each'),

  evaluationBestOptions: function() {
    var options = [],
        bestOptions = [],
        self = this;
    // can not evaluate answer type free text
    if(this.get('model.isFreeText')) {
      return [];
    }

    this.get('model.users').forEach(function(user){
      user.get('selections').forEach(function(selection, i){
        if(options.length - 1 < i) {
          options.push({
            answers: [],
            key: i,
            score: 0
          });
        }

        if(typeof options[i].answers[selection.get('type')] === 'undefined') {
          options[i].answers[selection.get('type')] = 0;
        }
        options[i].answers[selection.get('type')]++;

        switch (selection.get('type')) {
          case 'yes':
            options[i].score += 2;
            break;

          case 'maybe':
            options[i].score += 1;
            break;

          case 'no':
            options[i].score -= 2;
            break;
        }
      });
    });

    options.sort(function(a, b) {
      return a.score < b.score;
    });

    bestOptions.push(
      options[0]
    );
    var i = 1;
    while(true) {
      if (
        typeof options[i] !== 'undefined' &&
        bestOptions[0].score === options[i].score
      ) {
        bestOptions.push(
          options[i]
        );
      }
      else {
        break;
      }

      i++;
    }

    bestOptions.forEach(function(bestOption, i){
      if (self.get('model.isFindADate')) {
        bestOptions[i].title = self.get('dates')[bestOption.key].title;
      }
      else {
        bestOptions[i].title = self.get('model.options')[bestOption.key].title;
      }
    });

    return bestOptions;
  }.property('model.users.@each'),

  evaluationBestOptionsMultiple: function(){
    if (this.get('evaluationBestOptions.length') > 1) {
      return true;
    }
    else {
      return false;
    }
  }.property('evaluationBestOptions'),

  evaluationLastParticipation: function(){
    return this.get('sortedUsers.lastObject.creationDate');
  }.property('sortedUsers.@each'),

  evaluationParticipants: function(){
    return this.get('model.users.length');
  }.property('model.users.@each'),

  /*
   * calculate colspan for a row which should use all columns in table
   * used by evaluation row
   */
  fullRowColspan: function(){
    return this.get('model.options.length') + 2;
  }.property('model.options.@each'),

  isEvaluable: function() {
    if(
      !this.get('model.isFreeText') &&
      this.get('model.users.length') > 0
    ) {
      return true;
    }
    else {
      return false;
    }
  }.property('model.users.@each', 'model.isFreeText'),

  optionCount: function() {
    return this.get('model.options.length');
  }.property('model.options')
});
