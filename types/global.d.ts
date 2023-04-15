// To minimize spurious errors when typechecking with vanilla tsc or your
// editor's TypeScript integration, you should add import
// '@glint/environment-ember-loose'; somewhere in your project's source or
// type declarations.
// https://typed-ember.gitbook.io/glint/using-glint/ember/installation
import '@glint/environment-ember-loose';

import { HelperLike } from '@glint/template';
import { TemplateFactory } from 'ember-cli-htmlbars';
import CreatePollComponent from 'croodle/components/create-poll';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CreatePoll: typeof CreatePollComponent;
    'page-title': HelperLike<{
      Args: { Positional: [title: string] };
      Return: void;
    }>;
  }
}

// Types for compiled templates
declare module 'croodle/templates/*' {
  const tmpl: TemplateFactory;
  export default tmpl;
}
