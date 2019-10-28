import BsInput from 'ember-bootstrap/components/bs-form/element/control/input';

export default BsInput.extend({
  didInsertElement() {
    this._super(...arguments);

    if (this.autofocus) {
      this.element.focus();
    }
  },
});
