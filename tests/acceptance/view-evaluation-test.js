import { findAll, currentRouteName, find, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl, t } from 'ember-intl/test-support';import switchTab from 'croodle/tests/helpers/switch-tab';
import moment from 'moment';
import PollEvaluationPage from 'croodle/tests/pages/poll/evaluation';
import { assign } from '@ember/polyfills';

module('Acceptance | view evaluation', function(hooks) {
  hooks.beforeEach(function() {
    window.localStorage.setItem('locale', 'en');
  });

  setupApplicationTest(hooks);
  setupIntl(hooks);
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
    let usersData = [
      {
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
      },
      {
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
      },
    ];
    let pollData = {
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
    };
    let poll = this.server.create('poll', assign(pollData, { users: usersData.map((_) => this.server.create('user', _)) }));

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

    assert.deepEqual(
      PollEvaluationPage.options.map((_) => _.label),
      ['first option', 'second option'],
      'dates are used as table headers'
    );
    assert.deepEqual(
      PollEvaluationPage.participants.map((_) => _.name), usersData.map((_) => _.name),
      'users are listed in participants table with their names'
    );
    usersData.forEach((user) => {
      let participant = PollEvaluationPage.participants.filterBy('name', user.name)[0];
      assert.deepEqual(
        participant.selections.map((_) => _.answer),
        user.selections.map((_) => t(_.labelTranslation).toString()),
        `answers are shown for user ${user.name} in participants table`
      );
    });

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
