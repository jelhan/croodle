import { HelperLike } from '@glint/template';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    pick: HelperLike<{
      Args: {
        Positional: [path: string, action?: (_: unknown) => unknown];
      };
      Return: (_: unknown) => unknown;
    }>;
  }
}
