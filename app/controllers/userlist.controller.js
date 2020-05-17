const debug = require('debug')('server:debug');
const DashConnection = require('../services/dashConnection.service');
const DashUser = require('../models/dashUser.model');
const TweetDocument = require('../models/tweetDocument.model');

// TODO: move vendor details to .env
const vendorMnemonic =
  'uniform analyst paper father soldier toe lesson fetch exhaust jazz swim response';
const vendorIdentityId =
  'CheZBPQHztvLNqN67i4KxcTU1XmDz7qG85X1XeJbc7K5';

// TODO: move contract id to .env
const TweetContractId =
  'E6WpKfNs4QYAr2vQ7HrTSKLUZo5szsg41bJhEBZKWGck';

// TODO: dontl realy need to pass the auth options
const Options = require('../config/options');

/**
 *  return a list of tweets from registered users
 *  i.e. only those submitted by the vendor (document ownerId = vendor identity Id
 *  [and where username is on the list of registered users]
 *
 */
exports.userlist = async (req, res, next) => {
  try {
    debug(`getting signed up user list`);

    const userQuery = {
      where: [['$ownerId', '==', vendorIdentityId]],
      startAt: 1,
    };

    const userlistConnection = new DashConnection(
      'testnet',
      'uniform analyst paper father soldier toe lesson fetch exhaust jazz swim response',
      Options.options.connection.apps,
      Options.options.connection.seeds,
    );
    await userlistConnection.connect();
    const usersFound = await TweetDocument.find(
      userlistConnection,
      'tweetContract.signups',
      userQuery,
    );
    userlistConnection.disconnect();
    debug(`found signed up users: ${usersFound}`);
    return res.status(200).json({ success: usersFound });
  } catch (e) {
    debug(`error finding signed up users: ${e}`);
    return res.status(400).json({ error: e });
  }
};
