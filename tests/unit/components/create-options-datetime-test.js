import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { DateTime } from 'luxon';
import { settled } from '@ember/test-helpers';

module('Unit | Component | create options datetime', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.store = this.owner.lookup('service:store');
  });

  test('delete a date', function(assert) {
    let component = this.owner.factoryFor('component:create-options-datetime').create();
    let a, b, c, d, e;
    run(() => {
      a = this.store.createFragment('option', { title: DateTime.fromISO('2015-01-01T01:01:00.000').toISO() });
      b = this.store.createFragment('option', { title: DateTime.fromISO('2015-01-01T11:11:00.000').toISO() });
      c = this.store.createFragment('option', { title: DateTime.fromISO('2015-02-02T11:11:00.000').toISO() });
      d = this.store.createFragment('option', { title: '2015-02-02' });
      e = this.store.createFragment('option', { title: '2015-02-03' });
      component.set('dates', [a, b, c, d, e]);
    });
    component.send('deleteOption', b);
    assert.deepEqual(
      component.get('dates').map((date) => date.get('title')),
      [
        DateTime.fromISO('2015-01-01T01:01:00.000').toISO(),
        DateTime.fromISO('2015-02-02T11:11:00.000').toISO(),
        '2015-02-02',
        '2015-02-03'
      ],
      'date get deleted if there is another date with same day (both having a time)'
    );
    component.send('deleteOption', d);
    assert.deepEqual(
      component.get('dates').map((date) => date.get('title')),
      [
        DateTime.fromISO('2015-01-01T01:01:00.000').toISO(),
        DateTime.fromISO('2015-02-02T11:11:00.000').toISO(),
        '2015-02-03'
      ],
      'date get deleted if there is another date with same day (date does not have a time)'
    );
    run(() => {
      component.send('deleteOption', c);
    });
    assert.deepEqual(
      component.get('dates').map((date) => date.get('title')),
      [
        DateTime.fromISO('2015-01-01T01:01:00.000').toISO(),
        '2015-02-02',
        '2015-02-03'
      ],
      'time is removed from date if there isn\' t any other date with same day'
    );
    component.send('deleteOption', d);
    assert.deepEqual(
      component.get('dates').map((date) => date.get('title')),
      [
        DateTime.fromISO('2015-01-01T01:01:00.000').toISO(),
        '2015-02-02',
        '2015-02-03'
      ],
      'nothing changes if it\'s the only date for this day it it doesn\'t have a time'
    );
  });

  test('datetimes are grouped by date', function(assert) {
    let component = this.owner.factoryFor('component:create-options-datetime').create();
    let a, b, c;
    // have to set dates in local time and than convert to ISO 8601 strings
    // because otherwise test could fail caused by timezone
    run(() => {
      a = this.store.createFragment('option', { title: DateTime.fromISO('2015-01-01T01:01:00').toISO() });
      b = this.store.createFragment('option', { title: DateTime.fromISO('2015-01-01T11:11:00').toISO() });
      c = this.store.createFragment('option', { title: DateTime.fromISO('2015-02-02T01:01:00').toISO() });
      component.set('dates', [a, b, c]);
    });
    assert.equal(
      component.get('groupedDates.length'),
      2,
      'length is correct'
    );
    assert.deepEqual(
      component.get('groupedDates.firstObject.items').map((item) => {
        return item.get('title');
      }),
      [a.get('title'), b.get('title')],
      'first dates having same day are grouped together'
    );
    assert.equal(
      component.get('groupedDates.lastObject.items.firstObject.title'),
      [c.get('title')],
      'last date having another day is in a separate group'
    );
  });

  test('bindings are working on grouped datetimes', function(assert) {
    let component = this.owner.factoryFor('component:create-options-datetime').create();
    let baseDate = DateTime.fromISO('2015-01-01T11:11');

    component.set('dates', [
      this.store.createFragment('option', {
        title: baseDate.toISO()
      })
    ]);
    assert.equal(
      component.get('groupedDates.firstObject.items.firstObject.time'),
      baseDate.toISOTime('HH:mm').substr(0, 5),
      'time is correct before'
    );

    component.set(
      'groupedDates.firstObject.items.firstObject.time',
      '00:00'
    );
    assert.equal(
      component.get('dates.firstObject.title'),
      baseDate.set({ hours: 0, minutes: 0 }).toISO(),
      'option is updated after time changed on grouped datetimes'
    );

    component.get('dates').pushObject(
      this.store.createFragment('option', {
        title: baseDate.plus({ hours: 1, minutes: 1 }).toISO(),
      })
    );
    assert.equal(
      component.get('groupedDates.firstObject.items.length'),
      2,
      'grouped datetimes got updated after option was added (same day)'
    );
    assert.equal(
      component.get('groupedDates.firstObject.items.lastObject.time'),
      '12:12',
      'grouped datetimes got updated correctly after option was added (same day)'
    );

    component.get('dates').pushObject(
      this.store.createFragment('option', { title: DateTime.fromISO('2015-02-02T01:01').toISO() })
    );
    assert.equal(
      component.get('groupedDates.length'),
      2,
      'grouped datetimes got updated after option was added (other day)'
    );
    assert.equal(
      component.get('groupedDates.lastObject.items.firstObject.time'),
      '01:01',
      'grouped datetimes got updated correctly after option was added (same day)'
    );
  });

  test('adopt times of first day - simple', async function(assert) {
    let poll = this.store.createRecord('poll', {
      options: [
        { title: DateTime.fromISO('2015-01-01T11:11:00.000').toISO() },
        { title: DateTime.fromISO('2015-01-01T22:22:00.000').toISO() },
        { title: DateTime.fromISO('2015-01-02').toISO() },
        { title: DateTime.fromISO('2015-01-03').toISO() }
      ]
    });
    let component = this.owner.factoryFor('component:create-options-datetime').create({
      dates: poll.get('options')
    });
    component.send('adoptTimesOfFirstDay');
    await settled();

    assert.deepEqual(
      component.get('dates').map((option) => option.get('title')),
      [
        DateTime.fromISO('2015-01-01T11:11:00.000').toISO(),
        DateTime.fromISO('2015-01-01T22:22:00.000').toISO(),
        DateTime.fromISO('2015-01-02T11:11:00.000').toISO(),
        DateTime.fromISO('2015-01-02T22:22:00.000').toISO(),
        DateTime.fromISO('2015-01-03T11:11:00.000').toISO(),
        DateTime.fromISO('2015-01-03T22:22:00.000').toISO()
      ],
      'times adopted correctly'
    );
  });

  test('adopt times of first day - having times on the other days', async function(assert) {
    let poll = this.store.createRecord('poll', {
      options: [
        { title: DateTime.fromISO('2015-01-01T11:11:00.000').toISO() },
        { title: DateTime.fromISO('2015-01-01T22:22:00.000').toISO() },
        { title: DateTime.fromISO('2015-01-02T09:11:00.000').toISO() },
        { title: DateTime.fromISO('2015-01-03T01:11:00.000').toISO() },
        { title: DateTime.fromISO('2015-01-03T11:11:00.000').toISO() },
        { title: DateTime.fromISO('2015-01-04T02:11:00.000').toISO() },
        { title: DateTime.fromISO('2015-01-04T05:11:00.000').toISO() },
        { title: DateTime.fromISO('2015-01-04T12:11:00.000').toISO() }
      ]
    });
    let component = this.owner.factoryFor('component:create-options-datetime').create({
      dates: poll.get('options')
    });
    component.send('adoptTimesOfFirstDay');
    await settled();

    assert.deepEqual(
      component.get('dates').map((option) => option.get('title')),
      [
        DateTime.fromISO('2015-01-01T11:11:00.000').toISO(),
        DateTime.fromISO('2015-01-01T22:22:00.000').toISO(),
        DateTime.fromISO('2015-01-02T11:11:00.000').toISO(),
        DateTime.fromISO('2015-01-02T22:22:00.000').toISO(),
        DateTime.fromISO('2015-01-03T11:11:00.000').toISO(),
        DateTime.fromISO('2015-01-03T22:22:00.000').toISO(),
        DateTime.fromISO('2015-01-04T11:11:00.000').toISO(),
        DateTime.fromISO('2015-01-04T22:22:00.000').toISO()
      ],
      'times adopted correctly'
    );
  });

  test('adopt times of first day - no times on first day', async function(assert) {
    let poll = this.store.createRecord('poll', {
      options: [
        { title: '2015-01-01' },
        { title: '2015-01-02' },
        { title: DateTime.fromISO('2015-01-03T11:00').toISO() },
        { title: DateTime.fromISO('2015-01-03T15:00').toISO() }
      ]
    });
    let component = this.owner.factoryFor('component:create-options-datetime').create({
      dates: poll.get('options')
    });
    component.send('adoptTimesOfFirstDay');
    await settled();

    assert.deepEqual(
      component.get('dates').map((option) => option.get('title')),
      [
        '2015-01-01',
        '2015-01-02',
        '2015-01-03'
      ],
      'times are removed from all days'
    );
  });
});
