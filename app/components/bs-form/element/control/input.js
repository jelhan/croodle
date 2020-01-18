import classic from 'ember-classic-decorator';
import BaseBsInput from 'ember-bootstrap/components/bs-form/element/control/input';

@classic
export default class CustomizedBsInput extends BaseBsInput {
  didInsertElement() {
    super.didInsertElement(...arguments);

    if (this.autofocus) {
      this.element.focus();
    }
  }
}
