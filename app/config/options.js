exports.options = {
  connection: {
    apps: {
      loginContract: {
        contractId: '9GHRxvyYDmWz7pBKRjPnxjsJbbgKLngtejWWp3kEY1vB',
      },
      dpnsContract: {
        contractId: '295xRRRMGYyAruG39XdAibaU9jMAzxhknkkAxFE7uVkW',
      },
      tweetContract: {
        contractId: 'E6WpKfNs4QYAr2vQ7HrTSKLUZo5szsg41bJhEBZKWGck',
      },
    },
    network: 'testnet',
    seeds: { service: '34.215.175.142:3000' },
  },
  polling: {
    responsePollingTimeout: 30000,
    responsePollingFrequency: 5000,
    reponsePollingDelay: 3000,
  },
};
