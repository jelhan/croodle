import Application from 'croodle/app';
import config from 'croodle/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';
import setupSinon from 'ember-sinon-qunit';
import { waitForPromise } from '@ember/test-waiters';

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

// Integrate native fetch with Ember test helpers settled state
const nativeFetch = globalThis.fetch;
globalThis.fetch = function () {
  const fetchPromise = nativeFetch(...arguments);
  waitForPromise(fetchPromise);
  return fetchPromise;
};

setApplication(Application.create(config.APP));

setup(QUnit.assert);

setupSinon();

start();
