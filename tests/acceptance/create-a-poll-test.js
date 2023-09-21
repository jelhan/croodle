import { currentURL, currentRouteName, findAll, settled, waitFor } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl, t } from 'ember-intl/test-support';
import { setupBrowserNavigationButtons, backButton } from 'ember-cli-browser-navigation-button-test-helper/test-support';
import { DateTime } from 'luxon';
import pageCreateIndex from 'croodle/tests/pages/create/index';
import pageCreateMeta from 'croodle/tests/pages/create/meta';
import pageCreateOptions from 'croodle/tests/pages/create/options';
import pageCreateOptionsDatetime from 'croodle/tests/pages/create/options-datetime';
import pageCreateSettings from 'croodle/tests/pages/create/settings';
import pagePollParticipation from 'croodle/tests/pages/poll/participation';
import asyncThrowsAssertion from '../assertions/async-throws';

module('Acceptance | create a poll', function(hooks) {
  hooks.beforeEach(function() {
    window.localStorage.setItem('locale', 'en');
  });

  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function(assert) {
    assert.asyncThrows = asyncThrowsAssertion;
  });

  test('create a default poll', async function(assert) {
    const dates = [
      DateTime.now().plus({ days: 1 }),
      DateTime.now().plus({ weeks: 1 }),
    ];

    await pageCreateIndex.visit();
    assert.equal(currentRouteName(), 'create.index');
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

    await pageCreateIndex.next();
    assert.equal(currentRouteName(), 'create.meta');
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

    await pageCreateMeta
      .title('default poll')
      .next();
    assert.equal(currentRouteName(), 'create.options');
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

    await pageCreateOptions.selectDates(dates);
    await pageCreateOptions.next();
    assert.equal(currentRouteName(), 'create.options-datetime');
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

    await pageCreateOptionsDatetime.next();
    assert.equal(currentRouteName(), 'create.settings');
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

    // simulate temporary server error
    this.server.post('/polls', undefined, 503);

    await assert.asyncThrows(async () => {
      await pageCreateSettings.save();
    }, 'Ember Data Request POST /api/index.php/polls returned a 503');
    assert.equal(currentRouteName(), 'create.settings');

    // simulate server is available again
    // defer creation for testing loading spinner
    let resolveSubmission;
    let resolveSubmissionWith;
    this.server.post('/polls', function(schema) {
      return new Promise((resolve) => {
        let attrs = this.normalizedRequestAttrs();

        resolveSubmission = resolve;
        resolveSubmissionWith = schema.polls.create(attrs);
      });
    });

    pageCreateSettings.save();

    // shows loading spinner while saving
    await waitFor('[data-test-button="submit"] .spinner-border', {
      timeoutMessage: 'timeout while waiting for loading spinner to appear',
    });
    assert.ok(true, 'loading spinner is shown');

    resolveSubmission(resolveSubmissionWith);
    await settled();

    assert.equal(currentRouteName(), 'poll.participation');
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
    assert.deepEqual(
      pagePollParticipation.options().labels,
      dates.map((date) => Intl.DateTimeFormat('en-US', { dateStyle: "full" }).format(date)),
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

  test('create a poll for answering a question', async function(assert) {
    await pageCreateIndex.visit();
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

    await pageCreateIndex
      .pollType('MakeAPoll')
      .next();
    assert.equal(currentRouteName(), 'create.meta');
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

    await pageCreateMeta
      .title('default poll')
      .next();
    assert.equal(currentRouteName(), 'create.options');
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
    assert.ok(
      pageCreateOptions.firstTextOption.inputHasFocus,
      'first option input has autofocus'
    );
    assert.equal(
      pageCreateOptions.textOptions().count,
      2,
      'there are two input fields as default'
    );

    await pageCreateOptions.next();
    assert.equal(
      currentRouteName(),
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

    await pageCreateOptions.textOptions(0).title('option a');
    await pageCreateOptions.textOptions(1).title('option c');
    await pageCreateOptions.textOptions(0).add();
    assert.equal(
      pageCreateOptions.textOptions().count,
      3,
      'option was added'
    );

    await pageCreateOptions.textOptions(1).title('option b');
    await pageCreateOptions.textOptions(2).add();
    assert.equal(
      pageCreateOptions.textOptions().count,
      4,
      'option was added'
    );

    await pageCreateOptions.textOptions(3).title('to be deleted');
    await pageCreateOptions.textOptions(3).delete();
    assert.equal(
      pageCreateOptions.textOptions().count,
      3,
      'option got deleted'
    );

    await pageCreateOptions.next();
    assert.equal(currentRouteName(), 'create.settings');
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

    await pageCreateSettings.save();
    assert.equal(currentRouteName(), 'poll.participation');
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

  test('create a poll with times and description', async function(assert) {
    const days = [
      DateTime.now().plus({ days: 1 }),
      DateTime.now().plus({ weeks: 1 }),
    ];

    await pageCreateIndex.visit();
    await pageCreateIndex.next();
    assert.equal(currentRouteName(), 'create.meta');

    await pageCreateMeta
      .title('default poll')
      .description('a sample description')
      .next();
    assert.equal(currentRouteName(), 'create.options');

    await pageCreateOptions.selectDates(days);
    await pageCreateOptions.next();
    assert.equal(currentRouteName(), 'create.options-datetime');
    assert.deepEqual(
      pageCreateOptionsDatetime.days().labels,
      days.map((day) => Intl.DateTimeFormat('en-US', { dateStyle: "full" }).format(day)),
      'time inputs having days as label'
    );

    await pageCreateOptionsDatetime.times(0).time('10:00');
    await pageCreateOptionsDatetime.times(0).add();
    await pageCreateOptionsDatetime.times(1).time('18:00');
    await pageCreateOptionsDatetime.times(2).time('12:00');
    await pageCreateOptionsDatetime.next();
    assert.equal(currentRouteName(), 'create.settings');

    await pageCreateSettings.save();
    assert.equal(currentRouteName(), 'poll.participation');
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
        Intl.DateTimeFormat('en-US', { dateStyle: "full", timeStyle: "short" }).format(days[0].set({ hour: 10, minutes: 0 })),
        Intl.DateTimeFormat('en-US', { timeStyle: "short" }).format(days[0].set({ hours: 18, minutes: 0 })),
        Intl.DateTimeFormat('en-US', { dateStyle: "full", timeStyle: "short" }).format(days[1].set({ hour: 12, minutes: 0 })),
      ],
      'options are correctly labeled'
    );
  });

  test('create a poll with only one day and multiple times', async function(assert) {
    const day = DateTime.now().plus({ days: 1 });

    await pageCreateIndex.visit();
    await pageCreateIndex.next();
    assert.equal(currentRouteName(), 'create.meta');

    await pageCreateMeta
      .title('default poll')
      .description('a sample description')
      .next();
    assert.equal(currentRouteName(), 'create.options');

    await pageCreateOptions.selectDates([ day ]);
    await pageCreateOptions.next();
    assert.equal(currentRouteName(), 'create.options-datetime');
    assert.deepEqual(
      pageCreateOptionsDatetime.days().labels,
      [ Intl.DateTimeFormat('en-US', { dateStyle: "full" }).format(day) ],
      'time inputs having days as label'
    );

    await pageCreateOptionsDatetime.times(0).time('10:00');
    await pageCreateOptionsDatetime.times(0).add();
    await pageCreateOptionsDatetime.times(1).time('18:00');
    await pageCreateOptionsDatetime.next();
    assert.equal(currentRouteName(), 'create.settings');

    await pageCreateSettings.save();
    assert.equal(currentRouteName(), 'poll.participation');
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
        Intl.DateTimeFormat('en-US', { dateStyle: "full", timeStyle: "short" }).format(day.set({ hours: 10, minutes: 0 })),
        Intl.DateTimeFormat('en-US', { timeStyle: "short" }).format(day.set({ hours: 18, minutes: 0 })),
      ],
      'options are correctly labeled'
    );
  });

  test('create a poll with only one day (without time)', async function(assert) {
    const day = DateTime.now().plus({ days: 1 });

    await pageCreateIndex.visit();
    await pageCreateIndex.next();
    assert.equal(currentRouteName(), 'create.meta');

    await pageCreateMeta
      .title('default poll')
      .description('a sample description')
      .next();
    assert.equal(currentRouteName(), 'create.options');

    await pageCreateOptions.selectDates([ day ]);
    await pageCreateOptions.next();
    assert.equal(currentRouteName(), 'create.options-datetime');
    assert.deepEqual(
      pageCreateOptionsDatetime.days().labels,
      [ Intl.DateTimeFormat('en-US', { dateStyle: "full" }).format(day) ],
      'time inputs having days as label'
    );

    await pageCreateOptionsDatetime.next();
    assert.equal(currentRouteName(), 'create.settings');

    await pageCreateSettings.save();
    assert.equal(currentRouteName(), 'poll.participation');
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
        Intl.DateTimeFormat('en-US', { dateStyle: "full" }).format(day)
      ],
      'options are correctly labeled'
    );
  });

  test('create a poll with only one day (with time)', async function(assert) {
    const day = DateTime.now().plus({ days: 1 });

    await pageCreateIndex.visit();
    await pageCreateIndex.next();
    assert.equal(currentRouteName(), 'create.meta');

    await pageCreateMeta
      .title('default poll')
      .description('a sample description')
      .next();
    assert.equal(currentRouteName(), 'create.options');

    await pageCreateOptions.selectDates([ day ]);
    await pageCreateOptions.next();
    assert.equal(currentRouteName(), 'create.options-datetime');
    assert.deepEqual(
      pageCreateOptionsDatetime.days().labels,
      [ Intl.DateTimeFormat('en-US', { dateStyle: "full" }).format(day) ],
      'time inputs having days as label'
    );

    await pageCreateOptionsDatetime.times(0).time('22:30');
    await pageCreateOptionsDatetime.next();
    assert.equal(currentRouteName(), 'create.settings');

    await pageCreateSettings.save();
    assert.equal(currentRouteName(), 'poll.participation');
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
        Intl.DateTimeFormat('en-US', { dateStyle: "full", timeStyle: "short" }).format(day.set({ hours: 22, minutes: 30 })),
      ],
      'options are correctly labeled'
    );
  });

  test('create a poll for answering a question with only one option', async function(assert) {
    await pageCreateIndex.visit();

    await pageCreateIndex
      .pollType('MakeAPoll')
      .next();
    assert.equal(currentRouteName(), 'create.meta');

    await pageCreateMeta
      .title('default poll')
      .next();
    assert.equal(currentRouteName(), 'create.options');
    assert.equal(
      pageCreateOptions.textOptions().count,
      2,
      'there are two input fields as default'
    );

    await pageCreateOptions.textOptions(0).title('option a');
    await pageCreateOptions.textOptions(1).delete();
    assert.equal(
      pageCreateOptions.textOptions().count,
      1,
      'option was deleted'
    );

    await pageCreateOptions.next();
    assert.equal(currentRouteName(), 'create.settings');

    await pageCreateSettings.save();
    assert.equal(currentRouteName(), 'poll.participation');
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

  test('create a poll and using back button (find a date)', async function(assert) {
    let days = [
      DateTime.fromISO('2016-01-02'),
      DateTime.fromISO('2016-01-13'),
    ];

    setupBrowserNavigationButtons();

    await pageCreateIndex.visit();
    await pageCreateIndex.next();
    assert.equal(currentRouteName(), 'create.meta');

    await pageCreateMeta
      .title('default poll')
      .description('a sample description')
      .next();
    assert.equal(currentRouteName(), 'create.options');

    await pageCreateOptions.selectDates(days);
    await pageCreateOptions.next();
    assert.equal(currentRouteName(), 'create.options-datetime');
    assert.deepEqual(
      pageCreateOptionsDatetime.days().labels,
      days.map((day) => Intl.DateTimeFormat('en-US', { dateStyle: "full" }).format(day)),
      'time inputs having days as label'
    );

    await pageCreateOptionsDatetime.times(1).time('10:00');
    await backButton();
    assert.equal(currentRouteName(), 'create.options');
    assert.deepEqual(
      findAll('.ember-power-calendar-day--selected').map((el) => el.dataset.date),
      days.map((day) => day.toISODate()),
      'days are still present after back button is used'
    );

    await pageCreateOptions.next();
    assert.equal(currentRouteName(), 'create.options-datetime');

    await pageCreateOptionsDatetime.next();
    assert.equal(currentRouteName(), 'create.settings');

    await pageCreateSettings.save();
    assert.equal(currentRouteName(), 'poll.participation');
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
        Intl.DateTimeFormat('en-US', { dateStyle: "full" }).format(days[0]),
        Intl.DateTimeFormat('en-US', { dateStyle: "full", timeStyle: "short" }).format(days[1].set({ hours: 10, minutes: 0 })),
      ],
      'options are correctly labeled'
    );
  });

  test('Start at first step is enforced', async function(assert) {
    await pageCreateSettings.visit();
    assert.equal(currentRouteName(), 'create.index');
  });

  test('back button', async function(assert) {
    await pageCreateIndex.visit();
    assert.equal(currentRouteName(), 'create.index');

    await pageCreateIndex.next();
    assert.equal(currentRouteName(), 'create.meta');

    await pageCreateMeta
      .title('foo')
      .next();
    assert.equal(currentRouteName(), 'create.options');

    await pageCreateOptions.selectDates([new Date()]);
    await pageCreateOptions.next();
    assert.equal(currentRouteName(), 'create.options-datetime');

    await pageCreateOptionsDatetime.next();
    assert.equal(currentRouteName(), 'create.settings');

    await pageCreateSettings.back();
    assert.equal(currentRouteName(), 'create.options-datetime');

    await pageCreateOptionsDatetime.back();
    assert.equal(currentRouteName(), 'create.options');

    await pageCreateOptions.back();
    assert.equal(currentRouteName(), 'create.meta');

    await pageCreateMeta.back();
    assert.equal(currentRouteName(), 'create.index');

    await pageCreateIndex
      .pollType('MakeAPoll')
      .next();
    assert.equal(currentRouteName(), 'create.meta');

    await pageCreateMeta.next();
    assert.equal(currentRouteName(), 'create.options');

    await pageCreateOptions.textOptions(1).title('bar');
    await pageCreateOptions.next();
    assert.equal(currentRouteName(), 'create.settings');

    await pageCreateSettings.back();
    assert.equal(currentRouteName(), 'create.options');

    await pageCreateOptions.back();
    assert.equal(currentRouteName(), 'create.meta');

    await pageCreateMeta.back();
    assert.equal(currentRouteName(), 'create.index');
  });
});
