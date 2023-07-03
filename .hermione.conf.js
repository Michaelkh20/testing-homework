module.exports = {
  sets: {
    desktop: {
      files: 'test/hermione',
    },
  },

  browsers: {
    chrome: {
      automationProtocol: 'devtools',
      desiredCapabilities: {
        browserName: 'chrome',
        retry: 3,
      },
    },
  },
  plugins: {
    'html-reporter/hermione': {
      enabled: true,
    },
  },
};
