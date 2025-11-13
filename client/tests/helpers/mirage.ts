import { startMirage } from '@croodle/client/mirage';
import { settled } from '@ember/test-helpers';
import type { TestContext } from '@ember/test-helpers';
import type { Server } from 'miragejs';

interface Context extends TestContext {
  server?: Server;
}

export function setupMirage(hooks: NestedHooks) {
  hooks.beforeEach(function (this: Context) {
    this.server = startMirage({ environment: 'test' });
  });

  hooks.afterEach(function (this: Context) {
    return settled().then(() => {
      if (this.server) {
        this.server.shutdown();
        delete this.server;
      }
    });
  });
}
