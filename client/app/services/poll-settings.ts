import { tracked } from '@glimmer/tracking';
import Service from '@ember/service';
import type Poll from 'croodle/models/poll';

class PollSettings {
  #poll: Poll;

  // time zone the user has chosen for displaying the poll in
  @tracked
  shouldUseLocalTimeZone: boolean | null = null;

  get mustChooseTimeZone(): boolean {
    return (
      this.#usersTimeZoneAndPollsTimeZoneDiffers &&
      this.shouldUseLocalTimeZone === null
    );
  }

  // time zone the poll should be shown in
  // undefined if user's time zone should be used
  get timeZone(): string | undefined {
    const { shouldUseLocalTimeZone } = this;
    const poll = this.#poll;

    if (shouldUseLocalTimeZone || !poll.timezone) {
      return undefined;
    }

    return poll.timezone;
  }

  get #usersTimeZoneAndPollsTimeZoneDiffers(): boolean {
    const { timezone: pollTimeZone } = this.#poll;

    return (
      !!pollTimeZone &&
      Intl.DateTimeFormat().resolvedOptions().timeZone !== pollTimeZone
    );
  }

  constructor(poll: Poll) {
    this.#poll = poll;
  }
}

export default class PollSettingsService extends Service {
  #settings = new WeakMap<Poll, PollSettings>();

  getSettings(poll: Poll): PollSettings {
    let settings = this.#settings.get(poll);

    // initialize settings if needed
    if (!settings) {
      settings = new PollSettings(poll);

      this.#settings.set(poll, settings);
    }

    return settings;
  }
}

// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:poll-settings')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('poll-settings') declare altName: PollSettingsService;`.
declare module '@ember/service' {
  interface Registry {
    'poll-settings': PollSettingsService;
  }
}
