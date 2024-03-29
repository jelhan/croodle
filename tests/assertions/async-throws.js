/*
 * This code is a mainly a copy-and-paste of a snippet provided by Sam Selikoff
 * at https://gist.github.com/samselikoff/ad5e3695383b91599ee428bf9a2d22ca
 */

import Ember from 'ember';

let originalTestAdapterException;
let originalEmberOnError;
let originalWindowOnError;

function intercept(f = () => {}) {
  originalTestAdapterException = Ember.Test.adapter.exception;
  originalWindowOnError = window.onerror;
  originalEmberOnError = Ember.onerror;
  Ember.Test.adapter.exception = () => {};
  Ember.onerror = f;
  window.onerror = () => {};
}

function restore() {
  Ember.Test.adapter.exception = originalTestAdapterException;
  Ember.onerror = originalEmberOnError;
  window.onerror = originalWindowOnError;
}

export default async function asyncThrows(f, expectedErrorMessage) {
  let done = this.async();
  let loggedErrorArgs;

  intercept((...args) => {
    loggedErrorArgs = args;
  });

  await f();

  let errorText = (loggedErrorArgs || []).join(' ');

  if (expectedErrorMessage) {
    let result = errorText.includes(expectedErrorMessage);

    this.pushResult({
      result,
      expected: expectedErrorMessage,
      actual: errorText,
      message: `Expected to see error '${expectedErrorMessage}'`,
    });
  } else {
    this.pushResult({
      result: false,
      expected: '',
      actual: errorText,
      message: `You're using asyncThrows but you didn't add text to the assertion. Add some text as the second argument so the actual exception being thrown is what you expect it is.`,
    });
  }

  await done();

  return restore();
}
