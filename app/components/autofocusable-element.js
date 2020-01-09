import classic from 'ember-classic-decorator';
import Component from '@ember/component';

@classic
export default class AutofocusableElement extends Component {
  autofocus = true;

  didInsertElement() {
    super.didInsertElement(...arguments);

    if (this.autofocus) {
      this.element.focus();
    }
  }
}
