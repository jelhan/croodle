import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { calendarSelect } from 'ember-power-calendar/test-support';

module('Integration | Component | create options dates', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('options', []);
    await render(hbs`{{#bs-form as |form|}}{{create-options-dates options=options form=form}}{{/bs-form}}`);

    assert.dom('[data-test-form-element-for="days"]').exists();
  });

  test('calendar shows existing options as selected days', async function(assert) {
    let store = this.owner.lookup('service:store');
    this.set('options', [
      store.createFragment('option', { title: '2015-01-01' }),
      store.createFragment('option', { title: '2015-01-02' }),
    ]);
    await render(hbs`{{#bs-form as |form|}}{{create-options-dates options=options form=form}}{{/bs-form}}`);

    assert.dom('[data-test-form-element-for="days"] [data-date="2015-01-01"]')
      .hasClass('ember-power-calendar-day--selected');
    assert.dom('[data-test-form-element-for="days"] [data-date="2015-01-02"]')
      .hasClass('ember-power-calendar-day--selected');
  });

  test('options are updated with dates selected in calendar', async function(assert) {
    this.set('options', []);
    await render(hbs`{{#bs-form as |form|}}{{create-options-dates options=options form=form}}{{/bs-form}}`);

    await calendarSelect('[data-test-form-element-for="days"]', new Date(2015, 0, 1));
    await calendarSelect('[data-test-form-element-for="days"]', new Date(2015, 0, 2));
    assert.deepEqual(
      this.get('options').map((option) => option.title),
      ['2015-01-01', '2015-01-02'],
      'dates are correct'
    );

    await calendarSelect('[data-test-form-element-for="days"]', new Date(2016, 11, 31));
    await calendarSelect('[data-test-form-element-for="days"]', new Date(2016, 0, 1));
    assert.deepEqual(
      this.get('options').map((option) => option.title),
      ['2015-01-01', '2015-01-02', '2016-01-01', '2016-12-31'],
      'dates are sorted'
    );
  });
});
