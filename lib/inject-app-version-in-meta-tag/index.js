/* eslint-env node */
'use strict';

module.exports = {
  name: 'inject-app-version-in-meta-tag',

  isDevelopingAddon() {
    return true;
  },

  contentFor(type, config) {
    if (type === 'head') {
      let { version } = config.APP;
      return `<meta name="build-info" content="version=${version}"/>`;
    }
  },
};
