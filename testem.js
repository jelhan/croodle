'use strict';

module.exports = {
  test_page: 'tests/index.html?hidepassed',
  disable_watching: true,
  launch_in_ci: ['Chrome'],
  launch_in_dev: ['Chrome'],
  browser_start_timeout: 120,
  browser_args: {
    Chrome: {
      ci: [
        // --no-sandbox is needed when running Chrome inside a container
        process.env.CI ? '--no-sandbox' : null,
        '--headless',
        '--disable-dev-shm-usage',
        '--disable-software-rasterizer',
        '--mute-audio',
        '--remote-debugging-port=0',
        '--window-size=1440,900',
      ].filter(Boolean),
    },
    Firefox: {
      ci: ['--headless', '--window-size=1440,900'],
    },
  },
  proxies: {
    '/': {
      target: 'http://localhost:4200',
      onlyContentTypes: ['json'],
    },
  },
  launchers: {
    // Allow safari to proceed without user intervention. See https://github.com/testem/testem/issues/1387
    Safari: {
      protocol: 'browser',
      exe: 'osascript',
      args: [
        '-e',
        `tell application "Safari"
          activate
          open location "<url>"
         end tell
         delay 3000`,
      ],
    },
  },
};
