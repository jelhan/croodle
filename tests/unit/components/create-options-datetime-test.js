import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import moment from 'moment';

moduleForComponent('create-options-datetime', 'Unit | Component | create options datetime', {
  unit: true,
  needs: ['model:option']
});

test('it generates correct datetime objects', function(assert) {
  let component = this.subject();
  component.set('options', [
    Ember.Object.create({ title: '2015-01-01' }),
    Ember.Object.create({ title: '2016-02-02T11:22:00Z' })
  ]);
  assert.equal(
    component.get('datetimes.length'),
    2,
    'generates an datetime object for all valid dates in options'
  );
  assert.equal(
    component.get('datetimes.firstObject.time'),
    null,
    'time is null if option is a ISO 8601 date string (without time)'
  );
  assert.equal(
    component.get('datetimes.lastObject.time'),
    moment('2016-02-02T11:22:00Z').format('HH:mm'),
    'time is set to local time according time in ISO 8601 datetime string'
  );
  component.set('options', [
    Ember.Object.create({ title: 'non valid date string' }),
    Ember.Object.create({ title: '2016-02-02T11:22:00Z' })
  ]);
  assert.equal(
    component.get('datetimes.length'),
    1,
    'filters out non valid date strings'
  );
  assert.equal(
    component.get('datetimes.firstObject.time'),
    moment('2016-02-02T11:22:00Z').format('HH:mm'),
    'does not filter out valid date string if one is invalid'
  );
});

test('change of time updates options', function(assert) {
  let component = this.subject();
  component.set('options', [
    Ember.Object.create({ title: '2015-01-01' }),
    Ember.Object.create({ title: '2016-02-02T11:22:00Z' })
  ]);
  component.set('datetimes.firstObject.time', '01:01');
  assert.equal(
    component.get('options.firstObject.title'),
    moment('2015-01-01').hour(1).minute(1).toISOString(),
    'initial time is set correctly on options'
  );
  component.set('datetimes.lastObject.time', '00:30');
  assert.equal(
    component.get('options.lastObject.title'),
    moment('2016-02-02T11:22:00Z').hour(0).minute(30).toISOString(),
    'updated time is set correctly on options'
  );
});

test('datetime observes options changes', function(assert) {
  let component = this.subject();
  component.set('options', [
    Ember.Object.create({ title: '2015-01-01' })
  ]);
  assert.equal(
    component.get('datetimes.length'),
    1,
    'initial length is correct'
  );
  component.get('options').pushObject(
    Ember.Object.create({ title: '2015-02-02' })
  );
  assert.equal(
    component.get('datetimes.length'),
    2,
    'datetime object is created for new option'
  );
  component.set('options.lastObject.title', '2015-02-02T01:02:00Z');
  assert.equal(
    component.get('datetimes.lastObject.time'),
    moment('2015-02-02T01:02:00Z').format('HH:mm'),
    'datetime object is updated after option.title changes'
  );
});

test('datetimes are grouped by date', function(assert) {
  let component = this.subject();
  // have to set dates in local time and than convert to ISO 8601 strings
  // because otherwise test could fail caused by timezone
  let a = Ember.Object.create({ title: moment('2015-01-01T01:01:00').toISOString() });
  let b = Ember.Object.create({ title: moment('2015-01-01T11:11:00').toISOString() });
  let c = Ember.Object.create({ title: moment('2015-02-02T01:01:00').toISOString() });
  component.set('options', [a, b, c]);
  assert.equal(
    component.get('datetimes.length'),
    3,
    'datetime length is correct'
  );
  assert.equal(
    component.get('groupedDatetimes.length'),
    2,
    'length is correct'
  );
  assert.deepEqual(
    component.get('groupedDatetimes.firstObject.items').map((item) => {
      return item.get('date').toISOString();
    }),
    [a.get('title'), b.get('title')],
    'first dates having same day are grouped together'
  );
  assert.equal(
    component.get('groupedDatetimes.lastObject.items.firstObject.date').toISOString(),
    [c.get('title')],
    'last date having another day is in a separate group'
  );
});

test('bindings are working on grouped datetimes', function(assert) {
  let component = this.subject();
  component.set('options', [
    Ember.Object.create({ title: moment('2015-01-01T11:11').toISOString() })
  ]);
  assert.equal(
    component.get('groupedDatetimes.firstObject.items.firstObject.time'),
    '11:11',
    'time is correct before'
  );
  component.set(
    'groupedDatetimes.firstObject.items.firstObject.time',
    '00:00'
  );
  assert.equal(
    component.get('options.firstObject.title'),
    moment('2015-01-01T00:00').toISOString(),
    'option is updated after time changed on grouped datetimes'
  );
  component.get('options').pushObject(
    Ember.Object.create({ title: moment('2015-01-01T12:12').toISOString() })
  );
  assert.equal(
    component.get('groupedDatetimes.firstObject.items.length'),
    2,
    'grouped datetimes got updated after option was added (same day)'
  );
  assert.equal(
    component.get('groupedDatetimes.firstObject.items.lastObject.time'),
    '12:12',
    'grouped datetimes got updated correctly after option was added (same day)'
  );
  component.get('options').pushObject(
    Ember.Object.create({ title: moment('2015-02-02T01:01').toISOString() })
  );
  assert.equal(
    component.get('groupedDatetimes.length'),
    2,
    'grouped datetimes got updated after option was added (other day)'
  );
  assert.equal(
    component.get('groupedDatetimes.lastObject.items.firstObject.time'),
    '01:01',
    'grouped datetimes got updated correctly after option was added (same day)'
  );
});

test('adopt times of first day - simple', function(assert) {
  let component = this.subject({
    options: Ember.A([
      Ember.Object.create({
        title: moment('2015-01-01T11:11:00.000').toISOString()
      }),
      Ember.Object.create({
        title: moment('2015-01-01T22:22:00.000').toISOString()
      }),
      Ember.Object.create({
        title: moment('2015-01-02').toISOString()
      }),
      Ember.Object.create({
        title: moment('2015-01-03').toISOString()
      })
    ])
  });
  Ember.run(() => {
    component.send('adoptTimesOfFirstDay');
    assert.deepEqual(
      component.get('options').map((option) => option.get('title')),
      [
        moment('2015-01-01T11:11:00.000').toISOString(),
        moment('2015-01-01T22:22:00.000').toISOString(),
        moment('2015-01-02T11:11:00.000').toISOString(),
        moment('2015-01-02T22:22:00.000').toISOString(),
        moment('2015-01-03T11:11:00.000').toISOString(),
        moment('2015-01-03T22:22:00.000').toISOString()
      ],
      'times adopted correctly'
    );
  });
});

test('adopt times of first day - having times on the other days', function(assert) {
  let component = this.subject({
    options: Ember.A([
      Ember.Object.create({
        title: moment('2015-01-01T11:11:00.000').toISOString()
      }),
      Ember.Object.create({
        title: moment('2015-01-01T22:22:00.000').toISOString()
      }),
      Ember.Object.create({
        title: moment('2015-01-02T09:11:00.000').toISOString()
      }),
      Ember.Object.create({
        title: moment('2015-01-03T01:11:00.000').toISOString()
      }),
      Ember.Object.create({
        title: moment('2015-01-03T11:11:00.000').toISOString()
      }),
      Ember.Object.create({
        title: moment('2015-01-04T02:11:00.000').toISOString()
      }),
      Ember.Object.create({
        title: moment('2015-01-04T05:11:00.000').toISOString()
      }),
      Ember.Object.create({
        title: moment('2015-01-04T12:11:00.000').toISOString()
      })
    ])
  });
  Ember.run(() => {
    component.send('adoptTimesOfFirstDay');
    assert.deepEqual(
      component.get('options').map((option) => option.get('title')),
      [
        moment('2015-01-01T11:11:00.000').toISOString(),
        moment('2015-01-01T22:22:00.000').toISOString(),
        moment('2015-01-02T11:11:00.000').toISOString(),
        moment('2015-01-02T22:22:00.000').toISOString(),
        moment('2015-01-03T11:11:00.000').toISOString(),
        moment('2015-01-03T22:22:00.000').toISOString(),
        moment('2015-01-04T11:11:00.000').toISOString(),
        moment('2015-01-04T22:22:00.000').toISOString()
      ],
      'times adopted correctly'
    );
  });
});
