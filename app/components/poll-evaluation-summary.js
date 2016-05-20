import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  classNames: ['evaluation-summary'],

  evaluationBestOptions: Ember.computed('poll.users.[]', function() {
    let options = [];
    let bestOptions = [];
    // can not evaluate answer type free text
    if (this.get('poll.isFreeText')) {
      return [];
    }

    // can not evaluate a poll without users
    if (Ember.isEmpty(this.get('poll.users'))) {
      return [];
    }

    this.get('poll.users').forEach(function(user) {
      user.get('selections').forEach(function(selection, i) {
        if (options.length - 1 < i) {
          options.push({
            answers: [],
            key: i,
            score: 0
          });
        }

        if (typeof options[i].answers[selection.get('type')] === 'undefined') {
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
      return b.score - a.score;
    });

    bestOptions.push(
      options[0]
    );
    let i = 1;
    while (true) {
      if (
        typeof options[i] !== 'undefined' &&
        bestOptions[0].score === options[i].score
      ) {
        bestOptions.push(
          options[i]
        );
      } else {
        break;
      }

      i++;
    }

    bestOptions.forEach((bestOption, i) => {
      if (this.get('poll.isFindADate')) {
        const date = this.get('dates').objectAt(bestOption.key);
        const format = date.hasTime ? 'LLLL' : moment.localeData()
          .longDateFormat('LLLL')
          .replace(
            moment.localeData().longDateFormat('LT'), '')
          .trim();
        bestOptions[i].title = date.title.format(format);
      } else {
        const option = this.get('poll.options').objectAt(bestOption.key);
        bestOptions[i].title = option.get('title');
      }
    });

    return bestOptions;
  }),

  evaluationBestOptionsMultiple: Ember.computed('evaluationBestOptions', function() {
    if (this.get('evaluationBestOptions.length') > 1) {
      return true;
    } else {
      return false;
    }
  }),

  evaluationLastParticipation: Ember.computed('sortedUsers.[]', function() {
    return this.get('sortedUsers.lastObject.creationDate');
  }),

  evaluationParticipants: Ember.computed('poll.users.[]', function() {
    return this.get('poll.users.length');
  })
});
