import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { raw } from 'ember-awesome-macros';
import { groupBy, sort } from 'ember-awesome-macros/array';

export default Component.extend({
  hasTimes: readOnly('poll.hasTimes'),

  isFindADate: readOnly('poll.isFindADate'),
  isFreeText: readOnly('poll.isFreeText'),

  options: readOnly('poll.options'),
  optionsGroupedByDays: groupBy('options', raw('day')),

  users: readOnly('poll.users'),
  usersSorted: sort('users', ['creationDate']),
});
