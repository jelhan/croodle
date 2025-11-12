import { module, test } from 'qunit';
import { setupTest } from '@croodle/client/tests/helpers';
import Poll from '@croodle/client/models/poll';

function generateMockPoll(overwrites?: Partial<Poll>): Poll {
  return new Poll({
    anonymousUser: false,
    answerType: 'YesNo',
    creationDate: '2024-12-31T00:00:00Z',
    description: 'dummy data',
    expirationDate: '2025-05-01T00:00:00Z',
    forceAnswer: true,
    id: 'abc',
    options: [{ title: 'foo' }],
    pollType: 'FindADate',
    timezone: null,
    title: 'Dummy',
    users: [],
    version: '1',
    ...overwrites,
  });
}

module('Unit | Service | poll-settings', function (hooks) {
  setupTest(hooks);

  module('PollsettingsService', function () {
    module('getSettings', function () {
      test('returns same settings for the same poll', function (assert) {
        const service = this.owner.lookup('service:poll-settings');
        const poll = generateMockPoll();

        assert.strictEqual(
          service.getSettings(poll),
          service.getSettings(poll),
        );
      });

      test('returns different settings for different poll', function (assert) {
        const service = this.owner.lookup('service:poll-settings');
        const pollA = generateMockPoll();
        const pollB = generateMockPoll();

        assert.notStrictEqual(
          service.getSettings(pollA),
          service.getSettings(pollB),
        );
      });
    });
  });

  module('PollSettings', function () {
    module('mustChooseTimeZone', function () {
      test('false if poll time zone is not set', function (assert) {
        const service = this.owner.lookup('service:poll-settings');
        const poll = generateMockPoll();
        const settings = service.getSettings(poll);

        assert.false(settings.mustChooseTimeZone);
      });

      test("false if poll's time zone equals user's time zone", function (assert) {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const service = this.owner.lookup('service:poll-settings');
        const poll = generateMockPoll({ timezone });
        const settings = service.getSettings(poll);

        assert.false(settings.mustChooseTimeZone);
      });

      test("true if poll's time zone differs user's time zone", function (assert) {
        const timezone =
          Intl.DateTimeFormat().resolvedOptions().timeZone === 'America/Caracas'
            ? 'Europe/Berlin'
            : 'America/Caracas';

        const service = this.owner.lookup('service:poll-settings');
        const poll = generateMockPoll({ timezone });
        const settings = service.getSettings(poll);

        assert.true(settings.mustChooseTimeZone);
      });
    });

    module('shouldUseLocalTimeZone', function () {
      test('defaults to null', function (assert) {
        const service = this.owner.lookup('service:poll-settings');
        const poll = generateMockPoll();
        const settings = service.getSettings(poll);

        assert.strictEqual(settings.shouldUseLocalTimeZone, null);
      });
    });

    module('timeZone', function () {
      test('is undefined if local time zone should be used', function (assert) {
        const service = this.owner.lookup('service:poll-settings');
        const poll = generateMockPoll();
        const settings = service.getSettings(poll);
        settings.shouldUseLocalTimeZone = true;

        assert.strictEqual(settings.timeZone, undefined);
      });

      test("is undefined if poll's time zone is null", function (assert) {
        const service = this.owner.lookup('service:poll-settings');
        const poll = generateMockPoll({ timezone: null });
        const settings = service.getSettings(poll);

        assert.strictEqual(settings.timeZone, undefined);

        settings.shouldUseLocalTimeZone = false;
        assert.strictEqual(settings.timeZone, undefined);
      });

      test("is poll's time zone if shouldn't use local time zone", function (assert) {
        const service = this.owner.lookup('service:poll-settings');
        const poll = generateMockPoll({ timezone: 'Europe/Berlin' });
        const settings = service.getSettings(poll);
        settings.shouldUseLocalTimeZone = false;

        assert.strictEqual(settings.timeZone, 'Europe/Berlin');
      });
    });
  });
});
