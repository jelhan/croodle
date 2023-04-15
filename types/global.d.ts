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
