import Component from '@ember/component';
import { computed } from '@ember/object';
import { raw } from 'ember-awesome-macros';
import { groupBy } from 'ember-awesome-macros/array';

export default Component.extend({
  /**
   * @property hasTimes
   * @type {Boolean}
   * @public
   */

  /**
   * @property options
   * @type {Option[]}
   * @public
   */

  /**
   * @property users
   * @type {User[]}
   * @public
   */

  columns: computed('optionsGroupedByDays.[]', function() {
    let columns = [
      {
        isFixed: 'left',
        name: '',
        valuePath: 'name',
      }
    ]
    if (this.hasTimes) {
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
    } else {
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
  }),
  optionsGroupedByDays: groupBy('options', raw('day')),
});
