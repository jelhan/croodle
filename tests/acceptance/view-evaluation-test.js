import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'croodle/tests/helpers/start-app';
import Pretender from 'pretender';
import serverGetPolls from '../helpers/server-get-polls';
import moment from 'moment';
/* jshint proto: true */

let application, server;
let dateString;

module('Acceptance | view evaluation', {
  beforeEach() {
    application = startApp();
    application.__container__.lookup('adapter:application').__proto__.namespace = '';

    server = new Pretender();
    dateString = moment.localeData()
      .longDateFormat('LLLL')
      .replace(
        moment.localeData().longDateFormat('LT'), '')
      .trim();
  },
  afterEach() {
    server.shutdown();

    Ember.run(application, 'destroy');
  }
});

test('evaluation summary is not present for poll without participants', function(assert) {
  let id = 'test';
  let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';

  server.get(`/polls/${id}`, function() {
    return serverGetPolls(
      {
        id,
        users: []
      }, encryptionKey
    );
  });

  visit(`/poll/${id}?encryptionKey=${encryptionKey}`);

  andThen(function() {
    assert.equal(currentPath(), 'poll.participation');
    switchTab('evaluation');

    andThen(function() {
      assert.equal(find('.tab-content .tab-pane .evaluation-summary').length, 0, 'evaluation summary is not present');
    });
  });
});

test('evaluation is correct for FindADate', function(assert) {
  let id = 'test';
  let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';

  server.get(`/polls/${id}`, function() {
    return serverGetPolls(
      {
        id,
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
        options: [
          { title: '2015-12-12' },
          { title: '2016-01-01' }
        ],
        users: [
          {
            id: `${id}_0`,
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
            ],
            creationDate: '2015-01-01T00:00:00.000Z'
          },
          {
            id: `${id}_1`,
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
            ],
            creationDate: '2015-08-01T00:00:00.000Z'
          }
        ]
      }, encryptionKey
    );
  });

  visit(`/poll/${id}/evaluation?encryptionKey=${encryptionKey}`);

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
      moment('2016-01-01').format(dateString),
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
  let id = 'test';
  let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';

  server.get(`/polls/${id}`, function() {
    return serverGetPolls(
      {
        id,
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
        options: [
          { title: 'first option' },
          { title: 'second option' }
        ],
        pollType: 'MakeAPoll',
        users: [
          {
            id: `${id}_0`,
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
            ],
            creationDate: '2015-01-01T00:00:00.000Z'
          },
          {
            id: `${id}_1`,
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
            ],
            creationDate: '2015-08-01T00:00:00.000Z'
          }
        ]
      }, encryptionKey
    );
  });

  visit(`/poll/${id}/evaluation?encryptionKey=${encryptionKey}`);

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
      find('.user-selections-table thead th').map((i, el) => $(el).text().trim()).get(),
      ['', 'first option', 'second option'],
      'dates are used as table headers'
    );
    assert.deepEqual(
      find('.user-selections-table tbody tr:nth-child(1) td').map((i, el) => $(el).text().trim()).get(),
      ['Maximilian', 'Yes', 'Yes'],
      'answers shown in table are correct for first user'
    );
    assert.deepEqual(
      find('.user-selections-table tbody tr:nth-child(2) td').map((i, el) => $(el).text().trim()).get(),
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
  let id = 'test';
  let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';

  server.get(`/polls/${id}`, function() {
    return serverGetPolls(
      {
        id,
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
        options: [
          { title: '2015-12-12' },
          { title: '2016-01-01' }
        ],
        users: [
          {
            id: `${id}_0`,
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
            ],
            creationDate: '2015-01-01T00:00:00.000Z'
          },
          {
            id: `${id}_1`,
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
            ],
            creationDate: '2015-08-01T00:00:00.000Z'
          }
        ]
      }, encryptionKey
    );
  });

  visit(`/poll/${id}?encryptionKey=${encryptionKey}`);

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
