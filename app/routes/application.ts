import Route from '@ember/routing/route';

const SHOULD_MOCK_API = true;

export default class ApplicationRoute extends Route {
  async beforeModel() {
    if (SHOULD_MOCK_API) {
      const { worker } = await import('../mocks/browser');
      worker.start();
    }
  }
}
