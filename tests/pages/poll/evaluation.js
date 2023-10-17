import { attribute, collection, create, text } from 'ember-cli-page-object';
import { definition as Poll } from 'croodle/tests/pages/poll';
import { defaultsForApplication } from 'croodle/tests/pages/defaults';
import { assign } from '@ember/polyfills';

export default create(
  assign({}, defaultsForApplication, Poll, {
    options: collection(
      '[data-test-table-of="participants"] thead tr:last-child th:not(:first-child)',
      {
        label: text(''),
      },
    ),
    participants: collection(
      '[data-test-table-of="participants"] [data-test-participant]',
      {
        name: text('[data-test-value-for="name"]'),
        selections: collection('[data-test-is-selection-cell]', {
          answer: text(''),
          option: attribute('data-test-value-for', ''),
        }),
      },
    ),
  }),
);
