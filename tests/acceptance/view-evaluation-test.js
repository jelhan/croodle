import { findAll, currentRouteName, find, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { t } from 'ember-i18n/test-support';
import switchTab from 'croodle/tests/helpers/switch-tab';
import moment from 'moment';

module('Acceptance | view evaluation', function(hooks) {
  hooks.beforeEach(function() {
    window.localStorage.setItem('locale', 'en');
  });

  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('evaluation summary is not present for poll without participants', async function(assert) {
    let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let poll = this.server.create('poll', {
      encryptionKey
    });

    await visit(`/poll/${poll.id}?encryptionKey=${encryptionKey}`);
    assert.equal(currentRouteName(), 'poll.participation');

    await switchTab('evaluation');
    assert.equal(findAll('.tab-content .tab-pane .evaluation-summary').length, 0, 'evaluation summary is not present');
  });

  test('evaluation is correct for FindADate', async function(assert) {
    let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let user1 = this.server.create('user', {
      creationDate: '2015-01-01T00:00:00.000Z',
      encryptionKey,
      name: 'Maximilian',
      selections: [
        {
          type: 'yes',
          labelTranslation: 'answerTypes.yes.label',
          icon: 'glyphicon glyphicon-thumbs-up',
          label: 'Yes'
        },
        {
          type: 'yes',
          labelTranslation: 'answerTypes.yes.label',
          icon: 'glyphicon glyphicon-thumbs-up',
          label: 'Yes'
        }
      ]
    });
    let user2 = this.server.create('user', {
      creationDate: '2015-08-01T00:00:00.000Z',
      encryptionKey,
      name: 'Peter',
      selections: [
        {
          type: 'no',
          labelTranslation: 'answerTypes.no.label',
          icon: 'glyphicon glyphicon-thumbs-down',
          label: 'No'
        },
        {
          type: 'yes',
          labelTranslation: 'answerTypes.yes.label',
          icon: 'glyphicon glyphicon-thumbs-up',
          label: 'Yes'
        }
      ]
    });
    let poll = this.server.create('poll', {
      answers: [
        {
          type: 'yes',
          labelTranslation: 'answerTypes.yes.label',
          icon: 'glyphicon glyphicon-thumbs-up',
          label: 'Yes'
        },
        {
          type: 'no',
          labelTranslation: 'answerTypes.no.label',
          icon: 'glyphicon glyphicon-thumbs-down',
          label: 'No'
        }
      ],
      encryptionKey,
      options: [
        { title: '2015-12-12' },
        { title: '2016-01-01' }
      ],
      users: [user1, user2]
    });

    await visit(`/poll/${poll.id}/evaluation?encryptionKey=${encryptionKey}`);
    assert.equal(currentRouteName(), 'poll.evaluation');
    assert.equal(findAll('.tab-content .tab-pane .evaluation-summary').length, 1, 'evaluation summary is present');
    assert.equal(
      find('.participants').textContent.trim(),
      t('poll.evaluation.participants', { count: 2 }).toString(),
      'participants are counted correctly'
    );
    assert.equal(
      find('.best-options strong').textContent.trim(),
      'Friday, January 1, 2016',
      'options are evaluated correctly'
    );
    assert.equal(
      find('.last-participation').textContent.trim(),
      t('poll.evaluation.lastParticipation', {
        ago: moment('2015-08-01T00:00:00.000Z').from()
      }).toString(),
      'last participation is evaluated correctly'
    );
  });

  test('evaluation is correct for MakeAPoll', async function(assert) {
    let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let user1 = this.server.create('user', {
      creationDate: '2015-01-01T00:00:00.000Z',
      encryptionKey,
      name: 'Maximilian',
      selections: [
        {
          type: 'yes',
          labelTranslation: 'answerTypes.yes.label',
          icon: 'glyphicon glyphicon-thumbs-up',
          label: 'Yes'
        },
        {
          type: 'yes',
          labelTranslation: 'answerTypes.yes.label',
          icon: 'glyphicon glyphicon-thumbs-up',
          label: 'Yes'
        }
      ]
    });
    let user2 = this.server.create('user', {
      creationDate: '2015-08-01T00:00:00.000Z',
      encryptionKey,
      name: 'Peter',
      selections: [
        {
          type: 'no',
          labelTranslation: 'answerTypes.no.label',
          icon: 'glyphicon glyphicon-thumbs-down',
          label: 'No'
        },
        {
          type: 'yes',
          labelTranslation: 'answerTypes.yes.label',
          icon: 'glyphicon glyphicon-thumbs-up',
          label: 'Yes'
        }
      ]
    });
    let poll = this.server.create('poll', {
      answers: [
        {
          type: 'yes',
          labelTranslation: 'answerTypes.yes.label',
          icon: 'glyphicon glyphicon-thumbs-up',
          label: 'Yes'
        },
        {
          type: 'no',
          labelTranslation: 'answerTypes.no.label',
          icon: 'glyphicon glyphicon-thumbs-down',
          label: 'No'
        }
      ],
      encryptionKey,
      options: [
        { title: 'first option' },
        { title: 'second option' }
      ],
      pollType: 'MakeAPoll',
      users: [user1, user2]
    });

    await visit(`/poll/${poll.id}/evaluation?encryptionKey=${encryptionKey}`);
    assert.equal(currentRouteName(), 'poll.evaluation');
    assert.equal(findAll('.tab-content .tab-pane .evaluation-summary').length, 1, 'evaluation summary is present');
    assert.equal(
      find('.participants').textContent.trim(),
      t('poll.evaluation.participants', { count: 2 }).toString(),
      'participants are counted correctly'
    );
    assert.equal(
      find('.best-options strong').textContent.trim(),
      'second option',
      'options are evaluated correctly'
    );
    assert.ok(
      findAll('.user-selections-table').length,
      'has a table showing user selections'
    );
    assert.deepEqual(
      findAll('.user-selections-table thead th').toArray().map((el) => el.textContent.trim()),
      ['', 'first option', 'second option'],
      'dates are used as table headers'
    );
    assert.deepEqual(
      findAll('.user-selections-table tbody tr:nth-child(1) td').toArray().map((el) => el.textContent.trim()),
      ['Maximilian', 'Yes', 'Yes'],
      'answers shown in table are correct for first user'
    );
    assert.deepEqual(
      findAll('.user-selections-table tbody tr:nth-child(2) td').toArray().map((el) => el.textContent.trim()),
      ['Peter', 'No', 'Yes'],
      'answers shown in table are correct for second user'
    );
    assert.equal(
      find('.last-participation').textContent.trim(),
      t('poll.evaluation.lastParticipation', {
        ago: moment('2015-08-01T00:00:00.000Z').from()
      }).toString(),
      'last participation is evaluated correctly'
    );
  });

  test('could open evaluation by tab from poll participation', async function(assert) {
    let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let poll = this.server.create('poll', {
      answers: [
        {
          type: 'yes',
          labelTranslation: 'answerTypes.yes.label',
          icon: 'glyphicon glyphicon-thumbs-up',
          label: 'Yes'
        },
        {
          type: 'no',
          labelTranslation: 'answerTypes.no.label',
          icon: 'glyphicon glyphicon-thumbs-down',
          label: 'No'
        }
      ],
      encryptionKey,
      options: [
        { title: '2015-12-12' },
        { title: '2016-01-01' }
      ],
      users: [
        this.server.create('user', {
          creationDate: '2015-01-01T00:00:00.000Z',
          encryptionKey,
          name: 'Maximilian',
          selections: [
            {
              type: 'yes',
              labelTranslation: 'answerTypes.yes.label',
              icon: 'glyphicon glyphicon-thumbs-up',
              label: 'Yes'
            },
            {
              type: 'yes',
              labelTranslation: 'answerTypes.yes.label',
              icon: 'glyphicon glyphicon-thumbs-up',
              label: 'Yes'
            }
          ]
        }),
        this.server.create('user', {
          creationDate: '2015-08-01T00:00:00.000Z',
          encryptionKey,
          name: 'Peter',
          selections: [
            {
              type: 'yes',
              labelTranslation: 'answerTypes.yes.label',
              icon: 'glyphicon glyphicon-thumbs-up',
              label: 'Yes'
            },
            {
              id: 'no',
              labelTranslation: 'answerTypes.yes.label',
              icon: 'glyphicon glyphicon-thumbs-up',
              label: 'Yes'
            }
          ]
        })
      ]
    });

    await visit(`/poll/${poll.id}?encryptionKey=${encryptionKey}`);
    assert.equal(currentRouteName(), 'poll.participation');

    await switchTab('evaluation');
    assert.equal(currentRouteName(), 'poll.evaluation');
    assert.equal(
      find('.tab-pane h2').textContent.trim(),
      t('poll.evaluation.label').toString(),
      'headline is there'
    );
  });
});
