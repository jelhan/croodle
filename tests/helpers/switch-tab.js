import { registerAsyncHelper } from '@ember/test';

export default registerAsyncHelper('switchTab', function(app, tab) {
  click(`.nav-tabs .${tab} a`);
});
