import Application from '@croodle/client/app';
import config from '@croodle/client/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import setupSinon from 'ember-sinon-qunit';
import { loadTests } from 'ember-qunit/test-loader';
import { start, setupEmberOnerrorValidation } from 'ember-qunit';

document.addEventListener(
  'securitypolicyviolation',
  function ({ blockedURI, violatedDirective }) {
    throw new Error(
      'Content-Security-Policy violation detected: ' +
        `Violated directive: ${violatedDirective}. ` +
        `Blocked URI: ${blockedURI}`,
    );
  },
);

setApplication(Application.create(config.APP));

setup(QUnit.assert);
setupEmberOnerrorValidation();
setupSinon();
loadTests();
start();
