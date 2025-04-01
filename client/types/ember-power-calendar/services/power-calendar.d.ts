import type Service from '@ember/service';

declare module 'ember-power-calendar/services/power-calendar' {
  export default class PowerCalendarService extends Service {
    locale: string;
  }
}
