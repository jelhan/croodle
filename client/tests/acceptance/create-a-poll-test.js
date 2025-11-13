import {
  click,
  currentURL,
  currentRouteName,
  fillIn,
  find,
  findAll,
  settled,
  visit,
  waitFor,
} from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from '@croodle/client/tests/helpers';
import { t } from 'ember-intl/test-support';
import {
  setupBrowserNavigationButtons,
  backButton,
} from 'ember-cli-browser-navigation-button-test-helper/test-support';
import { DateTime } from 'luxon';
import pageCreateIndex from '@croodle/client/tests/pages/create/index';
import pageCreateMeta from '@croodle/client/tests/pages/create/meta';
import pageCreateOptions from '@croodle/client/tests/pages/create/options';
import pageCreateOptionsDatetime from '@croodle/client/tests/pages/create/options-datetime';
import pageCreateSettings from '@croodle/client/tests/pages/create/settings';
import pagePollParticipation from '@croodle/client/tests/pages/poll/participation';
import asyncThrowsAssertion from '../assertions/async-throws';
import { calendarSelect } from 'ember-power-calendar/test-support/helpers';
import sinon from 'sinon';

module('Acceptance | create a poll', function (hooks) {
  hooks.beforeEach(function () {
    window.localStorage.setItem('locale', 'en');
  });

  setupApplicationTest(hooks);

  hooks.beforeEach(function (assert) {
    assert.asyncThrows = asyncThrowsAssertion;
  });

  test('create a default poll', async function (assert) {
    sinon.useFakeTimers({
      now: new Date('2025-03-01'),
      shouldAdvanceTime: true,
    });

    await pageCreateIndex.visit();
    assert.strictEqual(currentRouteName(), 'create.index');
    assert
      .dom('[data-test-form-step].is-active')
      .hasText(
        t('create.formStep.type'),
        'status bar shows correct item as current path (index)',
      );
    assert.deepEqual(
      findAll('[data-test-form-step]').map((el) => el.textContent.trim()),
      [
        t('create.formStep.type').toString(),
        t('create.formStep.meta').toString(),
        t('create.formStep.options.days').toString(),
        t('create.formStep.options-datetime').toString(),
        t('create.formStep.settings').toString(),
      ],
      'status bar has correct items',
    );
    assert.deepEqual(
      findAll('[data-test-form-step]').map((el) => el.disabled),
      [false, true, true, true, true],
      'status bar has correct items disabled (index)',
    );
    assert.ok(
      pageCreateIndex.pollTypeHasFocus,
      'poll type selection has autofocus',
    );

    await pageCreateIndex.next();
    assert.strictEqual(currentRouteName(), 'create.meta');
    assert
      .dom('[data-test-form-step].is-active')
      .hasText(
        t('create.formStep.meta'),
        'status bar shows correct item as current path (meta)',
      );
    assert.deepEqual(
      findAll('[data-test-form-step]').map((el) => el.disabled),
      [false, false, true, true, true],
      'status bar has correct items disabled (meta)',
    );
    assert.ok(pageCreateMeta.titleHasFocus, 'title input has autofocus');

    await pageCreateMeta.title('default poll').next();
    assert.strictEqual(currentRouteName(), 'create.options');
    assert
      .dom('[data-test-form-step].is-active')
      .hasText(
        t('create.formStep.options.days'),
        'status bar shows correct item as current path (options.days)',
      );
    assert.deepEqual(
      findAll('[data-test-form-step]').map((el) => el.disabled),
      [false, false, false, true, true],
      'status bar has correct items disabled (options)',
    );

    await pageCreateOptions.selectDates([
      new Date('2025-03-02'),
      new Date('2025-03-07'),
    ]);
    await pageCreateOptions.next();
    assert.strictEqual(currentRouteName(), 'create.options-datetime');
    assert
      .dom('[data-test-form-step].is-active')
      .hasText(
        t('create.formStep.options-datetime'),
        'status bar shows correct item as current path (options-datetime)',
      );
    assert.deepEqual(
      findAll('[data-test-form-step]').map((el) => el.disabled),
      [false, false, false, false, true],
      'status bar has correct items disabled (options-datetime)',
    );
    assert.ok(
      pageCreateOptionsDatetime.firstTime.inputHasFocus,
      'first time input has autofocus',
    );

    await pageCreateOptionsDatetime.next();
    assert.strictEqual(currentRouteName(), 'create.settings');
    assert
      .dom('[data-test-form-step].is-active')
      .hasText(
        t('create.formStep.settings'),
        'status bar shows correct item as current path (settings)',
      );
    assert.deepEqual(
      findAll('[data-test-form-step]').map((el) => el.disabled),
      [false, false, false, false, false],
      'status bar has correct items disabled (settings)',
    );
    assert.ok(
      pageCreateSettings.availableAnswersHasFocus,
      'available answers selection has autofocus',
    );

    // simulate server is available again
    // defer creation for testing loading spinner
    let resolveSubmission;
    this.server.post('/polls', function (schema) {
      return new Promise((resolve) => {
        resolveSubmission = () => {
          const attrs = this.normalizedRequestAttrs();
          const poll = schema.polls.create(attrs);
          resolve(poll);
        };
      });
    });

    pageCreateSettings.save();

    // shows loading spinner while saving
    await waitFor('[data-test-button="submit"] .spinner-border', {
      timeoutMessage: 'timeout while waiting for loading spinner to appear',
    });
    assert.ok(true, 'loading spinner is shown');

    resolveSubmission();
    await settled();

    assert.strictEqual(currentRouteName(), 'poll.participation');
    assert.true(
      pagePollParticipation.urlIsValid(),
      `poll url ${currentURL()} is valid`,
    );
    assert.strictEqual(
      pagePollParticipation.title,
      'default poll',
      'poll title is correct',
    );
    assert.strictEqual(
      pagePollParticipation.description,
      '',
      'poll description is correct',
    );
    assert.deepEqual(
      findAll(
        `[data-test-form-element^="option"] label:not(.custom-control-label)`,
      ).map((el) => el.textContent.trim()),
      ['Sunday, March 2, 2025', 'Friday, March 7, 2025'],
      'options are correctly labeled',
    );
    assert.deepEqual(
      Array.from(
        find('[data-test-form-element^="option"]').querySelectorAll(
          '.radio label',
        ),
      ).map((el) => el.textContent.trim()),
      [
        t('answerTypes.yes.label').toString(),
        t('answerTypes.no.label').toString(),
      ],
      'answers are correctly labeled',
    );
    assert.ok(pagePollParticipation.nameHasFocus, 'name input has autofocus');
  });

  test('create a poll for answering a question', async function (assert) {
    await pageCreateIndex.visit();
    assert
      .dom('[data-test-form-step].is-active')
      .hasText(
        t('create.formStep.type').toString(),
        'status bar shows correct item as current path (index)',
      );
    assert.deepEqual(
      findAll('[data-test-form-step]').map((el) => el.disabled),
      [false, true, true, true, true],
      'status bar has correct items disabled',
    );

    await pageCreateIndex.pollType('MakeAPoll').next();
    assert.strictEqual(currentRouteName(), 'create.meta');
    assert
      .dom('[data-test-form-step].is-active')
      .hasText(
        t('create.formStep.meta').toString(),
        'status bar shows correct item as current path (meta)',
      );
    assert.deepEqual(
      findAll('[data-test-form-step]').map((el) => el.textContent.trim()),
      [
        t('create.formStep.type').toString(),
        t('create.formStep.meta').toString(),
        t('create.formStep.options.text').toString(),
        t('create.formStep.settings').toString(),
      ],
      'status bar has correct items',
    );
    assert.deepEqual(
      findAll('[data-test-form-step]').map((el) => el.disabled),
      [false, false, true, true],
      'status bar has correct items disabled (meta)',
    );

    await pageCreateMeta.title('default poll').next();
    assert.strictEqual(currentRouteName(), 'create.options');
    assert
      .dom('[data-test-form-step].is-active')
      .hasText(
        t('create.formStep.options.text').toString(),
        'status bar shows correct item as current path (options.text)',
      );
    assert.deepEqual(
      findAll('[data-test-form-step]').map((el) => el.disabled),
      [false, false, false, true],
      'status bar has correct items disabled (options)',
    );
    assert.ok(
      pageCreateOptions.firstTextOption.inputHasFocus,
      'first option input has autofocus',
    );
    assert.strictEqual(
      pageCreateOptions.textOptions.length,
      2,
      'there are two input fields as default',
    );

    await pageCreateOptions.next();
    assert.strictEqual(
      currentRouteName(),
      'create.options',
      'validation errors prevents transition',
    );
    assert
      .dom('[data-test-form-step].is-active')
      .hasText(
        t('create.formStep.options.text').toString(),
        'status bar shows correct item as current path (options.text)',
      );
    assert.ok(
      pageCreateOptions.textOptions.objectAt(0).hasError,
      'validation error is shown after submit for first text option',
    );
    assert.ok(
      pageCreateOptions.textOptions.objectAt(1).hasError,
      'validation error is shown after submit for second text option',
    );

    await pageCreateOptions.textOptions.objectAt(0).title('option a');
    await pageCreateOptions.textOptions.objectAt(1).title('option c');
    await pageCreateOptions.textOptions.objectAt(0).add();
    assert.strictEqual(
      pageCreateOptions.textOptions.length,
      3,
      'option was added',
    );

    await pageCreateOptions.textOptions.objectAt(1).title('option b');
    await pageCreateOptions.textOptions.objectAt(2).add();
    assert.strictEqual(
      pageCreateOptions.textOptions.length,
      4,
      'option was added',
    );

    await pageCreateOptions.textOptions.objectAt(3).title('to be deleted');
    await pageCreateOptions.textOptions.objectAt(3).delete();
    assert.strictEqual(
      pageCreateOptions.textOptions.length,
      3,
      'option got deleted',
    );

    await pageCreateOptions.next();
    assert.strictEqual(currentRouteName(), 'create.settings');
    assert
      .dom('[data-test-form-step].is-active')
      .hasText(
        t('create.formStep.settings').toString(),
        'status bar shows correct item as current path (settings)',
      );
    assert.deepEqual(
      findAll('[data-test-form-step]').map((el) => el.disabled),
      [false, false, false, false],
      'status bar has correct items disabled (settings)',
    );

    await pageCreateSettings.save();
    assert.strictEqual(currentRouteName(), 'poll.participation');
    assert.true(pagePollParticipation.urlIsValid(), 'poll url is valid');
    assert.strictEqual(
      pagePollParticipation.title,
      'default poll',
      'poll title is correct',
    );
    assert.strictEqual(
      pagePollParticipation.description,
      '',
      'poll description is correct',
    );
    assert.deepEqual(
      findAll(
        `[data-test-form-element^="option"] label:not(.custom-control-label)`,
      ).map((el) => el.textContent.trim()),
      ['option a', 'option b', 'option c'],
      'options are labeled correctly',
    );
  });

  test('create a poll with times and description', async function (assert) {
    sinon.useFakeTimers({
      now: new Date('2025-03-01T11:22'),
      shouldAdvanceTime: true,
    });

    await pageCreateIndex.visit();
    await pageCreateIndex.next();
    assert.strictEqual(currentRouteName(), 'create.meta');

    await pageCreateMeta
      .title('default poll')
      .description('a sample description')
      .next();
    assert.strictEqual(currentRouteName(), 'create.options');

    await pageCreateOptions.selectDates([
      new Date('2025-03-11'),
      new Date('2025-03-23'),
    ]);
    await pageCreateOptions.next();
    assert.strictEqual(currentRouteName(), 'create.options-datetime');
    assert.deepEqual(
      findAll('[data-test-day] label').map((el) => el.textContent.trim()),
      ['Tuesday, March 11, 2025', 'Sunday, March 23, 2025'],
      'time inputs having days as label',
    );

    await pageCreateOptionsDatetime.times.objectAt(0).time('10:00');
    await pageCreateOptionsDatetime.times.objectAt(0).add();
    await pageCreateOptionsDatetime.times.objectAt(1).time('18:00');
    await pageCreateOptionsDatetime.times.objectAt(2).time('12:00');
    await pageCreateOptionsDatetime.next();
    assert.strictEqual(currentRouteName(), 'create.settings');

    await pageCreateSettings.save();
    assert.strictEqual(currentRouteName(), 'poll.participation');
    assert.true(pagePollParticipation.urlIsValid(), 'poll url is valid');
    assert.strictEqual(
      pagePollParticipation.title,
      'default poll',
      'poll title is correct',
    );
    assert.strictEqual(
      pagePollParticipation.description,
      'a sample description',
      'poll description is correct',
    );
    assert.deepEqual(
      findAll(
        `[data-test-form-element^="option"] label:not(.custom-control-label)`,
      ).map((el) => el.textContent.trim()),
      [
        'Tuesday, March 11, 2025 at 10:00 AM',
        '6:00 PM',
        'Sunday, March 23, 2025 at 12:00 PM',
      ],
      'options are correctly labeled',
    );
  });

  test('create a poll with only one day and multiple times', async function (assert) {
    const day = DateTime.now().plus({ days: 1 });

    await pageCreateIndex.visit();
    await pageCreateIndex.next();
    assert.strictEqual(currentRouteName(), 'create.meta');

    await pageCreateMeta
      .title('default poll')
      .description('a sample description')
      .next();
    assert.strictEqual(currentRouteName(), 'create.options');

    await pageCreateOptions.selectDates([day]);
    await pageCreateOptions.next();
    assert.strictEqual(currentRouteName(), 'create.options-datetime');
    assert.deepEqual(
      findAll('[data-test-day] label').map((el) => el.textContent.trim()),
      [Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(day)],
      'time inputs having days as label',
    );
    assert
      .dom(`[data-test-day="${day.toISODate()}"] input[type="time"]`)
      .exists({ count: 1 }, 'shows one input field per day as default');
    assert
      .dom(`[data-test-day="${day.toISODate()}"] input[type="time"]`)
      .hasValue('', 'time input field is empty until user enters a time');

    await pageCreateOptionsDatetime.times.objectAt(0).time('08:00');
    assert
      .dom(`[data-test-day="${day.toISODate()}"] input[type="time"]`)
      .hasValue('08:00', 'time input field shows the time entered by the user');

    await pageCreateOptionsDatetime.times.objectAt(0).delete();
    assert
      .dom(`[data-test-day="${day.toISODate()}"] input[type="time"]`)
      .hasValue(
        '',
        'deleting clears time input value if there is only one time',
      );

    await pageCreateOptionsDatetime.times.objectAt(0).time('10:00');
    await pageCreateOptionsDatetime.times.objectAt(0).add();
    assert
      .dom(`[data-test-day="${day.toISODate()}"] input[type="time"]`)
      .exists({ count: 2 }, 'user can add a second input field');
    assert
      .dom(
        findAll(`[data-test-day="${day.toISODate()}"] input[type="time"]`)[1],
      )
      .hasValue('', 'newly crated second input field is empty');
    assert
      .dom(
        findAll(`[data-test-day="${day.toISODate()}"] input[type="time"]`)[0],
      )
      .hasValue('10:00', 'value existing input field is not changed');

    await pageCreateOptionsDatetime.times.objectAt(1).time('14:00');
    await pageCreateOptionsDatetime.times.objectAt(1).add();
    assert
      .dom(`[data-test-day="${day.toISODate()}"] input[type="time"]`)
      .exists({ count: 3 }, 'user can add a third input field');

    await pageCreateOptionsDatetime.times.objectAt(2).time('18:00');
    await pageCreateOptionsDatetime.times.objectAt(1).delete();
    assert
      .dom(`[data-test-day="${day.toISODate()}"] input[type="time"]`)
      .exists({ count: 2 }, 'user can delete an input field');
    assert.deepEqual(
      findAll(`[data-test-day="${day.toISODate()}"] input[type="time"]`).map(
        (el) => el.value,
      ),
      ['10:00', '18:00'],
      'correct input field is deleted',
    );

    await pageCreateOptionsDatetime.next();
    assert.strictEqual(currentRouteName(), 'create.settings');

    await pageCreateSettings.save();
    assert.strictEqual(currentRouteName(), 'poll.participation');
    assert.true(pagePollParticipation.urlIsValid(), 'poll url is valid');
    assert.strictEqual(
      pagePollParticipation.title,
      'default poll',
      'poll title is correct',
    );
    assert.strictEqual(
      pagePollParticipation.description,
      'a sample description',
      'poll description is correct',
    );
    assert.deepEqual(
      findAll(
        `[data-test-form-element^="option"] label:not(.custom-control-label)`,
      ).map((el) => el.textContent.trim()),
      [
        Intl.DateTimeFormat('en-US', {
          dateStyle: 'full',
          timeStyle: 'short',
        }).format(day.set({ hours: 10, minutes: 0 })),
        Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(
          day.set({ hours: 18, minutes: 0 }),
        ),
      ],
      'options are correctly labeled',
    );
  });

  test('create a poll with only one day (without time)', async function (assert) {
    const day = DateTime.now().plus({ days: 1 });

    await pageCreateIndex.visit();
    await pageCreateIndex.next();
    assert.strictEqual(currentRouteName(), 'create.meta');

    await pageCreateMeta
      .title('default poll')
      .description('a sample description')
      .next();
    assert.strictEqual(currentRouteName(), 'create.options');

    await pageCreateOptions.selectDates([day]);
    await pageCreateOptions.next();
    assert.strictEqual(currentRouteName(), 'create.options-datetime');
    assert.deepEqual(
      findAll('[data-test-day] label').map((el) => el.textContent.trim()),
      [Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(day)],
      'time inputs having days as label',
    );

    await pageCreateOptionsDatetime.next();
    assert.strictEqual(currentRouteName(), 'create.settings');

    await pageCreateSettings.save();
    assert.strictEqual(currentRouteName(), 'poll.participation');
    assert.true(pagePollParticipation.urlIsValid(), 'poll url is valid');
    assert.strictEqual(
      pagePollParticipation.title,
      'default poll',
      'poll title is correct',
    );
    assert.strictEqual(
      pagePollParticipation.description,
      'a sample description',
      'poll description is correct',
    );
    assert.deepEqual(
      findAll(
        `[data-test-form-element^="option"] label:not(.custom-control-label)`,
      ).map((el) => el.textContent.trim()),
      [Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(day)],
      'options are correctly labeled',
    );
  });

  test('create a poll with only one day (with time)', async function (assert) {
    const day = DateTime.now().plus({ days: 1 });

    await pageCreateIndex.visit();
    await pageCreateIndex.next();
    assert.strictEqual(currentRouteName(), 'create.meta');

    await pageCreateMeta
      .title('default poll')
      .description('a sample description')
      .next();
    assert.strictEqual(currentRouteName(), 'create.options');

    await pageCreateOptions.selectDates([day]);
    await pageCreateOptions.next();
    assert.strictEqual(currentRouteName(), 'create.options-datetime');
    assert.deepEqual(
      findAll('[data-test-day] label').map((el) => el.textContent.trim()),
      [Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(day)],
      'time inputs having days as label',
    );

    await pageCreateOptionsDatetime.times.objectAt(0).time('22:30');
    await pageCreateOptionsDatetime.next();
    assert.strictEqual(currentRouteName(), 'create.settings');

    await pageCreateSettings.save();
    assert.strictEqual(currentRouteName(), 'poll.participation');
    assert.true(pagePollParticipation.urlIsValid(), 'poll url is valid');
    assert.strictEqual(
      pagePollParticipation.title,
      'default poll',
      'poll title is correct',
    );
    assert.strictEqual(
      pagePollParticipation.description,
      'a sample description',
      'poll description is correct',
    );
    assert.deepEqual(
      findAll(
        `[data-test-form-element^="option"] label:not(.custom-control-label)`,
      ).map((el) => el.textContent.trim()),
      [
        Intl.DateTimeFormat('en-US', {
          dateStyle: 'full',
          timeStyle: 'short',
        }).format(day.set({ hours: 22, minutes: 30 })),
      ],
      'options are correctly labeled',
    );
  });

  test('create a poll with times by adopting times of first day', async function (assert) {
    sinon.useFakeTimers({
      now: new Date('2025-04-01T05:30'),
      shouldAdvanceTime: true,
    });

    await visit('/create');
    await click('button[type="submit"]');
    assert.strictEqual(currentRouteName(), 'create.meta');

    await fillIn(
      '[data-test-form-element="title"] input[type="text"]',
      'example poll for to test time adopting workflow',
    );
    await click('button[type="submit"]');
    assert.strictEqual(currentRouteName(), 'create.options');

    await pageCreateOptions.selectDates([
      new Date('2025-04-15'),
      new Date('2025-04-27'),
    ]);
    await click('button[type="submit"]');
    assert.strictEqual(currentRouteName(), 'create.options-datetime');

    for (let i = 1; i <= 3; i++) {
      await click(
        `[data-test-day="2025-04-15"] button[data-test-action="add"]`,
      );
    }
    assert
      .dom(`[data-test-day="2025-04-15"] button[data-test-action="add"]`)
      .exists({ count: 4 }, 'assumption: user created 4 time inputs');

    for (const [index, inputEl] of findAll(
      `[data-test-day="2025-04-15"] input[type="time"]`,
    ).entries()) {
      await fillIn(inputEl, `${(index * 6).toString().padStart(2, '0')}:00`);
    }
    assert.deepEqual(
      findAll(`[data-test-day="2025-04-15"] input[type="time"]`).map(
        (el) => el.value,
      ),
      ['00:00', '06:00', '12:00', '18:00'],
      'assumption: all 4 time inputs for first day are filled',
    );
    assert
      .dom(`[data-test-day="2025-04-27"] input[type="time"]`)
      .exists({ count: 1 }, 'only one time input exists for second day')
      .hasValue('', 'time input for second day is empty');

    await click('button[data-test-action="adopt-times-of-first-day"]');
    assert.deepEqual(
      findAll(`[data-test-day="2025-04-27"] input[type="time"]`).map(
        (el) => el.value,
      ),
      ['00:00', '06:00', '12:00', '18:00'],
      'all 4 times from first day have been added to second day',
    );

    await click(
      findAll(
        `[data-test-day="2025-04-15"] button[data-test-action="delete"]`,
      )[2],
    );
    assert.deepEqual(
      findAll(`[data-test-day="2025-04-15"] input[type="time"]`).map(
        (el) => el.value,
      ),
      ['00:00', '06:00', '18:00'],
      'assumption: one time has been deleted from first day',
    );

    await click('button[data-test-action="adopt-times-of-first-day"]');
    assert.deepEqual(
      findAll(`[data-test-day="2025-04-27"] input[type="time"]`).map(
        (el) => el.value,
      ),
      ['00:00', '06:00', '18:00'],
      'second day has been updated with changed times from first day',
    );

    await fillIn(
      findAll(`[data-test-day="2025-04-15"] input[type="time"]`)[0],
      '03:00',
    );
    await click(
      findAll(`[data-test-day="2025-04-15"] button[data-test-action="add"]`)[2],
    );
    await fillIn(
      findAll(`[data-test-day="2025-04-15"] input[type="time"]`)[3],
      '22:00',
    );
    assert.deepEqual(
      findAll(`[data-test-day="2025-04-15"] input[type="time"]`).map(
        (el) => el.value,
      ),
      ['03:00', '06:00', '18:00', '22:00'],
      'assumption: a fourth time has been added to the first day again',
    );

    await click('button[data-test-action="adopt-times-of-first-day"]');
    assert.deepEqual(
      findAll(`[data-test-day="2025-04-27"] input[type="time"]`).map(
        (el) => el.value,
      ),
      ['03:00', '06:00', '18:00', '22:00'],
      'second day has been updated with times from first day as expected',
    );

    await click('button[type="submit"]');
    assert.strictEqual(currentRouteName(), 'create.settings');

    await click('button[type="submit"]');
    assert.strictEqual(currentRouteName(), 'poll.participation');
    assert.deepEqual(
      findAll(
        `[data-test-form-element^="option"] label:not(.custom-control-label)`,
      ).map((el) => el.textContent.trim()),
      [
        'Tuesday, April 15, 2025 at 3:00 AM',
        '6:00 AM',
        '6:00 PM',
        '10:00 PM',
        'Sunday, April 27, 2025 at 3:00 AM',
        '6:00 AM',
        '6:00 PM',
        '10:00 PM',
      ],
      'options are correctly labeled',
    );
  });

  test('create a poll for answering a question with only one option', async function (assert) {
    await pageCreateIndex.visit();

    await pageCreateIndex.pollType('MakeAPoll').next();
    assert.strictEqual(currentRouteName(), 'create.meta');

    await pageCreateMeta.title('default poll').next();
    assert.strictEqual(currentRouteName(), 'create.options');
    assert.strictEqual(
      pageCreateOptions.textOptions.length,
      2,
      'there are two input fields as default',
    );

    await pageCreateOptions.textOptions.objectAt(0).title('option a');
    await pageCreateOptions.textOptions.objectAt(1).delete();
    assert.strictEqual(
      pageCreateOptions.textOptions.length,
      1,
      'option was deleted',
    );

    await pageCreateOptions.next();
    assert.strictEqual(currentRouteName(), 'create.settings');

    await pageCreateSettings.save();
    assert.strictEqual(currentRouteName(), 'poll.participation');
    assert.true(pagePollParticipation.urlIsValid(), 'poll url is valid');
    assert.strictEqual(
      pagePollParticipation.title,
      'default poll',
      'poll title is correct',
    );
    assert.strictEqual(
      pagePollParticipation.description,
      '',
      'poll description is correct',
    );
    assert.deepEqual(
      findAll(
        `[data-test-form-element^="option"] label:not(.custom-control-label)`,
      ).map((el) => el.textContent.trim()),
      ['option a'],
      'options are labeled correctly',
    );
  });

  test('create a poll with non-default expiration date', async function (assert) {
    sinon.useFakeTimers({
      now: new Date('2025-03-01'),
      shouldAdvanceTime: true,
    });

    await visit('/create');
    assert.strictEqual(currentRouteName(), 'create.index');

    await click('button[type="submit"]');
    assert.strictEqual(currentRouteName(), 'create.meta');

    await fillIn('input[type="text"]', 'poll expiring next week');
    await click('button[type="submit"]');
    assert.strictEqual(currentRouteName(), 'create.options');

    await pageCreateOptions.selectDates([
      new Date('2025-03-02'),
      new Date('2025-03-07'),
    ]);
    await click('button[type="submit"]');
    assert.strictEqual(currentRouteName(), 'create.options-datetime');

    await click('button[type="submit"]');
    assert.strictEqual(currentRouteName(), 'create.settings');
    assert
      .dom('.expiration-duration select')
      .hasValue('P3M', 'poll expires in 3 months by default');

    await fillIn('.expiration-duration select', 'P7D');
    assert
      .dom('.expiration-duration select')
      .hasValue(
        'P7D',
        'expiration date reflects updated value after user input',
      );

    await click('button[type="submit"]');
    assert.strictEqual(currentRouteName(), 'poll.participation');
    assert
      .dom('.expirationDate')
      .containsText(
        'March 8, 2025',
        'poll information reflect expiration date selected by user',
      );
  });

  test('create a poll and use back button (find a date)', async function (assert) {
    let days = [DateTime.fromISO('2016-01-02'), DateTime.fromISO('2016-01-13')];

    setupBrowserNavigationButtons();

    await pageCreateIndex.visit();
    await pageCreateIndex.next();
    assert.strictEqual(currentRouteName(), 'create.meta');

    await pageCreateMeta
      .title('default poll')
      .description('a sample description')
      .next();
    assert.strictEqual(currentRouteName(), 'create.options');

    await pageCreateOptions.selectDates(days);
    await pageCreateOptions.next();
    assert.strictEqual(currentRouteName(), 'create.options-datetime');
    assert.deepEqual(
      findAll('[data-test-day] label').map((el) => el.textContent.trim()),
      days.map((day) =>
        Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(day),
      ),
      'time inputs having days as label',
    );

    await fillIn('[data-test-day="2016-01-13"] input[type="time"]', '10:00');
    assert
      .dom('[data-test-day="2016-01-13"] input[type="time"]')
      .hasValue('10:00', 'time input has the value entered by the user');

    await backButton();
    assert.strictEqual(currentRouteName(), 'create.options');
    assert.deepEqual(
      findAll('.ember-power-calendar-day--selected').map(
        (el) => el.dataset.date,
      ),
      days.map((day) => day.toISODate()),
      'days are still present after back button is used',
    );

    await pageCreateOptions.next();
    assert.strictEqual(currentRouteName(), 'create.options-datetime');
    assert
      .dom('[data-test-day="2016-01-02"] input[type="time"]')
      .hasValue('', 'time input the user has not touched is still empty');
    assert
      .dom('[data-test-day="2016-01-13"] input[type="time"]')
      .hasValue(
        '10:00',
        'time input is prefilled with the time user entered before using back button',
      );

    await pageCreateOptionsDatetime.next();
    assert.strictEqual(currentRouteName(), 'create.settings');

    await pageCreateSettings.save();
    assert.strictEqual(currentRouteName(), 'poll.participation');
    assert.true(pagePollParticipation.urlIsValid(), 'poll url is valid');
    assert.strictEqual(
      pagePollParticipation.title,
      'default poll',
      'poll title is correct',
    );
    assert.strictEqual(
      pagePollParticipation.description,
      'a sample description',
      'poll description is correct',
    );
    assert.deepEqual(
      findAll(
        `[data-test-form-element^="option"] label:not(.custom-control-label)`,
      ).map((el) => el.textContent.trim()),
      [
        Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(days[0]),
        Intl.DateTimeFormat('en-US', {
          dateStyle: 'full',
          timeStyle: 'short',
        }).format(days[1].set({ hours: 10, minutes: 0 })),
      ],
      'options are correctly labeled',
    );
  });

  test('Start at first step is enforced', async function (assert) {
    await pageCreateSettings.visit();
    assert.strictEqual(currentRouteName(), 'create.index');
  });

  test('back button', async function (assert) {
    await pageCreateIndex.visit();
    assert.strictEqual(currentRouteName(), 'create.index');

    await pageCreateIndex.next();
    assert.strictEqual(currentRouteName(), 'create.meta');

    await pageCreateMeta.title('foo').next();
    assert.strictEqual(currentRouteName(), 'create.options');

    await pageCreateOptions.selectDates([new Date()]);
    await pageCreateOptions.next();
    assert.strictEqual(currentRouteName(), 'create.options-datetime');

    await pageCreateOptionsDatetime.next();
    assert.strictEqual(currentRouteName(), 'create.settings');

    await pageCreateSettings.back();
    assert.strictEqual(currentRouteName(), 'create.options-datetime');

    await pageCreateOptionsDatetime.back();
    assert.strictEqual(currentRouteName(), 'create.options');

    await pageCreateOptions.back();
    assert.strictEqual(currentRouteName(), 'create.meta');

    await pageCreateMeta.back();
    assert.strictEqual(currentRouteName(), 'create.index');

    await pageCreateIndex.pollType('MakeAPoll').next();
    assert.strictEqual(currentRouteName(), 'create.meta');

    await pageCreateMeta.next();
    assert.strictEqual(currentRouteName(), 'create.options');

    await pageCreateOptions.textOptions.objectAt(0).title('foo');
    await pageCreateOptions.textOptions.objectAt(1).title('bar');
    await pageCreateOptions.next();
    assert.strictEqual(currentRouteName(), 'create.settings');

    await pageCreateSettings.back();
    assert.strictEqual(currentRouteName(), 'create.options');

    await pageCreateOptions.back();
    assert.strictEqual(currentRouteName(), 'create.meta');

    await pageCreateMeta.back();
    assert.strictEqual(currentRouteName(), 'create.index');
  });

  test('informs user if saving fails', async function (assert) {
    const reportErrorFake = sinon.replace(window, 'reportError', sinon.fake());

    await pageCreateIndex.visit();
    assert.strictEqual(
      currentRouteName(),
      'create.index',
      'assumption: can open start page of poll creation',
    );

    await pageCreateIndex.next();
    assert.strictEqual(
      currentRouteName(),
      'create.meta',
      'assumption: can go to title and description input step',
    );

    await pageCreateMeta.title('foo').next();
    assert.strictEqual(
      currentRouteName(),
      'create.options',
      'assumption: can go to options input step',
    );

    await pageCreateOptions.selectDates([new Date()]);
    await pageCreateOptions.next();
    assert.strictEqual(
      currentRouteName(),
      'create.options-datetime',
      'assumption: can go to times input for dates after selecting one day',
    );

    await pageCreateOptionsDatetime.next();
    assert.strictEqual(
      currentRouteName(),
      'create.settings',
      'assumption: can go to settings page',
    );

    // simulate temporary server error
    this.server.logging = true;
    this.server.post('/polls', undefined, 503);

    await click('form button[type="submit"]');
    assert.strictEqual(
      currentRouteName(),
      'create.settings',
      'user stays at settings route if saving fails',
    );
    assert
      .dom('[data-test-modal="saving-failed"]')
      .isVisible(
        'modal is shown informing the user that saving the poll failed',
      );
    assert
      .dom('[data-test-modal="saving-failed"] .modal-header')
      .hasText(
        t('error.poll.savingFailed.title'),
        'modal has a meaningful title',
      );
    assert
      .dom('[data-test-modal="saving-failed"] .modal-body')
      .hasText(
        t('error.poll.savingFailed.description'),
        'modal has a meaningful body',
      );
    assert
      .dom('[data-test-modal="saving-failed"] .modal-footer button')
      .exists({ count: 2 }, 'modal has two buttons');
    assert
      .dom(
        '[data-test-modal="saving-failed"] .modal-footer button[data-test-button="abort"]',
      )
      .hasText(t('action.abort'), 'abort button has meaningful text');
    assert
      .dom(
        '[data-test-modal="saving-failed"] .modal-footer button[data-test-button="retry"]',
      )
      .hasText(
        t('modal.save-retry.button-retry'),
        'retry button has meaningful text',
      );
    assert.ok(reportErrorFake.calledOnce, 'error is reported to console');
    assert.ok(
      reportErrorFake.firstCall.args[0] instanceof Error,
      'reported error is an instance of Error',
    );
    assert.strictEqual(
      reportErrorFake.firstCall.args[0].message,
      'Unexpected server-side error. Server responded with 503 (Service Unavailable)',
      'reported error has meaningful error message',
    );

    await click(
      '[data-test-modal="saving-failed"] button[data-test-button="retry"]',
    );
    assert.strictEqual(
      currentRouteName(),
      'create.settings',
      'user stays at settings route if saving failed even on retry',
    );
    assert
      .dom('[data-test-modal="saving-failed"]')
      .isVisible('modal is still shown if retry fails');
    assert.ok(
      reportErrorFake.calledTwice,
      'error is reported to console on failed retry',
    );

    await click(
      '[data-test-modal="saving-failed"] button[data-test-button="abort"]',
    );
    assert
      .dom('[data-test-modal="saving-failed"]')
      .isNotVisible('user can close the modal that saving failed');
    assert.strictEqual(
      currentRouteName(),
      'create.settings',
      'user stays at settings route if closing the modal',
    );

    await click('form button[type="submit"]');
    assert
      .dom('[data-test-modal="saving-failed"]')
      .isVisible('modal is visible again if saving fails again');
    assert.ok(
      reportErrorFake.calledThrice,
      'error is reported to console on failed retry',
    );

    // simulate server is available again
    // defer creation for testing loading spinner
    let resolveSubmission;
    this.server.post('/polls', function (schema) {
      return new Promise((resolve) => {
        resolveSubmission = () => {
          const attrs = this.normalizedRequestAttrs();
          const poll = schema.polls.create(attrs);
          resolve(poll);
        };
      });
    });

    click('[data-test-modal="saving-failed"] button[data-test-button="retry"]');

    // shows loading spinner while saving
    await waitFor(
      '[data-test-modal="saving-failed"] button[data-test-button="retry"] .spinner-border',
      {
        timeoutMessage: 'timeout while waiting for loading spinner to appear',
      },
    );
    assert.ok(true, 'loading spinner is shown');

    resolveSubmission();
    await settled();

    assert.strictEqual(
      currentRouteName(),
      'poll.participation',
      'user is transitioned to poll participation page after successful retry',
    );
  });

  module('validation', function () {
    test('validates user input when creating a poll with dates and times', async function (assert) {
      const day = DateTime.now();

      await visit('/create');
      await click('button[type="submit"]');
      assert.strictEqual(
        currentURL(),
        '/create/meta',
        'assumption: user can go to next step after selecting poll type',
      );

      await click('button[type="submit"]');
      assert.strictEqual(
        currentURL(),
        '/create/meta',
        'validation error prevents the user from going to option input before entering a title',
      );
      assert
        .dom('[data-test-form-element="title"] input')
        .hasClass(
          'is-invalid',
          'input field for poll type is shown as invalid',
        );
      assert
        .dom('[data-test-form-element="title"] .invalid-feedback')
        .hasText(
          t('create.meta.input.title.validations.valueMissing'),
          'shows a validation error for missing value',
        );
      assert
        .dom('[data-test-form-element="description"] textarea')
        .hasClass(
          'is-valid',
          'textarea for entering description is shown as valid even if user has not entered a value',
        );

      await fillIn('[data-test-form-element="title"] input', 'A');
      assert
        .dom('[data-test-form-element="title"] input')
        .hasClass(
          'is-invalid',
          'input field for poll type is still shown as invalid after user entered a too short title',
        );
      assert
        .dom('[data-test-form-element="title"] .invalid-feedback')
        .hasText(
          t('create.meta.input.title.validations.tooShort'),
          'validation error message is updated to reflect too short value',
        );

      await fillIn(
        '[data-test-form-element="title"] input',
        'When to have our next hackathon?',
      );
      assert
        .dom('[data-test-form-element="title"] input')
        .hasClass(
          'is-valid',
          'input field for poll type is shown as valid after user entered a title',
        );

      await click('button[type="submit"]');
      assert.strictEqual(
        currentURL(),
        '/create/options',
        'assumption: user can go to next step after filling in poll title',
      );

      await click('button[type="submit"]');
      assert.strictEqual(
        currentURL(),
        '/create/options',
        'user can not skip options step without selecting at least one day',
      );
      assert
        .dom('[data-test-form-element-for="days"] .form-control')
        .hasClass(
          'is-invalid',
          'shows calendar for date selection as invalid if user has selected no day',
        );
      assert
        .dom('[data-test-form-element-for="days"] .invalid-feedback')
        .hasText(
          t('create.options.error.notEnoughDates'),
          'shows validation error that at least one day needs to be selected',
        );

      await calendarSelect(
        '[data-test-form-element-for="days"]',
        day.toJSDate(),
      );
      assert
        .dom('[data-test-form-element-for="days"] .form-control')
        .hasClass(
          'is-valid',
          'shows calendar for date selection as valid after user selected a date',
        );

      await click('button[type="submit"]');
      assert.strictEqual(
        currentURL(),
        '/create/options-datetime',
        'user can process to next step after selecting at least one day',
      );

      await click('button[type="submit"]');
      assert.strictEqual(
        currentURL(),
        '/create/settings',
        'user can skip time input for dates without entering any time',
      );

      await click('button[data-test-action="back"]');
      assert.strictEqual(
        currentURL(),
        '/create/options-datetime',
        'assumption: user can go back to time input step',
      );

      await click(
        `[data-test-day="${day.toISODate()}"] button[data-test-action="add"]`,
      );
      assert
        .dom(`[data-test-day="${day.toISODate()}"] input[type="time"]`)
        .exists(
          { count: 2 },
          'assumption: user can add another time for the day',
        );

      for (const el of findAll(
        `[data-test-day="${day.toISODate()}"] input[type="time"]`,
      )) {
        await fillIn(el, '10:00');
      }
      await click('button[type="submit"]');
      assert.strictEqual(
        currentURL(),
        '/create/options-datetime',
        'user can not go to next step when entering duplicated times for the same day',
      );
      assert
        .dom(
          findAll(`[data-test-day="${day.toISODate()}"] input[type="time"]`)[0],
        )
        .hasClass('is-valid', 'first input is shown as valid');
      assert
        .dom(
          findAll(`[data-test-day="${day.toISODate()}"] input[type="time"]`)[1],
        )
        .hasClass(
          'is-invalid',
          'second input with same time is shown as invalid',
        );
      assert
        .dom(`[data-test-day="${day.toISODate()}"] .invalid-feedback`)
        .exists(
          { count: 1 },
          'assumption: only one input has invalid feedback',
        );
      assert
        .dom(`[data-test-day="${day.toISODate()}"] .invalid-feedback`)
        .hasText(
          t('create.options-datetime.error.duplicatedDate'),
          'validation error message tells that times must be unique',
        );

      await fillIn(
        findAll(`[data-test-day="${day.toISODate()}"] input[type="time"]`)[1],
        '12:00',
      );
      assert
        .dom(
          findAll(`[data-test-day="${day.toISODate()}"] input[type="time"]`)[0],
        )
        .hasClass(
          'is-valid',
          'first input is still shown as valid when user changes value of another input',
        );
      assert
        .dom(
          findAll(`[data-test-day="${day.toISODate()}"] input[type="time"]`)[1],
        )
        .hasClass(
          'is-valid',
          'second input is shown as valid after user filled in another time',
        );

      await click('button[type="submit"]');
      assert.strictEqual(
        currentURL(),
        '/create/settings',
        'user can skip time input for dates without entering any time',
      );

      await click('button[type="submit"]');
      assert.strictEqual(
        currentRouteName(),
        'poll.participation',
        'user can finish the poll creation without changing any value on settings step',
      );
    });

    test('validates user input when creating a poll for answering a question', async function (assert) {
      await visit('/create');
      await fillIn('[data-test-form-element="poll-type"] select', 'MakeAPoll');
      await click('button[type="submit"]');
      assert.strictEqual(
        currentURL(),
        '/create/meta',
        'assumption: user can go to next step after selecting poll type',
      );

      await click('button[type="submit"]');
      assert.strictEqual(
        currentURL(),
        '/create/meta',
        'validation error prevents the user from going to option input before entering a title',
      );
      assert
        .dom('[data-test-form-element="title"] input')
        .hasClass(
          'is-invalid',
          'input field for poll type is shown as invalid',
        );
      assert
        .dom('[data-test-form-element="title"] .invalid-feedback')
        .hasText(
          t('create.meta.input.title.validations.valueMissing'),
          'shows a validation error for missing value',
        );
      assert
        .dom('[data-test-form-element="description"] textarea')
        .hasClass(
          'is-valid',
          'textarea for entering description is shown as valid even if user has not entered a value',
        );

      await fillIn('[data-test-form-element="title"] input', 'A');
      assert
        .dom('[data-test-form-element="title"] input')
        .hasClass(
          'is-invalid',
          'input field for poll type is still shown as invalid after user entered a too short title',
        );
      assert
        .dom('[data-test-form-element="title"] .invalid-feedback')
        .hasText(
          t('create.meta.input.title.validations.tooShort'),
          'validation error message is updated to reflect too short value',
        );

      await fillIn(
        '[data-test-form-element="title"] input',
        'What dessert should we have?',
      );
      assert
        .dom('[data-test-form-element="title"] input')
        .hasClass(
          'is-valid',
          'input field for poll type is shown as valid after user entered a title',
        );

      await click('button[type="submit"]');
      assert.strictEqual(
        currentURL(),
        '/create/options',
        'assumption: user can go to next step after filling in poll title',
      );

      await click('button[type="submit"]');
      assert.strictEqual(
        currentURL(),
        '/create/options',
        'user can not skip options step without filling out at least one option',
      );
      assert
        .dom('[data-test-form-element="option"] input[type="text"]')
        .exists(
          { count: 2 },
          'assumption: two input fields for options exists',
        );
      assert
        .dom('[data-test-form-element="option"][data-test-option="0"] input')
        .hasClass('is-invalid', 'input field for first option is invalid');
      assert
        .dom('[data-test-form-element="option"][data-test-option="1"] input')
        .hasClass('is-invalid', 'input field for second option is invalid');
      assert
        .dom(
          '[data-test-form-element="option"][data-test-option="0"] .invalid-feedback',
        )
        .hasText(
          t('create.options.error.valueMissing'),
          'shown value missing validation error for first input',
        );
      assert
        .dom(
          '[data-test-form-element="option"][data-test-option="1"] .invalid-feedback',
        )
        .hasText(
          t('create.options.error.valueMissing'),
          'shown value missing validation error for first input',
        );

      await fillIn(
        '[data-test-form-element="option"][data-test-option="0"] input',
        'Cheesecake',
      );
      assert
        .dom('[data-test-form-element="option"][data-test-option="0"] input')
        .hasClass(
          'is-valid',
          'input field for first option is valid after user entered a label',
        );
      assert
        .dom('[data-test-form-element="option"][data-test-option="1"] input')
        .hasClass(
          'is-invalid',
          'input field for second option is still invalid',
        );

      await fillIn(
        '[data-test-form-element="option"][data-test-option="1"] input',
        'Cheesecake',
      );
      assert
        .dom('[data-test-form-element="option"][data-test-option="0"] input')
        .hasClass(
          'is-valid',
          'input field for first option is valid after user entered a value',
        );
      assert
        .dom('[data-test-form-element="option"][data-test-option="1"] input')
        .hasClass(
          'is-invalid',
          'input field for second option is still invalid if entering duplicated error',
        );
      assert
        .dom(
          '[data-test-form-element="option"][data-test-option="1"] .invalid-feedback',
        )
        .hasText(
          t('create.options.error.duplicatedOption'),
          'validation error message is updated to duplicated label',
        );

      await fillIn(
        '[data-test-form-element="option"][data-test-option="1"] input',
        'Muffin',
      );
      assert
        .dom('[data-test-form-element="option"][data-test-option="0"] input')
        .hasClass(
          'is-valid',
          'input field for first option is valid after user entered a value',
        );
      assert
        .dom('[data-test-form-element="option"][data-test-option="1"] input')
        .hasClass(
          'is-valid',
          'input field for second option is valid after filling in a unique value',
        );

      await click('button[type="submit"]');
      assert.strictEqual(
        currentURL(),
        '/create/settings',
        'user can move to next step after entering valid values for the options',
      );

      await click('button[type="submit"]');
      assert.strictEqual(
        currentRouteName(),
        'poll.participation',
        'user can finish the poll creation without changing any value on settings step',
      );
    });
  });
});
