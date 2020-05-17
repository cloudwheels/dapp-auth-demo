const debug = require('debug')('server:debug');

/**
 * Tweet class - represents a user tweet
 * @class Tweet
 * @property {string} messageId A unquie Id for the message formed from tiumestamp+username
 * @property {string} username The registered username
 * @property {string} authref The documentId of TweetResponse authorising the tweet in WDS
 * @property {string} message tweet content
 * @property {string} temp_timestamp date time of the tweet - should be available as document timestamp
 *
 *
 */
module.exports = class Tweet {
  /**
   * Constructor for a tweet instance
   * @constructs Tweet
   */
  constructor(messageId, username, authref, message, temp_timestamp) {
    debug(`Creating new tweet`);
    this._messageId = messageId;
    this._username = username;
    this._authtref = authref;
    this._message = message;
    this._temp_timestamp = temp_timestamp;
  }

  toJSON() {
    return JSON.stringify({
      messageId: this._messageId,
      username: this._username,
      authref: this._authtref,
      message: this._message,
      temp_timestamp: this._temp_timestamp,
    });
  }

  //getters & setters
  get messageId() {
    return this._messageId;
  }

  /**
   * @param {string} newMessageId
   */
  set messageId(newMessageId) {
    if (newMessageId) {
      this._messageId = newMessageId;
    }
  }

  get username() {
    return this._username;
  }

  /**
   * @param {string} newUsername
   */
  set username(newUsername) {
    if (newUsername) {
      this._username = newUsername;
    }
  }

  get authrequest() {
    return this._authrequest;
  }

  /**
   * @param {string} newAuthrequest
   */
  set authrequest(newAuthrequest) {
    if (newAuthrequest) {
      this._authrequest = newAuthrequest;
    }
  }

  get message() {
    return this._message;
  }

  /**
   * @param {string} newMessage
   */
  set message(newMessage) {
    if (newMessage) {
      this._username = newMessage;
    }
  }

  get temp_timestamp() {
    return this._temp_timestamp;
  }

  /**
   * @param {string} newTemp_timestamp
   */
  set temp_timestamp(newTemp_timestamp) {
    if (newTemp_timestamp) {
      this._temp_timestamp = newTemp_timestamp;
    }
  }
};
