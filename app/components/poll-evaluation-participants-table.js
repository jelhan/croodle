import classic from 'ember-classic-decorator';
import { readOnly } from '@ember/object/computed';
import Component from '@ember/component';
import { raw } from 'ember-awesome-macros';
import { groupBy, sort } from 'ember-awesome-macros/array';

@classic
export default class PollEvaluationParticipantsTable extends Component {
  @readOnly('poll.hasTimes')
  hasTimes;

  @readOnly('poll.isFindADate')
  isFindADate;

  @readOnly('poll.isFreeText')
  isFreeText;

  @readOnly('poll.options')
  options;

  @groupBy('options', raw('day'))
  optionsGroupedByDays;

  @readOnly('poll.users')
  users;

  @sort('users', ['creationDate'])
  usersSorted;
}
