module.exports = {
  env: {
    embertest: true
  },
  globals: {
    // ember-cli-acceptance-test-helpers
    hasComponent: false,
    // i18n test helper
    t: false,
    // browser-navigation-buttons-test-helper
    backButton: false,
    forwardButton: false,
    setupBrowserNavigationButtons: false,
    // local test helpers
    pollHasUser: false,
    pollHasUsersCount: false,
    pollParticipate: false,
    switchTab: false
  }
};
