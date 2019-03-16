import Component from '@ember/component';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { raw } from 'ember-awesome-macros';
import { groupBy, sort } from 'ember-awesome-macros/array';

export default Component.extend({
  columns: computed('optionsGroupedByDays.[]', function() {
    let columns = [
      {
        isFixed: 'left',
        name: '',
        valuePath: 'name',
      }
    ];

    if (!this.hasTimes) {
      return columns.concat(
        this.options.map(({ title }, index) => {
          return {
            isAnswerCell: true,
            index,
            momentFormat: this.isFindADate ? this.momentLongDayFormat : null,
            name: title,
          };
        })
      );
    }

    let index = 0;
    return columns.concat(
      this.optionsGroupedByDays.map(({ value, items }) => {
        return {
          momentFormat: this.momentLongDayFormat,
          name: value,
          subcolumns: items.map(({ date, hasTime }) => {
            let subcolumn = {
              isAnswerCell: true,
              index,
              momentFormat: hasTime ? 'LT' : null,
              name: hasTime ? date : '',
            };
            index++;
            return subcolumn;
          }),
        };
      })
    );
  }),

  hasTimes: readOnly('poll.hasTimes'),

  isFreeText: readOnly('poll.isFreeText'),

  options: readOnly('poll.options'),
  optionsGroupedByDays: groupBy('options', raw('day')),

  users: readOnly('poll.users'),
  usersSorted: sort('users', ['creationDate']),
});
