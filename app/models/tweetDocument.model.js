// imports
const debug = require('debug')('server:debug');
const DataDocument = require('./dataDocument.model');
const Tweet = require('./tweet.model');

/**
 * TweetDocument class - represents tweet documents sumitted to or retrieved from Dash Platform
 * @class TweetDocument
 * @extends DataDocument
 */
module.exports = class TweetDocument extends DataDocument {
  /**
   * constructor - creates a new TweetDocument
   * @constructs TweetDocument
   * @param contractId {string}
   * @param documentId {string}
   * @param ownerId {string}
   * @param data {Object}
   * @param tweet {Object}
   *
   */
  constructor(dataContractId, id, ownerId, data, tweet) {
    debug(`Creating new login document`);
    super(dataContractId, id, ownerId, data);
  }
};
