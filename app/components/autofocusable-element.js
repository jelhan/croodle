import Component from '@ember/component';

export default Component.extend({
  autofocus: true,

  didInsertElement() {
    this._super(...arguments);

    if (this.autofocus) {
      this.element.focus();
    }
  },
});
