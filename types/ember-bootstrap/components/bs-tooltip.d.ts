import { ComponentLike } from '@glint/template';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    BsTooltip: ComponentLike<{
      Args: {
        Named: {
          placement?: 'top' | 'bottom' | 'left' | 'right';
          triggerEvents?: string | string[];
          visible?: boolean;
        };
      };
      Blocks: {
        default: [];
      };
    }>;
  }
}
