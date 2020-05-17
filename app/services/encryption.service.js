// imports
const Dash = require('dash');
const ECIES = require('bitcore-ecies-dash');
const debug = require('debug')('server:debug');

/**
 * EncryptionService static class - performs ECIES encryption & decryption
 * @class EncryptionService
 * @method encrypt
 * @method decrypt
 */
module.exports = class EncryptionService {
  /**
   * //not working as static
   * @static encrypt Encrypt a message for user
   *
   * @param {Object} connection A DashJS Conneection object for the mesage sender's account
   * @param {string} message message to encrypt
   * @param {object} recipient instance of DashUser
   * @returns {string} encrypted message
   */
  async encrypt(connection, message, recipient) {
    debug(
      `encrypting message following message for ${recipient}:\n${message}`,
    );
    try {
      const client = connection.client;
      debug(`client: ${client}`);
      await client.isReady();
      //.then(async () => { // attempting to catch netwrok errors
      debug(`Client is ready...`);

      const senderIdentityPrivateKey = await client.account.getIdentityHDKey(
        0,
        'user',
      ).privateKey;
      debug(`senderIdentityPrivateKey: ${senderIdentityPrivateKey}`);
      debug(`recipientIdentityid: ${recipient.identityId}`);
      const recipientIdentity = await client.platform.identities.get(
        recipient.identityId,
      );
      debug(`recipientIdentity: ${recipientIdentity}`);

      //const recipientPublicKeyFromId = await recipientIdentity.getPublicKeyById(1);
      //debug(`recipientPublicKeyFromId: ${recipientPublicKeyFromId}`);
      const recipientPublicKeyFromIdData =
        recipientIdentity.publicKeys[0].data; // await recipientPublicKeyFromId.getData();//base 64 enc public key

      debug(
        `recipientPublicKeyFromIdData: ${recipientPublicKeyFromIdData}`,
      );
      const recipientPublicKeyBuffer = Buffer.from(
        recipientPublicKeyFromIdData,
        'base64',
      );
      debug(`recipientPublicKeyBuffer: ${recipientPublicKeyBuffer}`);
      const recipientPublicKeyFromBuffer = new Dash.Core.PublicKey(
        recipientPublicKeyBuffer,
      );
      debug(
        `recipientPublicKeyFromBuffer ${recipientPublicKeyFromBuffer}`,
      );

      //vendor encrypts
      const sender = ECIES()
        .privateKey(senderIdentityPrivateKey)
        .publicKey(recipientPublicKeyFromBuffer); //(userIdentityPublicKeyFromPrivateKey);

      const encrypted = sender.encrypt(message);
      debug(`encrypted: ${JSON.stringify(encrypted)}`);

      return await Promise.resolve({
        success: true,
        data: encrypted,
      });
    } catch (e) {
      debug(`encrypt error: ${e}`);
      return Promise.reject({ error: true, message: e });
    }
  }

  /**
   * //not workign as static
   * @static decrypt Encrypt a message for user
   *
   * @param {Object} connection A DashJS Conneection object for the mesage sender's account
   * @param {string} message message to encrypt
   * @param {object} sender instance of DashUser
   * @returns {string} decrypted message
   */
  async decrypt(connection, message, sender) {
    debug(
      `decrypting following encrypted message from ${sender}:\n${message}`,
    );
    try {
      const client = connection.client;
      debug(`client: ${client}`);
      await client
        .isReady()

        .then(async () => {
          // attempting to catch netwrok errors
          debug(`Client is ready...`);

          const recipientIdentityPrivateKey = await client.account.getIdentityHDKey(
            0,
            'user',
          ).privateKey;
          debug(
            `recipientIdentityPrivateKey: ${recipientIdentityPrivateKey}`,
          );
          debug(`senderIdentityid: ${sender.identityId}`);
          const senderIdentity = await client.platform.identities.get(
            sender.identityId,
          );
          debug(`senderIdentity: ${senderIdentity}`);

          //const senderPublicKeyFromId = await senderIdentity.getPublicKeyById(1);
          //debug(`senderPublicKeyFromId: ${senderPublicKeyFromId}`);
          const senderPublicKeyFromIdData =
            senderIdentity.publicKeys[0].data; // await senderPublicKeyFromId.getData();//base 64 enc public key

          debug(
            `senderPublicKeyFromIdData: ${senderPublicKeyFromIdData}`,
          );
          const senderPublicKeyBuffer = Buffer.from(
            senderPublicKeyFromIdData,
            'base64',
          );
          debug(`senderPublicKeyBuffer: ${senderPublicKeyBuffer}`);
          const senderPublicKeyFromBuffer = new Dash.Core.PublicKey(
            senderPublicKeyBuffer,
          );
          debug(
            `senderPublicKeyFromBuffer ${senderPublicKeyFromBuffer}`,
          );

          //edecrypts
          const recipient = ECIES()
            .privateKey(recipientIdentityPrivateKey)
            .publicKey(senderPublicKeyFromBuffer); //(userIdentityPublicKeyFromPrivateKey);

          const decrypted = recipient.decrypt(message.data);
          debug(`decrypted: ${decrypted}`);

          return await Promise.resolve({
            success: true,
            data: decrypted,
          });
        });
    } catch (e) {
      debug(`decrypt error: ${e}`);
      return { error: true, message: e };
    }
  }
};
