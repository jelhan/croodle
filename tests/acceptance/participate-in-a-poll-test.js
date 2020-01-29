import {
  click,
  find,
  findAll,
  currentURL,
  currentRouteName,
  waitFor,
  visit
} from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupIntl, t } from 'ember-intl/test-support';
import { setupMirage } from 'ember-cli-mirage/test-support';
import PollEvaluationPage from 'croodle/tests/pages/poll/evaluation';
import pollParticipate from 'croodle/tests/helpers/poll-participate';

module('Acceptance | participate in a poll', function(hooks) {
  let yesLabel;
  let noLabel;

  hooks.beforeEach(function() {
    window.localStorage.setItem('locale', 'en');
  });

  setupApplicationTest(hooks);
  setupIntl(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    yesLabel = t('answerTypes.yes.label').toString();
    noLabel = t('answerTypes.no.label').toString();
  });

  test('participate in a default poll', async function(assert) {
    let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let poll = this.server.create('poll', {
      encryptionKey
    });

    await visit(`/poll/${poll.id}?encryptionKey=${encryptionKey}`);
    assert.equal(currentRouteName(), 'poll.participation', 'poll is redirected to poll.participation');

    await pollParticipate('Max Meiner', ['yes', 'no']);
    assert.equal(currentRouteName(), 'poll.evaluation');
    assert.equal(
      currentURL().split('?')[1],
      `encryptionKey=${encryptionKey}`,
      'encryption key is part of query params'
    );
    assert.equal(PollEvaluationPage.participants.length, 1, 'user is added to participants table');
    let participant = PollEvaluationPage.participants.filterBy('name', 'Max Meiner')[0];
    assert.ok(participant, 'user exists in participants table');
    assert.deepEqual(
      participant.selections.map((_) => _.answer), [yesLabel, noLabel],
      'participants table shows correct answers for new participant'
    );

    await click('.nav .participation');
    assert.equal(currentRouteName(), 'poll.participation');
    assert.equal(find('.name input').value, '', 'input for name is cleared');
    assert.ok(
      !findAll('input[type="radio"]').toArray().some((el) => el.checked),
      'radios are cleared'
    );

    await pollParticipate('Peter Müller', ['yes', 'yes']);
    assert.equal(currentRouteName(), 'poll.evaluation');
    assert.equal(PollEvaluationPage.participants.length, 2, 'user is added to participants table');
    participant = PollEvaluationPage.participants.filterBy('name', 'Peter Müller')[0];
    assert.ok(participant, 'user exists in participants table');
    assert.deepEqual(
      participant.selections.map((_) => _.answer), [yesLabel, yesLabel],
      'participants table shows correct answers for new participant'
    );
  });

  test('participate in a poll using freetext', async function(assert) {
    let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let poll = this.server.create('poll', {
      answerType: 'FreeText',
      answers: [],
      encryptionKey
    });

    await visit(`/poll/${poll.id}?encryptionKey=${encryptionKey}`)
    assert.equal(currentRouteName(), 'poll.participation');

    await pollParticipate('Max Manus', ['answer 1', 'answer 2']);
    assert.equal(currentRouteName(), 'poll.evaluation');
    assert.equal(PollEvaluationPage.participants.length, 1, 'user is added to participants table');

    let participant = PollEvaluationPage.participants.filterBy('name', 'Max Manus')[0];
    assert.ok(participant, 'user exists in participants table');
    assert.deepEqual(
      participant.selections.map((_) => _.answer), ['answer 1', 'answer 2'],
      'participants table shows correct answers for new participant'
    );
  });

  test('participate in a poll which does not force an answer to all options', async function(assert) {
    let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let poll = this.server.create('poll', {
      encryptionKey,
      forceAnswer: false
    });

    await visit(`/poll/${poll.id}/participation?encryptionKey=${encryptionKey}`);
    assert.equal(currentRouteName(), 'poll.participation');

    await pollParticipate('Karl Käfer', ['yes', null]);
    assert.equal(currentRouteName(), 'poll.evaluation');
    assert.equal(PollEvaluationPage.participants.length, 1, 'user is added to participants table');

    let participant = PollEvaluationPage.participants.filterBy('name', 'Karl Käfer')[0];
    assert.ok(participant, 'user exists in participants table');
    assert.deepEqual(
      participant.selections.map((_) => _.answer), [yesLabel, ''],
      'participants table shows correct answers for new participant'
    );
  });

  test('participate in a poll which allows anonymous participation', async function(assert) {
    let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let poll = this.server.create('poll', {
      anonymousUser: true,
      encryptionKey
    });

    await visit(`/poll/${poll.id}/participation?encryptionKey=${encryptionKey}`);
    assert.equal(currentRouteName(), 'poll.participation');

    await pollParticipate(null, ['yes', 'no']);
    assert.equal(currentRouteName(), 'poll.evaluation');
    assert.equal(PollEvaluationPage.participants.length, 1, 'user is added to participants table');

    let participant = PollEvaluationPage.participants.filterBy('name', '')[0];
    assert.ok(participant, 'user exists in participants table');
    assert.deepEqual(
      participant.selections.map((_) => _.answer), [yesLabel, noLabel],
      'participants table shows correct answers for new participant'
    );
  });

  test('network connectivity errors', async function(assert) {
    let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let poll = this.server.create('poll', {
      encryptionKey
    });

    this.server.post('/users', undefined, 503);

    await visit(`/poll/${poll.id}/participation?encryptionKey=${encryptionKey}`);
    assert.equal(currentRouteName(), 'poll.participation');
    assert.dom('[data-test-modal="saving-failed"] .modal-content')
      .isNotVisible('failed saving notification is not shown before attempt to save');

    await pollParticipate('John Doe', ['yes', 'no']);
    assert.dom('[data-test-modal="saving-failed"] .modal-content')
      .isVisible('user gets notified that saving failed');

    this.server.post('/users');

    await click('[data-test-modal="saving-failed"] [data-test-button="retry"]');
    assert.dom('[data-test-modal="saving-failed"] .modal-content')
      .isNotVisible('Notification is hidden after another save attempt was successful');
    assert.equal(currentRouteName(), 'poll.evaluation');
    assert.equal(PollEvaluationPage.participants.length, 1, 'user is added to participants table');

    let participant = PollEvaluationPage.participants.filterBy('name', 'John Doe')[0];
    assert.ok(participant, 'user exists in participants table');
    assert.deepEqual(
      participant.selections.map((_) => _.answer), [yesLabel, noLabel],
      'participants table shows correct answers for new participant'
    );
  });

  test('shows loading spinner while submitting', async function(assert) {
    let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let poll = this.server.create('poll', {
      encryptionKey
    });

    let resolveSubmission;
    let resolveSubmissionWith;
    this.server.post('/users', function(schema) {
      return new Promise((resolve) => {
        let attrs = this.normalizedRequestAttrs();

        resolveSubmission = resolve;
        resolveSubmissionWith = schema.users.create(attrs);
      });
    });

    await visit(`/poll/${poll.id}/participation?encryptionKey=${encryptionKey}`);
    pollParticipate('John Doe', ['yes', 'no']);

    await waitFor('[data-test-button="submit"] .spinner-border', {
      timeoutMessage: 'timeout while waiting for loading spinner to appear',
    });
    assert.ok(true, 'loading spinner shown cause otherwise there would have been a timeout');

    // resolve promise for test to finish
    // need to resolve with a valid response cause otherwise Ember Data would throw
    resolveSubmission(resolveSubmissionWith);
  });

  module('validation', function() {
    test('shows validation errors for participation form on submit', async function(assert) {
      let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let poll = this.server.create('poll', {
        encryptionKey,
      });

      await visit(`/poll/${poll.id}/participation?encryptionKey=${encryptionKey}`);
      await click('button[type="submit"]');

      assert.dom('[data-test-form-element="name"] input').hasClass('is-invalid');
      assert.dom('[data-test-form-element="option-2017-12-24"] input[id$="yes"]').hasClass('is-invalid');
      assert.dom('[data-test-form-element="option-2017-12-24"] input[id$="no"]').hasClass('is-invalid');
      assert.dom('[data-test-form-element="option-2018-01-01"] input[id$="yes"]').hasClass('is-invalid');
      assert.dom('[data-test-form-element="option-2018-01-01"] input[id$="no"]').hasClass('is-invalid');

      assert.dom('[data-test-form-element="name"] input').isFocused();

      assert.equal(currentRouteName(), 'poll.participation', 'invalid form prevents a transition');
    });

    test('does not show validation error for name if poll allows anonymous participation', async function(assert) {
      let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let poll = this.server.create('poll', {
        anonymousUser: true,
        encryptionKey,
      });

      await visit(`/poll/${poll.id}/participation?encryptionKey=${encryptionKey}`);
      await click('button[type="submit"]');

      assert.dom('[data-test-form-element="name"] input').hasClass('is-valid');
      assert.dom('[data-test-form-element="option-2017-12-24"] input[id$="yes"]').hasClass('is-invalid');
      assert.dom('[data-test-form-element="option-2017-12-24"] input[id$="no"]').hasClass('is-invalid');
      assert.dom('[data-test-form-element="option-2018-01-01"] input[id$="yes"]').hasClass('is-invalid');
      assert.dom('[data-test-form-element="option-2018-01-01"] input[id$="no"]').hasClass('is-invalid');

      assert.dom('[data-test-form-element="option-2017-12-24"] input[id$="yes"]').isFocused();
      assert.equal(currentRouteName(), 'poll.participation', 'invalid form prevents a transition');
    });

    test('does not show validation error for option inputs if poll does not force an answer to each option', async function(assert) {
      let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let poll = this.server.create('poll', {
        encryptionKey,
        forceAnswer: false
      });

      await visit(`/poll/${poll.id}/participation?encryptionKey=${encryptionKey}`);
      await click('button[type="submit"]');

      assert.dom('[data-test-form-element="name"] input').hasClass('is-invalid');
      assert.dom('[data-test-form-element="option-2017-12-24"] input[id$="yes"]').hasClass('is-valid');
      assert.dom('[data-test-form-element="option-2017-12-24"] input[id$="no"]').hasClass('is-valid');
      assert.dom('[data-test-form-element="option-2018-01-01"] input[id$="yes"]').hasClass('is-valid');
      assert.dom('[data-test-form-element="option-2018-01-01"] input[id$="no"]').hasClass('is-valid');

      assert.dom('[data-test-form-element="name"] input').isFocused();

      assert.equal(currentRouteName(), 'poll.participation', 'invalid form prevents a transition');
    });

    test('does not show validation errors while saving participation', async function(assert) {
      let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let poll = this.server.create('poll', {
        encryptionKey
      });

      let resolveSubmission;
      let resolveSubmissionWith;
      this.server.post('/users', function(schema) {
        return new Promise((resolve) => {
          let attrs = this.normalizedRequestAttrs();

          resolveSubmission = resolve;
          resolveSubmissionWith = schema.users.create(attrs);
        });
      });

      await visit(`/poll/${poll.id}/participation?encryptionKey=${encryptionKey}`);
      pollParticipate('John Doe', ['yes', 'no']);

      await waitFor('[data-test-button="submit"] .spinner-border', {
        timeoutMessage: 'timeout while waiting for loading spinner to appear',
      });
      assert.dom('.is-invalid').doesNotExist('does not show any validation error');

      // resolve promise for test to finish
      // need to resolve with a valid response cause otherwise Ember Data would throw
      resolveSubmission(resolveSubmissionWith);
    });
  });
});
