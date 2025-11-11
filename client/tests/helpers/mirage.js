import { setupMirage as _setupMirage } from 'ember-mirage/test-support';
import mirageConfig from 'client/mirage/config';

export function setupMirage(hooks, options) {
  options = options || {};
  options.createServer = options.createServer || mirageConfig;
  options.config = options.config || {};
  options.config.environment = 'test';
  return _setupMirage(hooks, options);
}
