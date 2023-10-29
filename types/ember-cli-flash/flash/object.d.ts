// Source: https://github.com/adopted-ember-addons/ember-cli-flash/blob/5e9ca769ce30b168eef1a4a8e4cdf5ad0d538a8d/ember-cli-flash/declarations/flash/object.d.ts
declare module 'ember-cli-flash/flash/object' {
  import EmberObject from '@ember/object';
  import Evented from '@ember/object/evented';

  class FlashObject extends EmberObject.extend(Evented) {
    exiting: boolean;
    exitTimer: number;
    isExitable: boolean;
    initializedTime: number;
    message: string;
    destroyMessage(): void;
    exitMessage(): void;
    preventExit(): void;
    allowExit(): void;
    timerTask(): void;
    exitTimerTask(): void;
  }
  export default FlashObject;
}
