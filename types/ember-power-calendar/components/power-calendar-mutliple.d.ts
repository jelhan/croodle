import { ComponentLike } from '@glint/template';
import type { DateTime } from 'luxon';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    PowerCalendarMultiple: ComponentLike<{
      Args: {
        Named: {
          center: DateTime;
          onCenterChange: (day: { datetime: DateTime }) => void;
          onSelect: (days: { datetime: DateTime[] }) => void;
          selected: DateTime[];
        };
      };
      Blocks: {
        default: [
          {
            actions: {
              moveCenter: (step: number, unit: 'month') => void;
            };
            center: Date;
            Days: ComponentLike;
          },
        ];
      };
      Element: HTMLDivElement;
    }>;
  }
}
