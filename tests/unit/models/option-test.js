import { run } from '@ember/runloop';
import Service from '@ember/service';
import { moduleForModel, test } from 'ember-qunit';
import moment from 'moment';

const i18nStub = Service.extend({
  exists() {
    return false;
  },
  locale: 'en'
});

moduleForModel('option', 'Unit | Model | option', {
  needs: [
    'validator:alias',
    'validator:iso8601',
    'validator:unique',
    'validator:presence',
    'validator:messages',
    'validator:time',
    'model:poll',
    'model:user'
  ],

  beforeEach() {
    this.register('service:i18n', i18nStub);
    this.inject.service('i18n', { as: 'i18n' });
    moment.locale('en');
  }
});

test('date property (get)', function(assert) {
  let option = this.subject({
    title: '2015-01-01'
  });
  assert.ok(
    moment.isMoment(option.get('date')),
    'returns a moment instance if title is an ISO 8601 day string'
  );
  assert.equal(
    option.get('date').format('YYYY-MM-DD HH:mm:ss.SSS'),
    '2015-01-01 00:00:00.000',
    'string to date conversion is correct for ISO 8601 day string'
  );

  run(() => {
    option.set('title', '2015-01-01T11:11:00.000Z');
  });
  assert.ok(
    moment.isMoment(option.get('date')),
    'returns a moment instance if title is an ISO 8601 datetime string'
  );
  assert.equal(
    option.get('date').toISOString(),
    '2015-01-01T11:11:00.000Z',
    'string to date conversion is correct for ISO 8601 datetime string'
  );

  run(() => {
    option.set('title', null);
  });
  assert.equal(
    option.get('date'),
    undefined,
    'returns undefined if title is empty'
  );

  run(() => {
    option.set('title', 'abc');
  });
  assert.equal(
    option.get('date'),
    undefined,
    'returns undefined if title is not a valid ISO 8601 date string'
  );

  run(() => {
    option.set('title', '2015');
  });
  assert.equal(
    option.get('date'),
    undefined,
    'returns undefined if title ISO 8601 string only contains a year'
  );

  run(() => {
    option.set('title', '2015-01');
  });
  assert.equal(
    option.get('date'),
    undefined,
    'returns undefined if title ISO 8601 string only contains a year and a month'
  );

  run(() => {
    option.set('title', '2013W06');
  });
  assert.equal(
    option.get('date'),
    undefined,
    'returns undefined if title ISO 8601 string only contains a year and a week'
  );
});

test('day property (get)', function(assert) {
  let option = this.subject({
    title: '2015-01-01'
  });
  assert.equal(
    option.get('day'),
    '2015-01-01',
    'returns ISO 8601 day string if title is ISO 8601 day string'
  );

  run(() => {
    option.set('title', '2015-01-01T11:11:00.000Z');
  });
  assert.equal(
    option.get('day'),
    moment('2015-01-01T11:11:00.000Z').format('YYYY-MM-DD'),
    'returns ISO 8601 day string if title is ISO 8601 datetime string'
  );

  run(() => {
    option.set('title', 'abc');
  });
  assert.equal(
    option.get('day'),
    undefined,
    'returns undefined if title is not a valid ISO 8601 string'
  );

  run(() => {
    option.set('title', null);
  });
  assert.equal(
    option.get('day'),
    undefined,
    'returns undefined if title is null'
  );
});

test('dayFormatted property (get)', function(assert) {
  let option = this.subject({
    title: '2015-01-01'
  });
  assert.equal(
    option.get('dayFormatted'),
    'Thursday, January 1, 2015',
    'returns formatted date if title is ISO 8601 day string'
  );

  run(() => {
    option.set('title', moment('2015-01-01').toISOString());
  });
  assert.equal(
    option.get('dayFormatted'),
    'Thursday, January 1, 2015',
    'returns formatted date if title is ISO 8601 datetime string'
  );

  run(() => {
    option.set('i18n.locale', 'de');
  });
  assert.equal(
    option.get('dayFormatted'),
    'Donnerstag, 1. Januar 2015',
    'observes locale changes'
  );

  run(() => {
    option.set('title', 'abc');
  });
  assert.equal(
    option.get('dayFormatted'),
    undefined,
    'returns undfined if title is not a valid ISO 8601 string'
  );
});

test('hasTime property', function(assert) {
  let option = this.subject({
    title: '2015-01-01T11:11:00.000Z'
  });
  assert.ok(option.get('hasTime'));
  run(() => {
    option.set('title', '2015-01-01');
  });
  assert.notOk(option.get('hasTime'));
  run(() => {
    option.set('title', 'foo');
  });
  assert.notOk(option.get('hasTime'));
});

test('time property (get)', function(assert) {
  let option = this.subject({
    title: '2015-01-01T11:11:00.000Z'
  });
  assert.equal(
    option.get('time'),
    moment('2015-01-01T11:11:00.000Z').format('HH:mm'),
    'returns time if title is ISO 8601 datetime string'
  );

  run(() => {
    option.set('title', '2015-01-01');
  });
  assert.equal(
    option.get('time'),
    undefined,
    'returns undefined if title is ISO 8601 day string'
  );

  run(() => {
    option.set('title', 'abc');
  });
  assert.equal(
    option.get('time'),
    undefined,
    'returns undefined if title is not an ISO 8601 date string'
  );
});

test('time property (set)', function(assert) {
  let option = this.subject({
    title: '2015-01-01'
  });

  run(() => {
    option.set('time', '11:00');
  });
  assert.equal(
    option.get('title'),
    moment('2015-01-01T11:00').toISOString(),
    'sets title according to time'
  );

  run(() => {
    option.set('time', null);
  });
  assert.equal(
    option.get('title'),
    '2015-01-01',
    'removes time from option if value is false'
  );

  const before = option.get('title');
  run(() => {
    option.set('time', 'abc');
  });
  assert.equal(
    option.get('title'),
    before,
    'does not set title if time is invalid'
  );

  run(() => {
    option.set('title', 'abc');
  });
  assert.throws(
    () => {
      option.set('time', '11:11');
    },
    'throws if attempt to set a time if title is not a date string'
  );
});

test('validation for MakeAPoll', function(assert) {
  run(() => {
    let store = this.store();
    let poll = store.createRecord('poll', {
      pollType: 'MakeAPoll'
    });
    let option = store.createFragment('option');
    poll.get('options').pushObject(option);
    option.validate();
    assert.notOk(
      option.get('validations.isValid'),
      'default value is not valid'
    );
    run(() => {
      option.set('title', 'Spasibo!');
    });
    assert.ok(
      option.get('validations.isValid'),
      'is valid for a non empty string'
    );
    run(() => {
      option.set('title', '!');
    });
    assert.ok(
      option.get('validations.isValid'),
      'is invalid if set to empty string again'
    );
  });
});

test('validation for FindADate', function(assert) {
  run(() => {
    let store = this.store();
    let poll = store.createRecord('poll', {
      isDateTime: false,
      pollType: 'FindADate'
    });
    let option = store.createFragment('option');
    poll.get('options').pushObject(option);
    option.validate();
    assert.notOk(
      option.get('validations.isValid'),
      'default value is not valid'
    );
    run(() => {
      option.set('title', '1945-05-08');
    });
    assert.ok(
      option.get('validations.isValid'),
      'iso 8601 date string is valid'
    );
    run(() => {
      option.set('title', 'Spasibo!');
    });
    assert.notOk(
      option.get('validations.isValid'),
      'random string is not valid'
    );
  });
});

test('validation for FindADate', function(assert) {
  run(() => {
    let store = this.store();
    let poll = store.createRecord('poll', {
      pollType: 'FindADate'
    });
    let option = store.createFragment('option');
    poll.get('options').pushObject(option);
    option.validate();
    assert.notOk(
      option.get('validations.isValid'),
      'default value is not valid'
    );
    run(() => {
      option.set('title', '1945-05-08T00:00:00.000Z');
    });
    assert.ok(
      option.get('validations.isValid'),
      'iso 8601 datetime string is valid'
    );
    run(() => {
      option.set('title', 'Spasibo!');
    });
    assert.notOk(
      option.get('validations.isValid'),
      'random string is not valid'
    );
    run(() => {
      option.set('title', '1945-05-08');
    });
    assert.ok(
      option.get('validations.isValid'),
      'iso 8601 date string is valid'
    );
  });
});
