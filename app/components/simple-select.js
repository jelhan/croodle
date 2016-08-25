import SimpleSelect from 'ember-simple-select/components/simple-select';
import AutofocusSupport from 'croodle/mixins/autofocus-support';

export default SimpleSelect.reopen({
  classNames: ['form-control']
}).extend(AutofocusSupport);
