import { test } from 'qunit';
import jQuery from 'jquery';
import moduleForAcceptance from 'croodle/tests/helpers/module-for-acceptance';
import moment from 'moment';
/* jshint proto: true */

moduleForAcceptance('Acceptance | view evaluation', {
  beforeEach() {
    window.localStorage.setItem('locale', 'en');
    moment.locale('en');
  }
});

test('evaluation summary is not present for poll without participants', function(assert) {
  let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let poll = server.create('poll', {
    encryptionKey
  });

  visit(`/poll/${poll.id}?encryptionKey=${encryptionKey}`);

  andThen(function() {
    assert.equal(currentPath(), 'poll.participation');
    switchTab('evaluation');

    andThen(function() {
      assert.equal(find('.tab-content .tab-pane .evaluation-summary').length, 0, 'evaluation summary is not present');
    });
  });
});

test('evaluation is correct for FindADate', function(assert) {
  let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let user1 = server.create('user', {
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
  let user2 = server.create('user', {
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
  let poll = server.create('poll', {
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

  visit(`/poll/${poll.id}/evaluation?encryptionKey=${encryptionKey}`);

  andThen(function() {
    assert.equal(currentPath(), 'poll.evaluation');
    assert.equal(find('.tab-content .tab-pane .evaluation-summary').length, 1, 'evaluation summary is present');
    assert.equal(
      find('.participants').text().trim(),
      t('poll.evaluation.participants', { count: 2 }).toString(),
      'participants are counted correctly'
    );
    assert.equal(
      find('.best-options strong').text().trim(),
      'Friday, January 1, 2016',
      'options are evaluated correctly'
    );
    assert.equal(
      find('.last-participation').text().trim(),
      t('poll.evaluation.lastParticipation', {
        ago: moment('2015-08-01T00:00:00.000Z').from()
      }).toString(),
      'last participation is evaluated correctly'
    );
  });
});

test('evaluation is correct for MakeAPoll', function(assert) {
  let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let user1 = server.create('user', {
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
  let user2 = server.create('user', {
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
  let poll = server.create('poll', {
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

  visit(`/poll/${poll.id}/evaluation?encryptionKey=${encryptionKey}`);

  andThen(function() {
    assert.equal(currentPath(), 'poll.evaluation');
    assert.equal(find('.tab-content .tab-pane .evaluation-summary').length, 1, 'evaluation summary is present');
    assert.equal(
      find('.participants').text().trim(),
      t('poll.evaluation.participants', { count: 2 }).toString(),
      'participants are counted correctly'
    );
    assert.equal(
      find('.best-options strong').text().trim(),
      'second option',
      'options are evaluated correctly'
    );
    assert.ok(
      find('.user-selections-table').length,
      'has a table showing user selections'
    );
    assert.deepEqual(
      find('.user-selections-table thead th').map((i, el) => jQuery(el).text().trim()).get(),
      ['', 'first option', 'second option'],
      'dates are used as table headers'
    );
    assert.deepEqual(
      find('.user-selections-table tbody tr:nth-child(1) td').map((i, el) => jQuery(el).text().trim()).get(),
      ['Maximilian', 'Yes', 'Yes'],
      'answers shown in table are correct for first user'
    );
    assert.deepEqual(
      find('.user-selections-table tbody tr:nth-child(2) td').map((i, el) => jQuery(el).text().trim()).get(),
      ['Peter', 'No', 'Yes'],
      'answers shown in table are correct for second user'
    );
    assert.equal(
      find('.last-participation').text().trim(),
      t('poll.evaluation.lastParticipation', {
        ago: moment('2015-08-01T00:00:00.000Z').from()
      }).toString(),
      'last participation is evaluated correctly'
    );
  });
});

test('could open evaluation by tab from poll participation', function(assert) {
  let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let poll = server.create('poll', {
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
      server.create('user', {
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
      server.create('user', {
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

  visit(`/poll/${poll.id}?encryptionKey=${encryptionKey}`);

  andThen(function() {
    assert.equal(currentPath(), 'poll.participation');
    switchTab('evaluation');

    andThen(function() {
      assert.equal(currentPath(), 'poll.evaluation');
      assert.equal(
        find('.tab-pane h2').text().trim(),
        t('poll.evaluation.label').toString(),
        'headline is there'
      );
    });
  });
});
