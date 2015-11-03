import Ember from "ember";

export default Ember.Controller.extend({
  dateGroups: Ember.computed.reads('pollController.dateGroups'),
  dates: Ember.computed.reads('pollController.dates'),
  pollController: Ember.inject.controller('poll'),
  sortedUsers: Ember.computed.sort('pollController.model.users', 'usersSorting'),
  usersSorting: ['creationDate'],

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
