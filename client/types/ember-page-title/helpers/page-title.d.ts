import { HelperLike } from '@glint/template';

// Glint support in ember-page-title itself is tracked here:
// https://github.com/ember-cli/ember-page-title/issues/239

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'page-title': HelperLike<{
      Args: {
        Positional: [string];
      };
      Return: void;
    }>;
  }
}
