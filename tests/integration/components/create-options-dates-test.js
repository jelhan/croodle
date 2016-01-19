import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import moment from 'moment';

moduleForComponent('create-options-dates', 'Integration | Component | create options dates', {
  integration: true
});

test('it renders a ember-cli-bootstrap-datepicker component', function(assert) {
  this.set('options', []);
  this.render(hbs`{{create-options-dates options=options}}`);

  assert.equal(
    this.$('#datepicker .ember-view').length, 1
  );
});

test('bootstrap-datepicker shows dates in options', function(assert) {
  this.set('options', [
    Ember.Object.create({ title: '2015-01-01' }),
    Ember.Object.create({ title: '2015-01-02' })
  ]);
  this.render(hbs`{{create-options-dates options=options}}`);

  assert.equal(
    this.$('#datepicker .ember-view').datepicker('getDates')[0].toISOString(),
    moment('2015-01-01').toISOString(),
    'date is correct (a)'
  );
  assert.equal(
    this.$('#datepicker .ember-view').datepicker('getDates')[1].toISOString(),
    moment('2015-01-02').toISOString(),
    'date is correct (b)'
  );
});

test('dates set in bootstrap-datepicker are set to options', function(assert) {
  this.set('options', []);
  this.render(hbs`{{create-options-dates options=options}}`);

  this.$('#datepicker .ember-view').datepicker('setDates', [
    moment('2015-01-01').toDate(),
    moment('2015-01-02').toDate()
  ]);
  assert.equal(
    this.get('options.0.title'),
    '2015-01-01',
    'dates are correct (a)'
  );
  assert.equal(
    this.get('options.1.title'),
    '2015-01-02',
    'dates are correct (b)'
  );

  this.$('#datepicker .ember-view').datepicker('setDates', [
    moment('2016-12-31').toDate(),
    moment('2016-01-01').toDate()
  ]);
  assert.equal(
    this.get('options.firstObject.title'),
    '2016-01-01',
    'dates are sorted'
  );
});
