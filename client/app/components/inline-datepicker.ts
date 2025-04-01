import templateOnlyComponent from '@ember/component/template-only';
import type { DateTime } from 'luxon';

interface InlineDatepickerSignature {
  Args: {
    Named: {
      center: DateTime;
      onCenterChange: (day: { datetime: DateTime }) => void;
      onSelect: (days: { datetime: DateTime[] }) => void;
      selectedDays: DateTime[];
    };
  };
}

const InlineDatepicker = templateOnlyComponent<InlineDatepickerSignature>();

export default InlineDatepicker;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    InlineDatepicker: typeof InlineDatepicker;
  }
}
