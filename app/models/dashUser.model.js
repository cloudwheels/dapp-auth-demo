// imports
const path = require('path');
const DPNSDocument = require('./dpnsDocument.model');
const debug = require('debug')('server:debug');

/**
 * DashUser class - represents a registered Dash Platform Username
 * @class DashUser
 * @property {string} id Unique id fopr the user record - the id of the DPNS document which registered the name
 * @property {string} name The registered username
 * @property {string} identityId identityId  associated with the username
 * @property {Object} identity full identity object of the identityId
 * @property {string} privateKey private Key Associated wwith the user identity
 */
module.exports = class DashUser {
  /**
   *
   * @constructs DashUser
   */
  constructor() {
    debug(`Creating new user`);
  }
  /**
   * Finds the registered username on the network
   * @static DashUser#find
   * @param nameToFind
   */
  static async find(nameToFind, connection) {
    debug(`Searching for username: ${nameToFind}`);
    debug(`passed in connection ${connection}`);
    try {
      const client = connection.client;
      debug(`client: ${client}`);
      await client.isReady();
      //.then(async () => { // attempting to catch netwrok errors
      debug(`Client is ready...`);

      debug(`Find user DPNS Docuemnt Id`);
      const foundUsers = await DPNSDocument.find(
        connection,
        'dpnsContract.domain',
        {
          where: [
            ['normalizedParentDomainName', '==', 'dash'],
            ['normalizedLabel', '==', nameToFind.toLowerCase()],
          ],
          startAt: 1,
        },
      );

      debug(
        `Found ${foundUsers.length} document(s): ${JSON.stringify(
          foundUsers,
        )}`,
      );

      if ((foundUsers.length = 0)) {
        return { success: false, message: 'Name not found' };
      } else if ((foundUsers.length = 1)) {
        let doc = new DPNSDocument();
        Object.assign(doc, foundUsers.data[0]);
        debug(`DPNSDocument: ${JSON.stringify(doc)}`);
        debug(`Document Id : ${doc.id}`);
        const docData = doc.data.data;
        debug(`Document DATA : ${JSON.stringify(docData)}`);
        debug(
          `User IdnetityId (from DPNS docuemnt): ${docData.records.dashIdentity}`,
        );
        let foundUser = new this();
        foundUser.name = nameToFind;
        foundUser.id = doc.id;
        foundUser.identityId = docData.records.dashIdentity;
        foundUser.identity = await client.platform.identities.get(
          foundUser.identityId,
        );
        debug(
          `returning user instance: ${JSON.stringify(foundUser)}`,
        );
        return { success: true, data: foundUser };
      } else {
        //should never happen!
        return {
          error: true,
          message: 'More than one nam record found',
        };
      }

      /*
      // Atempting to catch network errors 
      })
        .catch((notReadyError) => {
          debug(`not ready error: ${notReadyError}`);
          return { error: true, message: notReadyError };
        });
      */
    } catch (e) {
      debug(`find name error: ${e}`);
      return { error: true, message: e };
    }
  }

  get id() {
    return this._id;
  }

  /**
   * @param {string} newId
   */
  set id(newId) {
    if (newId) {
      this._id = newId;
    }
  }

  get name() {
    return this._name;
  }

  /**
   * @param {string} newName
   */
  set name(newName) {
    if (newName) {
      this._name = newName;
    }
  }

  get identityId() {
    return this._identityId;
  }

  /**
   * @param {string} newIdentityId
   */
  set identityId(newIdentityId) {
    if (newIdentityId) {
      this._identityId = newIdentityId;
    }
  }

  get identity() {
    return this._identity;
  }

  /**
   * @param {Object} newIdentityId
   */
  set identity(newIdentity) {
    if (newIdentity) {
      this._identity = newIdentity;
    }
  }

  get publicKey() {
    return this._identity.publicKeys[0].data;
  }

  get privateKey() {
    return this._privateKey;
  }

  /**
   * @param {string} newPrivateKey
   */
  set privateKey(newPrivateKey) {
    if (newPrivateKey) {
      this._privateKey = newPrivateKey;
    }
  }

  /**
   * Returns the DashUser instance in JSON format
   * @method DashUser#toJSON
   * @return {JSON}
   */

  toJSON() {
    return {
      name: this._name,
      id: this._id,
      identityId: this._identityId,
      identity: this._identity,
      privateKey: this._privateKey,
    };
  }
};
