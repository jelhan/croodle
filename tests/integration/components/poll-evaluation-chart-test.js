import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';

module('Integration | Component | poll evaluation chart', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    moment.locale('en');
  });

  test('it renders', async function(assert) {
    this.set('options', [
      EmberObject.create({
        formatted: 'Thursday, January 1, 2015',
        title: moment('2015-01-01'),
        hasTime: false
      }),
      EmberObject.create({
        formatted: 'Monday, February 2, 2015',
        title: moment('2015-02-02'),
        hasTime: false
      }),
      EmberObject.create({
        formatted: 'Tuesday, March 3, 2015 1:00 AM',
        title: moment('2015-03-03T01:00'),
        hasTime: true
      }),
      EmberObject.create({
        formatted: 'Tuesday, March 3, 2015 11:00 AM',
        title: moment('2015-03-03T11:00'),
        hasTime: true
      })
    ]);
    this.set('answerType', 'YesNoMaybe');
    this.set('users', [
      EmberObject.create({
        id: 1,
        selections: [
          EmberObject.create({
            type: 'yes'
          }),
          EmberObject.create({
            type: 'yes'
          }),
          EmberObject.create({
            type: 'maybe'
          }),
          EmberObject.create({
            type: 'no'
          })
        ]
      }),
      EmberObject.create({
        id: 2,
        selections: [
          EmberObject.create({
            type: 'yes'
          }),
          EmberObject.create({
            type: 'maybe'
          }),
          EmberObject.create({
            type: 'no'
          }),
          EmberObject.create({
            type: 'no'
          })
        ]
      })
    ]);
    await render(hbs`{{poll-evaluation-chart options=options answerType=answerType users=users}}`);
    assert.ok(this.$('canvas'), 'it renders a canvas element');
  });
});
