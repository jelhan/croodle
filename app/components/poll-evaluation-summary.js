import Ember from 'ember';

const { Component, computed, copy, isEmpty } = Ember;

export default Component.extend({
  classNames: ['evaluation-summary'],

  evaluationBestOptions: computed('poll.users.[]', function() {
    // can not evaluate answer type free text
    if (this.get('poll.isFreeText')) {
      return undefined;
    }

    // can not evaluate a poll without users
    if (isEmpty(this.get('poll.users'))) {
      return undefined;
    }

    let answers = this.get('poll.answers').reduce((answers, answer) => {
      answers[answer.get('type')] = 0;
      return answers;
    }, {});
    let evaluation = this.get('poll.options').map((option) => {
      return {
        answers: copy(answers),
        option,
        score: 0
      };
    });
    let bestOptions = [];

    this.get('poll.users').forEach(function(user) {
      user.get('selections').forEach(function(selection, i) {
        evaluation[i].answers[selection.get('type')]++;

        switch (selection.get('type')) {
          case 'yes':
            evaluation[i].score += 2;
            break;

          case 'maybe':
            evaluation[i].score += 1;
            break;

          case 'no':
            evaluation[i].score -= 2;
            break;
        }
      });
    });

    evaluation.sort(function(a, b) {
      return b.score - a.score;
    });

    let bestScore = evaluation[0].score;
    for (let i = 0; i < evaluation.length; i++) {
      if (
        bestScore === evaluation[i].score
      ) {
        bestOptions.push(
          evaluation[i]
        );
      } else {
        break;
      }
    }

    return bestOptions;
  }),

  evaluationBestOptionsMultiple: computed('evaluationBestOptions', function() {
    if (this.get('evaluationBestOptions.length') > 1) {
      return true;
    } else {
      return false;
    }
  }),

  evaluationLastParticipation: computed('sortedUsers.[]', function() {
    return this.get('sortedUsers.lastObject.creationDate');
  }),

  evaluationParticipants: computed('poll.users.[]', function() {
    return this.get('poll.users.length');
  })
});
