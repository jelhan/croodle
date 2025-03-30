import Component from '@glimmer/component';
import { action } from '@ember/object';
import { isArray } from '@ember/array';
import { DateTime } from 'luxon';
import { tracked } from '@glimmer/tracking';
import type { FormDataOption } from './create-options';
import type BsFormElementComponent from 'ember-bootstrap/components/bs-form/element';

export interface CreateOptionsDatesSignature {
  Args: {
    formElement: BsFormElementComponent;
    options: Array<FormDataOption>;
    updateOptions: (options: string[]) => void;
  };
}

export default class CreateOptionsDates extends Component<CreateOptionsDatesSignature> {
  @tracked calendarCenter =
    this.selectedDays.length >= 1
      ? (this.selectedDays[0] as DateTime)
      : DateTime.local();

  get selectedDays(): DateTime[] {
    return this.args.options.map(
      ({ value }) => DateTime.fromISO(value) as DateTime,
    );
  }

  get calendarCenterNext() {
    return this.calendarCenter.plus({ months: 1 });
  }

  @action
  handleSelectedDaysChange({
    datetime: newDatesAsLuxonDateTime,
  }: {
    datetime: DateTime[];
  }) {
    if (!isArray(newDatesAsLuxonDateTime)) {
      // special case: all options are unselected
      this.args.updateOptions([]);
      return;
    }

    this.args.updateOptions(
      newDatesAsLuxonDateTime.map((datetime) => datetime.toISODate() as string),
    );
  }

  @action
  handleCalenderCenterChange(
    offset: number,
    { datetime }: { datetime: DateTime },
  ) {
    this.calendarCenter = datetime.plus({ months: offset });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CreateOptionsDates: typeof CreateOptionsDates;
  }
}
