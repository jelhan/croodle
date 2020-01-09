import classic from 'ember-classic-decorator';
import BsInput from 'ember-bootstrap/components/bs-form/element/control/input';

@classic
export default class Input extends BsInput {
  didInsertElement() {
    super.didInsertElement(...arguments);

    if (this.autofocus) {
      this.element.focus();
    }
  }
}
