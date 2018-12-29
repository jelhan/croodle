import {
  click,
  find,
  findAll,
  currentURL,
  currentRouteName,
  visit
} from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { t } from 'ember-i18n/test-support';
import pollHasUser, { pollHasUsersCount } from 'croodle/tests/helpers/poll-has-user';
import pollParticipate from 'croodle/tests/helpers/poll-participate';
import jQuery from 'jquery';

module('Acceptance | participate in a poll', function(hooks) {
  hooks.beforeEach(function() {
    window.localStorage.setItem('locale', 'en');
  });

  setupApplicationTest(hooks);
  setupMirage(hooks);

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
    pollHasUsersCount(assert, 1, 'user is added to user selections table');
    pollHasUser(assert, 'Max Meiner', [t('answerTypes.yes.label'), t('answerTypes.no.label')]);

    await click('.nav .participation');
    assert.equal(currentRouteName(), 'poll.participation');
    assert.equal(find('.name input').value, '', 'input for name is cleared');
    assert.ok(
      !findAll('input[type="radio"]').toArray().some((el) => el.checked),
      'radios are cleared'
    );

    await pollParticipate('Peter Müller', ['yes', 'yes']);
    assert.equal(currentRouteName(), 'poll.evaluation');
    pollHasUsersCount(assert, 2, 'user is added to user selections table');
    pollHasUser(assert, 'Peter Müller', [t('answerTypes.yes.label'), t('answerTypes.yes.label')]);
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
    pollHasUsersCount(assert, 1, 'user is added to user selections table');
    pollHasUser(assert, 'Max Manus', ['answer 1', 'answer 2']);
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
    pollHasUsersCount(assert, 1, 'user is added to user selections table');
    pollHasUser(assert, 'Karl Käfer', [t('answerTypes.yes.label'), '']);
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
    pollHasUsersCount(assert, 1, 'user is added to user selections table');
    pollHasUser(assert, '', [t('answerTypes.yes.label'), t('answerTypes.no.label')]);
  });

  test('network connectivity errors', async function(assert) {
    let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let poll = this.server.create('poll', {
      encryptionKey
    });

    this.server.post('/users', undefined, 503);

    await visit(`/poll/${poll.id}/participation?encryptionKey=${encryptionKey}`);
    assert.equal(currentRouteName(), 'poll.participation');

    await pollParticipate('foo bar', ['yes', 'no']);
    assert.ok(
      jQuery(find('#modal-saving-failed-modal')).is(':visible'),
      'user gets notified that saving failed'
    );

    this.server.post('/users');

    await click('#modal-saving-failed-modal button');
    assert.notOk(
      jQuery(find('#modal-saving-failed-modal')).is(':visible'),
      'modal is hidden after saving was successful'
    );
    assert.equal(currentRouteName(), 'poll.evaluation');
    pollHasUsersCount(assert, 1, 'user is added to user selections table');
    pollHasUser(assert, 'foo bar', [t('answerTypes.yes.label'), t('answerTypes.no.label')]);
  });
});
