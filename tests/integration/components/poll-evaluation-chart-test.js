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
    this.set('poll', {
      answerType: 'YesNoMaybe',
      options: [
        { title: '2015-01-01' },
      ],
      users: [
        { selections: [{ type: 'yes' }]},
      ],
    });
    await render(hbs`{{poll-evaluation-chart poll=poll}}`);

    assert.dom('canvas').exists('it renders a canvas element');
  });
});
