import Application from 'croodle/app';
import config from 'croodle/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import setupSinon from 'ember-sinon-qunit';
import { start } from 'ember-qunit';

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
setupSinon();
start();
