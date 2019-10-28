module.exports = {
  test_page: 'tests/index.html?hidepassed',
  disable_watching: true,
  launch_in_ci: [
    'Chrome',
    'Firefox',
  ],
  launch_in_dev: [
    'Chrome'
  ],
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
        '--window-size=1440,900'
      ].filter(Boolean)
    },
    Firefox: {
      ci: [
        '--headless',
        '--window-size=1440,900',
      ]
    },
  },
  proxies: {
    '/': {
      target: 'http://localhost:4200',
      onlyContentTypes: [
        'json'
      ]
    }
  },
  launchers: {
    SL_chrome: {
      exe: 'ember',
      args: [
        'sauce:launch',
        '-b',
        'chrome',
        '-p',
        'Windows 10',
        '--vi',
        'public',
        '--at',
        '--no-ct',
        '--u',
      ],
      protocol: 'browser'
    },
    SL_firefox: {
      exe: 'ember',
      args: [
        'sauce:launch',
        '-b',
        'firefox',
        '-p',
        'Windows 10',
        '--vi',
        'public',
        '--at',
        '--no-ct',
        '--u',
      ],
      protocol: 'browser'
    },
    SL_edge: {
      exe: 'ember',
      args: [
        'sauce:launch',
        '-b',
        'microsoftedge',
        '--vi',
        'public',
        '--at',
        '--no-ct',
        '--u',
      ],
      protocol: 'browser'
    },
    SL_ie: {
      exe: 'ember',
      args: [
        'sauce:launch',
        '-b',
        'internet explorer',
        '-v',
        '11',
        '-p',
        'Windows 10',
        '--vi',
        'public',
        '--at',
        '--no-ct',
        '--u',
      ],
      protocol: 'browser'
    },
    SL_safari: {
      exe: 'ember',
      args: [
        'sauce:launch',
        '-b',
        'safari',
        '-v',
        'latest',
        '--vi',
        'public',
        '--at',
        '--no-ct',
        '--u',
      ],
      protocol: 'browser'
    }
  }
};
