import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';
import './poll-has-users';
import './poll-participate';
import './switch-tab';
import './t';
import registerAcceptanceTestHelpers from './201-created/register-acceptance-test-helpers';
import registerBrowserNavigationButtonTestHelpers from './browser-navigation-buttons';

export default function startApp(attrs) {
  let attributes = Ember.merge({}, config.APP);
  attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

  return Ember.run(() => {
    let application = Application.create(attributes);
    application.setupForTesting();

    registerAcceptanceTestHelpers(attrs.assert || window.QUnit.assert);
    registerBrowserNavigationButtonTestHelpers();

    application.injectTestHelpers();
    return application;
  });
}
