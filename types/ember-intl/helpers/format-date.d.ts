import { HelperLike } from '@glint/template';

// Ember Intl ships glint types. But as of today (October 29, 2023)
// they are buggy and cannot be used.
// Types provided by Ember Intl should be used instead as soon as
// type issues have been fixed in the addon itself.

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'format-date': HelperLike<{
      Args: {
        Positional: [Date | string];
        Named: Record<string, unknown>;
      };
      Return: string;
    }>;
  }
}
