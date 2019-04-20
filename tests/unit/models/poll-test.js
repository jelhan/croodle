import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | poll', function(hooks) {
  setupTest(hooks);

  test('#hasTimes: true if all options have times', function(assert) {
    let store = this.owner.lookup('service:store');
    let poll = store.createRecord('poll', {
      pollType: 'FindADate',
      options: [
        { title: '2019-01-01T00:00:00.000Z' },
        { title: '2019-01-01T10:00:00.000Z' },
      ],
    });

    assert.ok(poll.hasTimes);
  });

  test('#hasTimes: true if at least one option has times', function(assert) {
    let store = this.owner.lookup('service:store');
    let poll = store.createRecord('poll', {
      options: [
        { title: '2019-01-01T00:00:00.000Z' },
        { title: '2019-01-02' },
      ],
      pollType: 'FindADate',
    });
    assert.ok(poll.hasTimes);
  });

  test('#hasTimes: false if no option has times', function(assert) {
    let store = this.owner.lookup('service:store');
    let poll = store.createRecord('poll', {
      options: [
        { title: '2019-01-01' },
        { title: '2019-01-02' },
      ],
      pollType: 'FindADate',
    });
    assert.notOk(poll.hasTimes);
  });

  test('#hasTimes: false if poll is not FindADate', function(assert) {
    let store = this.owner.lookup('service:store');
    let poll = store.createRecord('poll', {
      options: [
        { title: 'abc' },
        { title: 'def' },
      ],
      pollType: 'MakeAPoll',
    });
    assert.notOk(poll.hasTimes);
  });

  test('#isFindADate', function(assert) {
    let store = this.owner.lookup('service:store');
    let poll = store.createRecord('poll', {
      pollType: 'FindADate',
    });

    assert.ok(poll.isFindADate);
    assert.notOk(poll.isMakeAPoll);
  });

  test('#isFreeText', function(assert) {
    let store = this.owner.lookup('service:store');
    let poll = store.createRecord('poll', {
      answerType: 'FreeText',
    });

    assert.ok(poll.isFreeText);

    poll.set('answerType', 'YesNo');
    assert.notOk(poll.isFreeText);

    poll.set('answerType', 'YesNoMaybe');
    assert.notOk(poll.isFreeText);
  });

  test('#isMakeAPoll', function(assert) {
    let store = this.owner.lookup('service:store');
    let poll = store.createRecord('poll', {
      pollType: 'MakeAPoll',
    });

    assert.ok(poll.isMakeAPoll);
    assert.notOk(poll.isFindADate);
  });
});
