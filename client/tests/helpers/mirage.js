import { setupMirage as _setupMirage } from 'ember-mirage/test-support';
import { createServer } from 'client/mirage';

export function setupMirage(hooks, options) {
  options = options || {};
  options.createServer = options.createServer || createServer;
  options.config = options.config || {};
  options.config.environment = 'test';
  return _setupMirage(hooks, options);
}
