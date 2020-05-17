// imports
const debug = require('debug')('server:debug');
const DataDocument = require('../models/dataDocument.model');

/**
 * LoginResponseDocument class - represents login documents sumitted to or retrieved from Dash Platform
 * @class LoginResponseDocument
 * @extends DataDocument
 */
module.exports = class LoginResponseDocument extends DataDocument {
  /**
   * constructor - creates a new LoginResponseDocument
   * @constructs LoginResponseDocument
   * @param contractId {string}
   * @param documentId {string}
   * @param ownerId {string}
   * @param data {Object}
   *
   */
  constructor(dataContractId, id, ownerId, data) {
    debug(`Creating new LoginResponseDocument`);
    super(dataContractId, id, ownerId, data);
  }
};
