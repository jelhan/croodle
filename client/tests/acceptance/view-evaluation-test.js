import { findAll, click, currentRouteName, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'croodle/tests/helpers';
import { t } from 'ember-intl/test-support';
import PollEvaluationPage from 'croodle/tests/pages/poll/evaluation';
import { DateTime } from 'luxon';

module('Acceptance | view evaluation', function (hooks) {
  hooks.beforeEach(function () {
    window.localStorage.setItem('locale', 'en');
  });

  setupApplicationTest(hooks);

  test('evaluation summary is not present for poll without participants', async function (assert) {
    let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let poll = this.server.create('poll', {
      encryptionKey,
    });

    await visit(`/poll/${poll.id}?encryptionKey=${encryptionKey}`);
    assert.strictEqual(currentRouteName(), 'poll.participation');

    await click('.nav [data-test-link="evaluation"]');
    assert
      .dom('.tab-content .tab-pane .evaluation-summary')
      .doesNotExist('evaluation summary is not present');
  });

  test('evaluation is correct for FindADate (date-only)', async function (assert) {
    let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let user1 = this.server.create('user', {
      id: '1-1',
      creationDate: DateTime.local().minus({ months: 8, weeks: 3 }).toISO(),
      encryptionKey,
      name: 'Maximilian',
      selections: [
        {
          type: 'yes',
          labelTranslation: 'answerTypes.yes.label',
          icon: 'glyphicon glyphicon-thumbs-up',
          label: 'Yes',
        },
        {
          type: 'yes',
          labelTranslation: 'answerTypes.yes.label',
          icon: 'glyphicon glyphicon-thumbs-up',
          label: 'Yes',
        },
      ],
    });
    let user2 = this.server.create('user', {
      id: '1-2',
      creationDate: DateTime.local().minus({ months: 3, weeks: 2 }).toISO(),
      encryptionKey,
      name: 'Peter',
      selections: [
        {
          type: 'no',
          labelTranslation: 'answerTypes.no.label',
          icon: 'glyphicon glyphicon-thumbs-down',
          label: 'No',
        },
        {
          type: 'yes',
          labelTranslation: 'answerTypes.yes.label',
          icon: 'glyphicon glyphicon-thumbs-up',
          label: 'Yes',
        },
      ],
    });
    let poll = this.server.create('poll', {
      id: '1',
      answers: [
        {
          type: 'yes',
          labelTranslation: 'answerTypes.yes.label',
          icon: 'glyphicon glyphicon-thumbs-up',
          label: 'Yes',
        },
        {
          type: 'no',
          labelTranslation: 'answerTypes.no.label',
          icon: 'glyphicon glyphicon-thumbs-down',
          label: 'No',
        },
      ],
      encryptionKey,
      options: [{ title: '2015-12-12' }, { title: '2016-01-01' }],
      users: [user1, user2],
    });

    await visit(`/poll/${poll.id}/evaluation?encryptionKey=${encryptionKey}`);
    assert.strictEqual(currentRouteName(), 'poll.evaluation');
    assert
      .dom('.tab-content .tab-pane .evaluation-summary')
      .exists({ count: 1 }, 'evaluation summary is present');
    assert
      .dom('.participants')
      .hasText(
        t('poll.evaluation.participants', { count: 2 }).toString(),
        'shows number of participants',
      );
    assert
      .dom('.best-options strong')
      .hasText(
        'Friday, January 1, 2016',
        'shows option most participants replied with yes to as best option',
      );
    assert.dom('.last-participation').hasText(
      t('poll.evaluation.lastParticipation', {
        ago: '3 months ago',
      }).toString(),
      'shows last participation date',
    );

    assert.deepEqual(
      findAll('table thead tr th').map((el) => el.textContent.trim()),
      ['', 'Saturday, December 12, 2015', 'Friday, January 1, 2016'],
      'lists dates as table header of parcipants table',
    );

    assert
      .dom('[data-test-participant="1-1"] [data-test-value-for="name"]')
      .hasText(
        'Maximilian',
        'shows expected name of first participant in participants table',
      );
    assert
      .dom('[data-test-participant="1-2"] [data-test-value-for="name"]')
      .hasText(
        'Peter',
        'shows expected name of second participant in participants table',
      );

    assert
      .dom('[data-test-participant="1-1"] [data-test-value-for="2015-12-12"]')
      .hasText(
        'Yes',
        'shows expected selection for first option of first participant',
      );
    assert
      .dom('[data-test-participant="1-1"] [data-test-value-for="2016-01-01"]')
      .hasText(
        'Yes',
        'shows expected selection for second option of first participant',
      );

    assert
      .dom('[data-test-participant="1-2"] [data-test-value-for="2015-12-12"]')
      .hasText(
        'No',
        'shows expected selection for first option of second participant',
      );
    assert
      .dom('[data-test-participant="1-2"] [data-test-value-for="2016-01-01"]')
      .hasText(
        'Yes',
        'shows expected selection for second option of second participant',
      );

    assert.deepEqual(
      findAll('[data-test-participant] [data-test-value-for="name"]').map(
        (el) => el.textContent.trim(),
      ),
      ['Maximilian', 'Peter'],
      'Participants are ordered as correctly in participants table',
    );
  });

  test('evaluation is correct for FindADate (datetime)', async function (assert) {
    let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let user1 = this.server.create('user', {
      id: '1-1',
      creationDate: DateTime.local().minus({ months: 8, weeks: 3 }).toISO(),
      encryptionKey,
      name: 'Maximilian',
      selections: [
        {
          type: 'yes',
          labelTranslation: 'answerTypes.yes.label',
          icon: 'glyphicon glyphicon-thumbs-up',
          label: 'Yes',
        },
        {
          type: 'yes',
          labelTranslation: 'answerTypes.yes.label',
          icon: 'glyphicon glyphicon-thumbs-up',
          label: 'Yes',
        },
        {
          type: 'no',
          labelTranslation: 'answerTypes.no.label',
          icon: 'glyphicon glyphicon-thumbs-down',
          label: 'No',
        },
      ],
    });
    let user2 = this.server.create('user', {
      id: '1-2',
      creationDate: DateTime.local().minus({ months: 3, weeks: 2 }).toISO(),
      encryptionKey,
      name: 'Peter',
      selections: [
        {
          type: 'no',
          labelTranslation: 'answerTypes.no.label',
          icon: 'glyphicon glyphicon-thumbs-down',
          label: 'No',
        },
        {
          type: 'yes',
          labelTranslation: 'answerTypes.yes.label',
          icon: 'glyphicon glyphicon-thumbs-up',
          label: 'Yes',
        },
        {
          type: 'yes',
          labelTranslation: 'answerTypes.yes.label',
          icon: 'glyphicon glyphicon-thumbs-up',
          label: 'Yes',
        },
      ],
    });
    let poll = this.server.create('poll', {
      id: '1',
      answers: [
        {
          type: 'yes',
          labelTranslation: 'answerTypes.yes.label',
          icon: 'glyphicon glyphicon-thumbs-up',
          label: 'Yes',
        },
        {
          type: 'no',
          labelTranslation: 'answerTypes.no.label',
          icon: 'glyphicon glyphicon-thumbs-down',
          label: 'No',
        },
      ],
      encryptionKey,
      options: [
        { title: DateTime.fromISO('2015-12-12T06:06').toISO() },
        { title: DateTime.fromISO('2015-12-12T12:12').toISO() },
        { title: DateTime.fromISO('2016-01-01T18:18').toISO() },
      ],
      users: [user1, user2],
    });

    await visit(`/poll/${poll.id}/evaluation?encryptionKey=${encryptionKey}`);
    assert.strictEqual(currentRouteName(), 'poll.evaluation');
    assert
      .dom('.tab-content .tab-pane .evaluation-summary')
      .exists({ count: 1 }, 'evaluation summary is present');
    assert
      .dom('.participants')
      .hasText(
        t('poll.evaluation.participants', { count: 2 }).toString(),
        'shows number of participants',
      );
    assert
      .dom('.best-options strong')
      .hasText(
        'Saturday, December 12, 2015 at 12:12 PM',
        'shows option most participants replied with yes to as best option',
      );
    assert.dom('.last-participation').hasText(
      t('poll.evaluation.lastParticipation', {
        ago: '3 months ago',
      }).toString(),
      'shows last participation date',
    );

    assert.deepEqual(
      findAll('table thead tr:first-child th').map((el) =>
        el.textContent.trim(),
      ),
      ['', 'Saturday, December 12, 2015', 'Friday, January 1, 2016'],
      'lists days as first row in table header of parcipants table',
    );
    assert.deepEqual(
      findAll('table thead tr:last-child th').map((el) =>
        el.textContent.trim(),
      ),
      ['', '6:06 AM', '12:12 PM', '6:18 PM'],
      'lists times as second row in table header of parcipants table',
    );

    assert
      .dom('[data-test-participant="1-1"] [data-test-value-for="name"]')
      .hasText(
        'Maximilian',
        'shows expected name of first participant in participants table',
      );
    assert
      .dom('[data-test-participant="1-2"] [data-test-value-for="name"]')
      .hasText(
        'Peter',
        'shows expected name of second participant in participants table',
      );

    assert
      .dom(
        `[data-test-participant="1-1"] [data-test-value-for="${DateTime.fromISO(
          '2015-12-12T06:06',
        ).toISO()}"]`,
      )
      .hasText(
        'Yes',
        'shows expected selection for first option of first participant',
      );
    assert
      .dom(
        `[data-test-participant="1-1"] [data-test-value-for="${DateTime.fromISO(
          '2015-12-12T12:12',
        ).toISO()}"]`,
      )
      .hasText(
        'Yes',
        'shows expected selection for second option of first participant',
      );
    assert
      .dom(
        `[data-test-participant="1-1"] [data-test-value-for="${DateTime.fromISO(
          '2016-01-01T18:18',
        ).toISO()}"]`,
      )
      .hasText(
        'No',
        'shows expected selection for third option of first participant',
      );

    assert
      .dom(
        `[data-test-participant="1-2"] [data-test-value-for="${DateTime.fromISO(
          '2015-12-12T06:06',
        ).toISO()}"]`,
      )
      .hasText(
        'No',
        'shows expected selection for first option of second participant',
      );
    assert
      .dom(
        `[data-test-participant="1-2"] [data-test-value-for="${DateTime.fromISO(
          '2015-12-12T12:12',
        ).toISO()}"]`,
      )
      .hasText(
        'Yes',
        'shows expected selection for second option of second participant',
      );
    assert
      .dom(
        `[data-test-participant="1-2"] [data-test-value-for="${DateTime.fromISO(
          '2016-01-01T18:18',
        ).toISO()}"]`,
      )
      .hasText(
        'Yes',
        'shows expected selection for third option of second participant',
      );

    assert.deepEqual(
      findAll('[data-test-participant] [data-test-value-for="name"]').map(
        (el) => el.textContent.trim(),
      ),
      ['Maximilian', 'Peter'],
      'Participants are ordered as correctly in participants table',
    );
  });

  test('evaluation is correct for MakeAPoll', async function (assert) {
    let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let usersData = [
      {
        creationDate: DateTime.local().minus({ weeks: 5 }).toISO(),
        encryptionKey,
        name: 'Maximilian',
        selections: [
          {
            type: 'yes',
            labelTranslation: 'answerTypes.yes.label',
            icon: 'glyphicon glyphicon-thumbs-up',
            label: 'Yes',
          },
          {
            type: 'yes',
            labelTranslation: 'answerTypes.yes.label',
            icon: 'glyphicon glyphicon-thumbs-up',
            label: 'Yes',
          },
        ],
      },
      {
        creationDate: DateTime.local().minus({ days: 3 }).toISO(),
        encryptionKey,
        name: 'Peter',
        selections: [
          {
            type: 'no',
            labelTranslation: 'answerTypes.no.label',
            icon: 'glyphicon glyphicon-thumbs-down',
            label: 'No',
          },
          {
            type: 'yes',
            labelTranslation: 'answerTypes.yes.label',
            icon: 'glyphicon glyphicon-thumbs-up',
            label: 'Yes',
          },
        ],
      },
    ];
    let pollData = {
      answers: [
        {
          type: 'yes',
          labelTranslation: 'answerTypes.yes.label',
          icon: 'glyphicon glyphicon-thumbs-up',
          label: 'Yes',
        },
        {
          type: 'no',
          labelTranslation: 'answerTypes.no.label',
          icon: 'glyphicon glyphicon-thumbs-down',
          label: 'No',
        },
      ],
      encryptionKey,
      options: [{ title: 'first option' }, { title: 'second option' }],
      pollType: 'MakeAPoll',
    };
    let poll = this.server.create('poll', {
      ...pollData,
      users: usersData.map((_) => this.server.create('user', _)),
    });

    await visit(`/poll/${poll.id}/evaluation?encryptionKey=${encryptionKey}`);
    assert.strictEqual(currentRouteName(), 'poll.evaluation');
    assert
      .dom('.tab-content .tab-pane .evaluation-summary')
      .exists({ count: 1 }, 'evaluation summary is present');
    assert
      .dom('.participants')
      .hasText(
        t('poll.evaluation.participants', { count: 2 }).toString(),
        'participants are counted correctly',
      );
    assert
      .dom('.best-options strong')
      .hasText('second option', 'options are evaluated correctly');

    assert.deepEqual(
      PollEvaluationPage.options.map((_) => _.label),
      ['first option', 'second option'],
      'dates are used as table headers',
    );
    assert.deepEqual(
      PollEvaluationPage.participants.map((_) => _.name),
      usersData.map((_) => _.name),
      'users are listed in participants table with their names',
    );
    usersData.forEach((user) => {
      let participant = PollEvaluationPage.participants.filterBy(
        'name',
        user.name,
      )[0];
      assert.deepEqual(
        participant.selections.map((_) => _.answer),
        user.selections.map((_) => t(_.labelTranslation).toString()),
        `answers are shown for user ${user.name} in participants table`,
      );
    });

    assert.dom('.last-participation').hasText(
      t('poll.evaluation.lastParticipation', {
        ago: '3 days ago',
      }).toString(),
      'last participation is evaluated correctly',
    );
  });

  test('could open evaluation by tab from poll participation', async function (assert) {
    let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let poll = this.server.create('poll', {
      answers: [
        {
          type: 'yes',
          labelTranslation: 'answerTypes.yes.label',
          icon: 'glyphicon glyphicon-thumbs-up',
          label: 'Yes',
        },
        {
          type: 'no',
          labelTranslation: 'answerTypes.no.label',
          icon: 'glyphicon glyphicon-thumbs-down',
          label: 'No',
        },
      ],
      encryptionKey,
      options: [{ title: '2015-12-12' }, { title: '2016-01-01' }],
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
              label: 'Yes',
            },
            {
              type: 'yes',
              labelTranslation: 'answerTypes.yes.label',
              icon: 'glyphicon glyphicon-thumbs-up',
              label: 'Yes',
            },
          ],
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
              label: 'Yes',
            },
            {
              id: 'no',
              labelTranslation: 'answerTypes.yes.label',
              icon: 'glyphicon glyphicon-thumbs-up',
              label: 'Yes',
            },
          ],
        }),
      ],
    });

    await visit(`/poll/${poll.id}?encryptionKey=${encryptionKey}`);
    assert.strictEqual(currentRouteName(), 'poll.participation');

    await click('.nav [data-test-link="evaluation"]');
    assert.strictEqual(currentRouteName(), 'poll.evaluation');
    assert
      .dom('.tab-pane h2')
      .hasText(t('poll.evaluation.label').toString(), 'headline is there');
  });
});
