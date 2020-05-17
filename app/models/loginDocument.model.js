// imports
const debug = require('debug')('server:debug');
const DataDocument = require('../models/dataDocument.model');

/**
 * LoginDocument class - represents login documents sumitted to or retrieved from Dash Platform
 * @class LoginDocument
 * @extends DataDocument
 */
module.exports = class LoginDocument extends DataDocument {
  /**
   * constructor - creates a new LoginDocument
   * @constructs LoginDocument
   * @param contractId {string}
   * @param documentId {string}
   * @param ownerId {string}
   * @param data {Object}
   *
   */
  constructor(dataContractId, id, ownerId, data) {
    debug(`Creating new login document`);
    super(dataContractId, id, ownerId, data);
  }
};
