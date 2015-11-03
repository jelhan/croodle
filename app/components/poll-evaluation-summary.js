import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['evaluation-summary'],

  evaluationBestOptions: function() {
    var options = [],
        bestOptions = [],
        self = this;
    // can not evaluate answer type free text
    if(this.get('poll.isFreeText')) {
      return [];
    }

    // can not evaluate a poll without users
    if(Ember.isEmpty(this.get('poll.users'))) {
      return [];
    }

    this.get('poll.users').forEach(function(user){
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
      if (self.get('poll.isFindADate')) {
        bestOptions[i].title = self.get('dates')[bestOption.key].title;
      }
      else {
        bestOptions[i].title = self.get('poll.options')[bestOption.key].title;
      }
    });

    return bestOptions;
  }.property('poll.users.@each'),

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
    return this.get('poll.users.length');
  }.property('poll.users.@each')
});
