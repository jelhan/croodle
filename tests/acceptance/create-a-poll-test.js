import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';
import serverPostPolls from '../helpers/server-post-polls';
import moment from 'moment';
import pageCreateIndex from 'croodle/tests/pages/create/index';
import pageCreateMeta from 'croodle/tests/pages/create/meta';
import pageCreateOptions from 'croodle/tests/pages/create/options';
import pageCreateOptionsDatetime from 'croodle/tests/pages/create/options-datetime';
import pageCreateSettings from 'croodle/tests/pages/create/settings';
import pagePollParticipation from 'croodle/tests/pages/poll/participation';
/* jshint proto: true */

const { run } = Ember;

let application, server;
let serverAvailable = true;

const randomString = function(length) {
  return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
};

module('Acceptance | create a poll', {
  beforeEach() {
    window.localStorage.setItem('locale', 'en');

    let lastCreatedPoll = {};
    const pollId = randomString(10);

    application = startApp();
    application.__container__.lookup('adapter:application').__proto__.namespace = '';

    server = new Pretender();

    server.post('/polls',
      function(request) {
        if (!serverAvailable) {
          return [503];
        }

        let ret = serverPostPolls(request.requestBody, pollId);
        lastCreatedPoll = ret[2];
        return ret;
      }
    );

    server.get(`/polls/${pollId}`,
      function() {
        if (!serverAvailable) {
          return [503];
        }

        return [
          200,
          { 'Content-Type': 'application/json' },
          lastCreatedPoll
        ];
      }
    );

    moment.locale(
      application.__container__.lookup('service:i18n').get('locale')
    );
  },
  afterEach() {
    server.shutdown();

    run(application, 'destroy');
  }
});

test('create a default poll', function(assert) {
  const dates = [
    moment().add(1, 'day'),
    moment().add(1, 'week')
  ];

  pageCreateIndex
    .visit();

  andThen(function() {
    assert.equal(currentPath(), 'create.index');
    assert.equal(
      pageCreateIndex.statusBar().active,
      t('create.formStep.type').toString(),
      'status bar shows correct item as current path (index)'
    );
    assert.deepEqual(
      pageCreateIndex.statusBar().toArray().map((el) => el.text),
      [
        t('create.formStep.type').toString(),
        t('create.formStep.meta').toString(),
        t('create.formStep.options.days').toString(),
        t('create.formStep.options-datetime').toString(),
        t('create.formStep.settings').toString()
      ],
      'status bar has correct items'
    );
    assert.deepEqual(
      pageCreateIndex.statusBar().toArray().map((el) => el.isDisabled),
      [false, true, true, true, true],
      'status bar has correct items disabled (index)'
    );
    assert.ok(
      pageCreateIndex.pollTypeHasFocus,
      'poll type selection has autofocus'
    );

    pageCreateIndex
      .next();

    andThen(function() {
      assert.equal(currentPath(), 'create.meta');
      assert.equal(
        pageCreateMeta.statusBar().active,
        t('create.formStep.meta').toString(),
        'status bar shows correct item as current path (meta)'
      );
      assert.deepEqual(
        pageCreateMeta.statusBar().toArray().map((el) => el.isDisabled),
        [false, false, true, true, true],
        'status bar has correct items disabled (meta)'
      );
      assert.ok(
        pageCreateMeta.titleHasFocus,
        'title input has autofocus'
      );

      pageCreateMeta
        .title('default poll')
        .next();

      andThen(function() {
        assert.equal(currentPath(), 'create.options');
        assert.equal(
          pageCreateOptions.statusBar().active,
          t('create.formStep.options.days').toString(),
          'status bar shows correct item as current path (options.days)'
        );
        assert.deepEqual(
          pageCreateOptions.statusBar().toArray().map((el) => el.isDisabled),
          [false, false, false, true, true],
          'status bar has correct items disabled (options)'
        );

        pageCreateOptions
          .dateOptions(dates);
        pageCreateOptions
          .next();

        andThen(function() {
          assert.equal(currentPath(), 'create.options-datetime');
          assert.equal(
            pageCreateOptionsDatetime.statusBar().active,
            t('create.formStep.options-datetime').toString(),
            'status bar shows correct item as current path (options-datetime)'
          );
          assert.deepEqual(
            pageCreateOptionsDatetime.statusBar().toArray().map((el) => el.isDisabled),
            [false, false, false, false, true],
            'status bar has correct items disabled (options-datetime)'
          );
          assert.ok(
            pageCreateOptionsDatetime.firstTime.inputHasFocus,
            'first time input has autofocus'
          );

          pageCreateOptionsDatetime
            .next();

          andThen(() => {
            assert.equal(currentPath(), 'create.settings');
            assert.equal(
              pageCreateSettings.statusBar().active,
              t('create.formStep.settings').toString(),
              'status bar shows correct item as current path (settings)'
            );
            assert.deepEqual(
              pageCreateSettings.statusBar().toArray().map((el) => el.isDisabled),
              [false, false, false, false, false],
              'status bar has correct items disabled (settings)'
            );
            assert.ok(
              pageCreateSettings.availableAnswersHasFocus,
              'available answers selection has autofocus'
            );

            // simulate temporate server error
            serverAvailable = false;
            pageCreateSettings
              .save();

            andThen(() => {
              assert.equal(currentPath(), 'create.settings');

              serverAvailable = true;

              pageCreateSettings
                .save();

              andThen(function() {
                assert.equal(currentPath(), 'poll.participation');
                assert.ok(
                  pagePollParticipation.urlIsValid() === true,
                  `poll url ${currentURL()} is valid`
                );
                assert.equal(
                  pagePollParticipation.title,
                  'default poll',
                  'poll title is correct'
                );
                assert.equal(
                  pagePollParticipation.description,
                  '',
                  'poll description is correct'
                );
                const dayFormat = moment.localeData().longDateFormat('LLLL')
                                    .replace(
                                      moment.localeData().longDateFormat('LT'), '')
                                    .trim();
                assert.deepEqual(
                  pagePollParticipation.options().labels,
                  dates.map((date) => date.format(dayFormat)),
                  'options are correctly labeled'
                );
                assert.deepEqual(
                  pagePollParticipation.options().answers,
                  [
                    t('answerTypes.yes.label').toString(),
                    t('answerTypes.no.label').toString()
                  ],
                  'answers are correctly labeled'
                );
                assert.ok(
                  pagePollParticipation.nameHasFocus,
                  'name input has autofocus'
                );
              });
            });
          });
        });
      });
    });
  });
});

test('create a poll for answering a question', function(assert) {
  pageCreateIndex
    .visit();

  andThen(function() {
    assert.equal(
      pageCreateIndex.statusBar().active,
      t('create.formStep.type').toString(),
      'status bar shows correct item as current path (index)'
    );
    assert.deepEqual(
      pageCreateIndex.statusBar().toArray().map((el) => el.isDisabled),
      [false, true, true, true, true],
      'status bar has correct items disabled'
    );

    pageCreateIndex
      .pollType('MakeAPoll')
      .next();

    andThen(function() {
      assert.equal(currentPath(), 'create.meta');
      assert.equal(
        pageCreateMeta.statusBar().active,
        t('create.formStep.meta').toString(),
        'status bar shows correct item as current path (meta)'
      );
      assert.deepEqual(
        pageCreateMeta.statusBar().toArray().map((el) => el.text),
        [
          t('create.formStep.type').toString(),
          t('create.formStep.meta').toString(),
          t('create.formStep.options.text').toString(),
          t('create.formStep.settings').toString()
        ],
        'status bar has correct items'
      );
      assert.deepEqual(
        pageCreateMeta.statusBar().toArray().map((el) => el.isDisabled),
        [false, false, true, true],
        'status bar has correct items disabled (meta)'
      );

      pageCreateMeta
        .title('default poll')
        .next();

      andThen(function() {
        assert.equal(currentPath(), 'create.options');
        assert.equal(
          pageCreateOptions.statusBar().active,
          t('create.formStep.options.text').toString(),
          'status bar shows correct item as current path (options.text)'
        );
        assert.deepEqual(
          pageCreateOptions.statusBar().toArray().map((el) => el.isDisabled),
          [false, false, false, true],
          'status bar has correct items disabled (options)'
        );
        expectComponent('create-options-text');
        assert.ok(
          pageCreateOptions.firstTextOption.inputHasFocus,
          'first option input has autofocus'
        );

        assert.equal(
          pageCreateOptions.textOptions().count,
          2,
          'there are two input fields as default'
        );

        pageCreateOptions.next();

        andThen(function() {
          assert.equal(
            currentPath(),
            'create.options',
            'validation errors prevents transition'
          );
          assert.equal(
            pageCreateOptions.statusBar().active,
            t('create.formStep.options.text').toString(),
            'status bar shows correct item as current path (options.text)'
          );
          assert.ok(
            pageCreateOptions.textOptions(0).hasError &&
            pageCreateOptions.textOptions(1).hasError,
            'validation errors are shown after submit'
          );

          pageCreateOptions
            .textOptions(0).title('option a');
          pageCreateOptions
            .textOptions(1).title('option c');
          pageCreateOptions
            .textOptions(0).add();

          andThen(function() {
            assert.equal(
              pageCreateOptions.textOptions().count,
              3,
              'option was added'
            );
            pageCreateOptions
              .textOptions(1).title('option b');
            pageCreateOptions
              .textOptions(2).add();

            andThen(function() {
              assert.equal(
                pageCreateOptions.textOptions().count,
                4,
                'option was added'
              );
              pageCreateOptions
                .textOptions(3).title('to be deleted');
              pageCreateOptions
                .textOptions(3).delete();

              andThen(function() {
                assert.equal(
                  pageCreateOptions.textOptions().count,
                  3,
                  'option got deleted'
                );

                pageCreateOptions
                  .next();

                andThen(function() {
                  assert.equal(currentPath(), 'create.settings');
                  assert.equal(
                    pageCreateSettings.statusBar().active,
                    t('create.formStep.settings').toString(),
                    'status bar shows correct item as current path (settings)'
                  );
                  assert.deepEqual(
                    pageCreateSettings.statusBar().toArray().map((el) => el.isDisabled),
                    [false, false, false, false],
                    'status bar has correct items disabled (settings)'
                  );

                  pageCreateSettings
                    .save();

                  andThen(function() {
                    assert.equal(currentPath(), 'poll.participation');
                    assert.ok(
                      pagePollParticipation.urlIsValid() === true,
                      'poll url is valid'
                    );
                    assert.equal(
                      pagePollParticipation.title,
                      'default poll',
                      'poll title is correct'
                    );
                    assert.equal(
                      pagePollParticipation.description,
                      '',
                      'poll description is correct'
                    );
                    assert.deepEqual(
                      pagePollParticipation.options().labels,
                      ['option a', 'option b', 'option c'],
                      'options are labeled correctly'
                    );
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

test('create a poll with times and description', function(assert) {
  let days = [
                moment().add(1, 'day'),
                moment().add(1, 'week')
              ];
  const dayFormat = moment.localeData().longDateFormat('LLLL')
                      .replace(
                        moment.localeData().longDateFormat('LT'), '')
                      .trim();

  pageCreateIndex
    .visit();

  andThen(function() {
    pageCreateIndex
      .next();

    andThen(function() {
      assert.equal(currentPath(), 'create.meta');

      pageCreateMeta
        .title('default poll')
        .description('a sample description')
        .next();

      andThen(function() {
        assert.equal(currentPath(), 'create.options');

        pageCreateOptions
          .dateOptions(days);
        pageCreateOptions
          .next();

        andThen(function() {
          assert.equal(currentPath(), 'create.options-datetime');

          assert.deepEqual(
            pageCreateOptionsDatetime.days().labels,
            days.map((day) => day.format(dayFormat)),
            'time inputs having days as label'
          );

          pageCreateOptionsDatetime
            .times(0).time('10:00');
          pageCreateOptionsDatetime
            .times(0).add();

          andThen(() => {
            pageCreateOptionsDatetime
              .times(1).time('18:00');
            pageCreateOptionsDatetime
              .times(2).time('12:00');

            pageCreateOptionsDatetime
              .next();

            andThen(function() {
              assert.equal(currentPath(), 'create.settings');

              pageCreateSettings
                .save();

              andThen(function() {
                assert.equal(currentPath(), 'poll.participation');
                assert.ok(
                  pagePollParticipation.urlIsValid() === true,
                  'poll url is valid'
                );
                assert.equal(
                  pagePollParticipation.title,
                  'default poll',
                  'poll title is correct'
                );
                assert.equal(
                  pagePollParticipation.description,
                  'a sample description',
                  'poll description is correct'
                );
                assert.deepEqual(
                  pagePollParticipation.options().labels,
                  [
                    days[0].hour(10).minute(0).format('LLLL'),
                    days[0].hour(18).minute(0).format('LT'),
                    days[1].hour(12).minute(0).format('LLLL')
                  ],
                  'options are correctly labeled'
                );
              });
            });
          });
        });
      });
    });
  });
});

test('create a poll with only one day and multiple times', function(assert) {
  let day = moment().add(1, 'day');
  const dayFormat = moment.localeData().longDateFormat('LLLL')
                      .replace(
                        moment.localeData().longDateFormat('LT'), '')
                      .trim();

  pageCreateIndex
    .visit();

  andThen(function() {
    pageCreateIndex
      .next();

    andThen(function() {
      assert.equal(currentPath(), 'create.meta');

      pageCreateMeta
        .title('default poll')
        .description('a sample description')
        .next();

      andThen(function() {
        assert.equal(currentPath(), 'create.options');

        pageCreateOptions
          .dateOptions([ day ]);
        pageCreateOptions
          .next();

        andThen(function() {
          assert.equal(currentPath(), 'create.options-datetime');

          assert.deepEqual(
            pageCreateOptionsDatetime.days().labels,
            [ day.format(dayFormat) ],
            'time inputs having days as label'
          );

          pageCreateOptionsDatetime
            .times(0).time('10:00');
          pageCreateOptionsDatetime
            .times(0).add();

          andThen(() => {
            pageCreateOptionsDatetime
              .times(1).time('18:00');

            pageCreateOptionsDatetime
              .next();

            andThen(function() {
              assert.equal(currentPath(), 'create.settings');

              pageCreateSettings
                .save();

              andThen(function() {
                assert.equal(currentPath(), 'poll.participation');
                assert.ok(
                  pagePollParticipation.urlIsValid() === true,
                  'poll url is valid'
                );
                assert.equal(
                  pagePollParticipation.title,
                  'default poll',
                  'poll title is correct'
                );
                assert.equal(
                  pagePollParticipation.description,
                  'a sample description',
                  'poll description is correct'
                );
                assert.deepEqual(
                  pagePollParticipation.options().labels,
                  [
                    day.hour(10).minute(0).format('LLLL'),
                    day.hour(18).minute(0).format('LT')
                  ],
                  'options are correctly labeled'
                );
              });
            });
          });
        });
      });
    });
  });
});

test('create a poll with only one day (without time)', function(assert) {
  let day = moment().add(1, 'day');
  const dayFormat = moment.localeData().longDateFormat('LLLL')
                      .replace(
                        moment.localeData().longDateFormat('LT'), '')
                      .trim();

  pageCreateIndex
    .visit();

  andThen(function() {
    pageCreateIndex
      .next();

    andThen(function() {
      assert.equal(currentPath(), 'create.meta');

      pageCreateMeta
        .title('default poll')
        .description('a sample description')
        .next();

      andThen(function() {
        assert.equal(currentPath(), 'create.options');

        pageCreateOptions
          .dateOptions([ day ]);
        pageCreateOptions
          .next();

        andThen(function() {
          assert.equal(currentPath(), 'create.options-datetime');

          assert.deepEqual(
            pageCreateOptionsDatetime.days().labels,
            [ day.format(dayFormat) ],
            'time inputs having days as label'
          );

          pageCreateOptionsDatetime
            .next();
          andThen(function() {
            assert.equal(currentPath(), 'create.settings');

            pageCreateSettings
              .save();

            andThen(function() {
              assert.equal(currentPath(), 'poll.participation');
              assert.ok(
                pagePollParticipation.urlIsValid() === true,
                'poll url is valid'
              );
              assert.equal(
                pagePollParticipation.title,
                'default poll',
                'poll title is correct'
              );
              assert.equal(
                pagePollParticipation.description,
                'a sample description',
                'poll description is correct'
              );
              assert.deepEqual(
                pagePollParticipation.options().labels,
                [
                  day.format(dayFormat)
                ],
                'options are correctly labeled'
              );
            });
          });
        });
      });
    });
  });
});

test('create a poll with only one day (with time)', function(assert) {
  let day = moment().add(1, 'day');
  const dayFormat = moment.localeData().longDateFormat('LLLL')
                      .replace(
                        moment.localeData().longDateFormat('LT'), '')
                      .trim();

  pageCreateIndex
    .visit();

  andThen(function() {
    pageCreateIndex
      .next();

    andThen(function() {
      assert.equal(currentPath(), 'create.meta');

      pageCreateMeta
        .title('default poll')
        .description('a sample description')
        .next();

      andThen(function() {
        assert.equal(currentPath(), 'create.options');

        pageCreateOptions
          .dateOptions([ day ]);
        pageCreateOptions
          .next();

        andThen(function() {
          assert.equal(currentPath(), 'create.options-datetime');

          assert.deepEqual(
            pageCreateOptionsDatetime.days().labels,
            [ day.format(dayFormat) ],
            'time inputs having days as label'
          );

          pageCreateOptionsDatetime
            .times(0).time('22:30');
          pageCreateOptionsDatetime
            .next();

          andThen(function() {
            assert.equal(currentPath(), 'create.settings');

            pageCreateSettings
              .save();

            andThen(function() {
              assert.equal(currentPath(), 'poll.participation');
              assert.ok(
                pagePollParticipation.urlIsValid() === true,
                'poll url is valid'
              );
              assert.equal(
                pagePollParticipation.title,
                'default poll',
                'poll title is correct'
              );
              assert.equal(
                pagePollParticipation.description,
                'a sample description',
                'poll description is correct'
              );
              assert.deepEqual(
                pagePollParticipation.options().labels,
                [
                  day.hour(22).minute(30).format('LLLL')
                ],
                'options are correctly labeled'
              );
            });
          });
        });
      });
    });
  });
});

test('create a poll for answering a question with only one option', function(assert) {
  pageCreateIndex
    .visit();

  andThen(function() {
    pageCreateIndex
      .pollType('MakeAPoll')
      .next();

    andThen(function() {
      assert.equal(currentPath(), 'create.meta');

      pageCreateMeta
        .title('default poll')
        .next();

      andThen(function() {
        assert.equal(currentPath(), 'create.options');
        expectComponent('create-options-text');

        assert.equal(
          pageCreateOptions.textOptions().count,
          2,
          'there are two input fields as default'
        );

        pageCreateOptions
          .textOptions(0).title('option a');
        pageCreateOptions
          .textOptions(1).delete();

        andThen(function() {
          assert.equal(
            pageCreateOptions.textOptions().count,
            1,
            'option was deleted'
          );

          pageCreateOptions
            .next();

          andThen(function() {
            assert.equal(currentPath(), 'create.settings');

            pageCreateSettings
              .save();

            andThen(function() {
              assert.equal(currentPath(), 'poll.participation');
              assert.ok(
                pagePollParticipation.urlIsValid() === true,
                'poll url is valid'
              );
              assert.equal(
                pagePollParticipation.title,
                'default poll',
                'poll title is correct'
              );
              assert.equal(
                pagePollParticipation.description,
                '',
                'poll description is correct'
              );
              assert.deepEqual(
                pagePollParticipation.options().labels,
                ['option a'],
                'options are labeled correctly'
              );
            });
          });
        });
      });
    });
  });
});

test('create a poll and using back button (find a date)', function(assert) {
  let days = [
    moment().add(1, 'day').hours(0).minutes(0).seconds(0).milliseconds(0),
    moment().add(1, 'week').hours(0).minutes(0).seconds(0).milliseconds(0)
  ];
  const dayFormat = moment.localeData().longDateFormat('LLLL')
                      .replace(
                        moment.localeData().longDateFormat('LT'), '')
                      .trim();

  setupBrowserNavigationButtons();

  pageCreateIndex
    .visit();

  andThen(function() {
    pageCreateIndex
      .next();

    andThen(function() {
      assert.equal(currentPath(), 'create.meta');

      pageCreateMeta
        .title('default poll')
        .description('a sample description')
        .next();

      andThen(function() {
        assert.equal(currentPath(), 'create.options');

        pageCreateOptions
          .dateOptions(days);
        pageCreateOptions
          .next();

        andThen(function() {
          assert.equal(currentPath(), 'create.options-datetime');

          assert.deepEqual(
            pageCreateOptionsDatetime.days().labels,
            days.map((day) => day.format(dayFormat)),
            'time inputs having days as label'
          );
          pageCreateOptionsDatetime.times(1).time('10:00');

          backButton();

          andThen(() => {
            assert.equal(currentPath(), 'create.options');
            assert.deepEqual(
              pageCreateOptions.dateOptions().map((date) => date.toISOString()),
              days.map((day) => day.toISOString()),
              'days are still present after back button is used'
            );

            pageCreateOptions
              .next();

            andThen(() => {
              assert.equal(currentPath(), 'create.options-datetime');

              pageCreateOptionsDatetime
                .next();

              andThen(function() {
                assert.equal(currentPath(), 'create.settings');

                pageCreateSettings
                  .save();
                andThen(function() {
                  assert.equal(currentPath(), 'poll.participation');
                  assert.ok(
                    pagePollParticipation.urlIsValid() === true,
                    'poll url is valid'
                  );
                  assert.equal(
                    pagePollParticipation.title,
                    'default poll',
                    'poll title is correct'
                  );
                  assert.equal(
                    pagePollParticipation.description,
                    'a sample description',
                    'poll description is correct'
                  );
                  assert.deepEqual(
                    pagePollParticipation.options().labels,
                    [
                      days[0].format(dayFormat),
                      days[1].hour(10).minute(0).format('LLLL')
                    ],
                    'options are correctly labeled'
                  );
                });
              });
            });
          });
        });
      });
    });
  });
});

test('Start at first step is enforced', function(assert) {
  pageCreateSettings.visit();
  andThen(() => {
    assert.equal(currentPath(), 'create.index');
  });
});

test('back button', function(assert) {
  pageCreateIndex.visit();

  andThen(() => {
    assert.equal(currentPath(), 'create.index');
    pageCreateIndex.next();

    andThen(() => {
      assert.equal(currentPath(), 'create.meta');
      pageCreateMeta
        .title('foo')
        .next();

      andThen(() => {
        assert.equal(currentPath(), 'create.options');
        pageCreateOptions
          .dateOptions([new Date()]);
        pageCreateOptions
          .next();

        andThen(() => {
          assert.equal(currentPath(), 'create.options-datetime');
          pageCreateOptionsDatetime.next();

          andThen(() => {
            assert.equal(currentPath(), 'create.settings');
            pageCreateSettings.back();

            andThen(() => {
              assert.equal(currentPath(), 'create.options-datetime');
              pageCreateOptionsDatetime.back();

              andThen(() => {
                assert.equal(currentPath(), 'create.options');
                pageCreateOptions.back();

                andThen(() => {
                  assert.equal(currentPath(), 'create.meta');
                  pageCreateMeta.back();

                  andThen(() => {
                    assert.equal(currentPath(), 'create.index');
                    pageCreateIndex
                      .pollType('MakeAPoll')
                      .next();

                    andThen(() => {
                      assert.equal(currentPath(), 'create.meta');
                      pageCreateMeta.next();

                      andThen(() => {
                        assert.equal(currentPath(), 'create.options');
                        pageCreateOptions
                          .textOptions(1).title('bar');
                        pageCreateOptions.next();

                        andThen(() => {
                          assert.equal(currentPath(), 'create.settings');
                          pageCreateSettings.back();

                          andThen(() => {
                            assert.equal(currentPath(), 'create.options');
                            pageCreateOptions.back();

                            andThen(() => {
                              assert.equal(currentPath(), 'create.meta');
                              pageCreateMeta.back();

                              andThen(() => {
                                assert.equal(currentPath(), 'create.index');
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
