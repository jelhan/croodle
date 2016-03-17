import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import moment from 'moment';

moduleForComponent('poll-evaluation-chart', 'Integration | Component | poll evaluation chart', {
  integration: true,
  beforeEach() {
    moment.locale('en');
  }
});

test('it renders', function(assert) {
  this.set('dates', [
    Ember.Object.create({
      formatted: 'Thursday, January 1, 2015',
      title: moment('2015-01-01'),
      hasTime: false
    }),
    Ember.Object.create({
      formatted: 'Monday, February 2, 2015',
      title: moment('2015-02-02'),
      hasTime: false
    }),
    Ember.Object.create({
      formatted: 'Tuesday, March 3, 2015 1:00 AM',
      title: moment('2015-03-03T01:00'),
      hasTime: true
    }),
    Ember.Object.create({
      formatted: 'Tuesday, March 3, 2015 11:00 AM',
      title: moment('2015-03-03T11:00'),
      hasTime: true
    })
  ]);
  this.set('answerType', 'YesNoMaybe');
  this.set('users', [
    Ember.Object.create({
      id: 1,
      selections: [
        Ember.Object.create({
          type: 'yes'
        }),
        Ember.Object.create({
          type: 'yes'
        }),
        Ember.Object.create({
          type: 'maybe'
        }),
        Ember.Object.create({
          type: 'no'
        })
      ]
    }),
    Ember.Object.create({
      id: 2,
      selections: [
        Ember.Object.create({
          type: 'yes'
        }),
        Ember.Object.create({
          type: 'maybe'
        }),
        Ember.Object.create({
          type: 'no'
        }),
        Ember.Object.create({
          type: 'no'
        })
      ]
    })
  ]);
  this.render(hbs`{{poll-evaluation-chart dates=dates answerType=answerType users=users}}`);
  assert.ok(this.$('canvas'), 'it renders a canvas element');
});
