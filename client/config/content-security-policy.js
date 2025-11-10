module.exports = function (environment) {
  const csp = {
    delivery: ['meta'],
    enabled: true,
    failTests: true,
    policy: {
      'default-src': ["'none'"],
      'script-src': ["'self'"],
      'font-src': ["'self'"],
      'connect-src': ["'self'"],
      'img-src': ["'self'", 'data:'],
      'style-src': ["'self'"],
      'media-src': ["'none'"],
    },
    reportOnly: false,
  };

  if (environment === 'test') {
    // ember-qunit uses style-loader which requires a nonce to not break CSP
    csp.policy['style-src'].push(
      "'nonce-must-not-be-present-in-production-builds'",
    );
  }

  return csp;
};
