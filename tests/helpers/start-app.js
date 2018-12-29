import Application from '../../app';
import config from '../../config/environment';
import { merge } from '@ember/polyfills';
import { run } from '@ember/runloop';
import './poll-has-users';
import './poll-participate';
import './switch-tab';
import registerAcceptanceTestHelpers from './201-created/register-acceptance-test-helpers';
import registerBrowserNavigationButtonTestHelpers from './browser-navigation-buttons';
import './ember-i18n/test-helpers';

export default function startApp(attrs) {
  let attributes = merge({}, config.APP);
  attributes.autoboot = true;
  attributes = merge(attributes, attrs); // use defaults, but you can override;

  return run(() => {
    let application = Application.create(attributes);
    application.setupForTesting();

    registerAcceptanceTestHelpers(attrs.assert || window.QUnit.assert);
    registerBrowserNavigationButtonTestHelpers();

    application.injectTestHelpers();
    return application;
  });
}
