import BaseTable from 'ember-table/components/ember-table/component';

export default class EmberTable extends BaseTable {
  didInsertElement() {
    super.didInsertElement(...arguments);

    this.element.querySelector('table').classList.add('table');
  }
}
