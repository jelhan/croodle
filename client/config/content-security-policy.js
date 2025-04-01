module.exports = function () {
  return {
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
};
