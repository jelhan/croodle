import { ComponentLike } from '@glint/template';
import type FlashObject from 'ember-cli-flash/flash/object';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    FlashMessage: ComponentLike<{
      Args: {
        Named: {
          flash: FlashObject;
        };
      };
      Blocks: {
        default: [];
      };
    }>;
  }
}
