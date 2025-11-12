import { startMirage } from 'client/mirage';
import { settled } from '@ember/test-helpers';

export function setupMirage(hooks: NestedHooks) {
  hooks.beforeEach(async function() {
    this.server = await startMirage({ environment: 'test' });
  });

  hooks.afterEach(function () {
    return settled().then(() => {
      if (this.server) {
        this.server.shutdown();
        delete this.server;
      }
    });
  });
}
