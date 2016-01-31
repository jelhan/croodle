import Ember from 'ember';
import registerAcceptanceTestHelpers from './201-created/register-acceptance-test-helpers';
import Application from '../../app';
import config from '../../config/environment';
import './poll-title-equal';
import './poll-description-equal';
import './poll-has-users';
import './poll-has-options';
import './poll-has-answers';
import './poll-has-valid-url';
import './poll-participate';
import './select-dates';
import './switch-tab';
import './t';

registerAcceptanceTestHelpers();

export default function startApp(attrs) {
  let application;

  let attributes = Ember.merge({}, config.APP);
  attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

  Ember.run(() => {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
