import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { isArray } from '@ember/array';
import moment from 'moment';

module('Unit | Component | create options dates', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.store = this.owner.lookup('service:store');
  });

  test('#selectedDays: options representing days are mapped correctly', function(assert) {
    let values = [
      '1945-05-09',
      '1987-05-01',
      'non valid date string',
    ];

    let store = this.owner.lookup('service:store');
    let component = this.owner.factoryFor('component:create-options-dates').create({
      options: values.map((value) => store.createFragment('option', { title: value })),
    });

    assert.ok(
      isArray(component.selectedDays),
      'it\'s an array'
    );
    assert.equal(
      component.selectedDays.length, 2,
      'array length is correct'
    );
    assert.ok(
      component.selectedDays.every((el) => {
        return moment.isMoment(el);
      }),
      'array elements are moment objects'
    );
    assert.deepEqual(
      component.selectedDays.map((el) => el.format('YYYY-MM-DD')),
      values.slice(0, 2),
      'values are correct'
    );
  });

  test('#selectedDays: options representing days with times are mapped correctly', function(assert) {
    let values = [
      moment('2014-01-01T12:00').toISOString(),
      moment('2015-02-02T15:00').toISOString(),
      moment('2015-02-02T15:00').toISOString(),
      '2016-03-03',
    ];

    let store = this.owner.lookup('service:store');
    let component = this.owner.factoryFor('component:create-options-dates').create({
      options: values.map((value) => store.createFragment('option', { title: value })),
    });

    assert.ok(
      isArray(component.selectedDays),
      'it\'s an array'
    );
    assert.equal(
      component.selectedDays.length, 3,
      'array length is correct'
    );
    assert.ok(
      component.selectedDays.every(moment.isMoment),
      'array elements are moment objects'
    );
    assert.deepEqual(
      component.selectedDays.map((day) => day.format('YYYY-MM-DD')),
      ['2014-01-01', '2015-02-02', '2016-03-03'],
      'dates are correct'
    );
  });

  test('action #daysSelected: new days are added in correct order', function(assert) {
    // dates must be in wrong order to test sorting
    let values = ['1918-11-09', '1917-10-25'];
    let options = [];

    let component = this.owner.factoryFor('component:create-options-dates').create({ options });
    component.actions.daysSelected.bind(component)({
      moment: values.map((_) => moment(_)),
    });

    assert.ok(isArray(options), 'options is still an array');
    assert.equal(options.length, 2, 'two entries have been added');
    assert.ok(
      options.every(({ title }) => typeof title === 'string'),
      'title property of options are strings'
    );
    assert.ok(
      options.every(({ title }) => moment(title, 'YYYY-MM-DD', true).isValid()),
      'title property of options are ISO-8601 date string without time'
    );
    assert.deepEqual(
      options.map(({ title }) => title), values.sort(),
      'options having correct value and are sorted'
    );
  });

  test('action #daysSelected: existing times are preserved if new day is selected', function(assert) {
    let existing = [
      moment('2015-01-01T11:11').toISOString(),
      moment('2015-01-01T22:22').toISOString(),
      moment('2015-06-06T08:08').toISOString(),
      '2016-01-01'
    ];
    let additional = '2016-06-06';
    let merged = existing.slice();
    merged.push(additional);

    let store = this.owner.lookup('service:store');
    let component = this.owner.factoryFor('component:create-options-dates').create({
      options: existing.map((value) => store.createFragment('option', { title: value })),
    });

    component.actions.daysSelected.bind(component)({
      moment: merged.map((_) => moment(_)),
    });

    assert.deepEqual(
      component.options.map(({ title }) => title),
      merged,
      'preseve existing times if another day is added'
    );
  });

  test('action #daysSelected: existing times are preserved if day gets unselected', function(assert) {
    let existing = [
      moment('2015-01-01T11:11').toISOString(),
      moment('2015-01-01T22:22').toISOString(),
      moment('2015-06-06T08:08').toISOString(),
      '2016-01-01'
    ];
    let reduced = existing.slice();
    reduced.splice(2, 1);

    let store = this.owner.lookup('service:store');
    let component = this.owner.factoryFor('component:create-options-dates').create({
      options: existing.map((value) => store.createFragment('option', { title: value })),
    });

    component.actions.daysSelected.bind(component)({
      moment: reduced.map((_) => moment(_)),
    });

    assert.deepEqual(
      component.options.map(({ title }) => title),
      reduced,
      'preseve existing times if a day is deleted'
    );
  });
});
