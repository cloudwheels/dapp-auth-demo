const DashmachineCrypto = require('dashmachine-crypto');
const Dash = require('dash');

describe('Encrytion', () => {
  it('Encrypts and decrypts a message', async (done) => {
    //const Dash = require("dash"); //doesn't work due to missing grpc module (runkit) error

    //LoginReq - the document submitted aas a result of a request to:
    // http://wds.dashmachine.net:8082/api/v1/user/bob/login-request?pin=3523

    //nonce is known only to the vendor and not CW
    const vendorsNonce = 'XpiATFzByZoXZmTWELcvBLbJw3fCv4d7Kv';

    const LoginReq = {
      $id: '24yt9HAab6YWZjsfqn4WX56abA1h2SAmG53eXTBtnNDf',
      $type: 'LoginRequest',
      $dataContractId: 'ABk1Bd63Gs2rCwz4kBCuMwda2b2gVne9x6Piu4JXExEy',
      $ownerId: 'CheZBPQHztvLNqN67i4KxcTU1XmDz7qG85X1XeJbc7K5',
      $revision: 1,
      reference: 'HitPr6xS9snZAu5TTcMaiX5HeVBSMDs13jbDeE3FbhX6',
      uid_pin:
        '7b2274797065223a22427566666572222c2264617461223a5b332c37392c3233342c37322c37382c3137332c3133382c3230362c33372c3233322c32372c38302c3134392c35332c3139332c3231362c3234312c3231342c3234392c3130312c3132362c33352c34352c34332c3136342c39342c39372c322c3234352c3235322c3133322c35322c3131352c3235332c3230332c35332c33342c382c3232302c3135372c3232382c3135352c31322c33372c3137302c3131372c34302c3231302c3234302c3137382c3232342c31342c3231342c3131342c3131302c3139322c31322c3136352c33392c3233342c3137302c39332c36352c3136312c38362c3132372c3138372c3234322c3231342c3230302c3130382c31362c32352c32362c3235312c3137312c3132372c3131302c3132362c37392c3230322c3230342c3231382c3136322c3134312c3234372c342c36302c3233382c38392c3130312c3132372c3138312c3137312c3234382c3232332c3234362c3232312c36302c3135372c3138312c32322c39342c3133372c3132352c37342c31302c372c33342c3139322c37342c33302c3132302c39382c3136352c3138322c36352c38392c34362c3134342c3133342c3137362c3135352c3134302c3134362c3139392c3138312c3231342c37342c38342c3231312c38392c3231362c34322c3137332c3138362c3139372c3130392c39312c3131322c3233362c35392c3233302c3132342c36392c34342c3135352c3233342c3133372c3136322c3138332c37362c3234362c3132342c35372c3234382c38332c34352c3136392c31382c3136365d7d',
      nonce:
        '7b2274797065223a22427566666572222c2264617461223a5b332c37392c3233342c37322c37382c3137332c3133382c3230362c33372c3233322c32372c38302c3134392c35332c3139332c3231362c3234312c3231342c3234392c3130312c3132362c33352c34352c34332c3136342c39342c39372c322c3234352c3235322c3133322c35322c3131352c3130312c3135342c37372c32382c38322c372c3131372c3232312c3131372c35372c36352c3233392c3139362c39392c35352c3132382c38372c3234312c3137372c3132352c38392c3233352c3232362c3137302c3134342c3138372c35342c3135372c3234312c35332c38332c3132382c3133342c3233362c3235332c33352c35372c3138332c35352c39302c3136312c3136372c31362c3137392c39372c34392c3135332c31352c33322c36382c3133372c322c3131322c3231312c36302c3131312c38372c3130382c3132302c3134312c35392c3131302c34362c37332c3234332c3137382c3136342c38362c3233372c3138312c3135302c3134352c37322c3131362c3132322c3133312c3135352c31352c3131382c3133332c3135362c3233382c38352c36302c31372c3131312c3139372c33312c3138322c3230382c33312c32312c3230372c3130372c3230352c32365d7d',
    };

    //uid_pin: Encrypted Hash of [Vendor userID + End-UserID + CW PIN]

    const vendorUserId =
      'Aobc5KKaA4ZqzP7unc6WawQXQEK2S3y6EwrmvJLLn1ui'; //alice
    const userUserId = 'HitPr6xS9snZAu5TTcMaiX5HeVBSMDs13jbDeE3FbhX6'; //bob
    const loginPin = '3523';
    const userPrivateKey =
      '219c8a8f9376750cee9f06e0409718f2a1b88df4acc61bf9ed9cf252c8602768'; //bob's private key
    const senderPublicKey =
      'A0/qSE6tis4l6BtQlTXB2PHW+WV+Iy0rpF5hAvX8hDRz';

    //CW polls for doc with Bob's userId as reference = "HitPr6xS9snZAu5TTcMaiX5HeVBSMDs13jbDeE3FbhX6"

    //CW - has to work out vendor (Alice) user id from $ownerId of document (the vendor's identity id)
    //= "Aobc5KKaA4ZqzP7unc6WawQXQEK2S3y6EwrmvJLLn1ui"

    //CW - knows the PIN it submitted for login request = "3523"

    // CW concats these three values to get the plain uid_pin value
    const plainUID_PIN = vendorUserId.concat(
      userUserId,
      loginPin.toString(),
    );
    console.log('plainUID_PIN:', plainUID_PIN);

    //CW get the hashed + encrypted uids + PIN
    const hashedAndEncryptedUID_PIN = LoginReq.uid_pin;
    console.log('uid_pin:', hashedAndEncryptedUID_PIN);

    //CW decrypts this value to get the hash digest of plainUID_PIN
    const decryptedUID_PIN = DashmachineCrypto.decrypt(
      userPrivateKey,
      hashedAndEncryptedUID_PIN,
      senderPublicKey,
    ).data;
    console.log(
      'decryptedUID_PIN (The hash digest of plainUID_PIN):',
      decryptedUID_PIN,
    );

    //CW verifies that decryptedUID_PIN ==the digest of the hashed plainUID_PIN
    const verified = DashmachineCrypto.verify(
      plainUID_PIN,
      decryptedUID_PIN,
    );
    console.log('verified?:', verified);

    //CW decrypts the nonce
    const encryptedNonce = LoginReq.nonce;
    console.log('encryptedNonce', encryptedNonce);
    const decryptedNonce = DashmachineCrypto.decrypt(
      userPrivateKey,
      encryptedNonce,
      senderPublicKey,
    ).data;
    console.log('decrypted nonce:', decryptedNonce);

    //we know the nonce generated by the vendor for this example, but CW will not - just to check here it decrypted correctly
    const correctNonce = decryptedNonce === vendorsNonce;
    console.log('correctNonce?:', correctNonce);

    //?? CW VALIDATES THE PIN IS CORRECT / THE ONE IT SUBMITTED

    //Generate Response Doc:
    //reference: Vendor userID (Reference)

    //vid_pin: Encrypted Hash of [Vendor nonce + Vendor userID + CW Pin)
    const plainVID_PIN = decryptedNonce.concat(
      vendorUserId,
      loginPin.toString(),
    );
    console.log('plainVID_PIN', plainVID_PIN);

    //hash then encrypt for the vendors PK
    //hash
    const hashedVID_PIN = DashmachineCrypto.hash(plainVID_PIN).data;
    console.log('hashedVID_PIN', hashedVID_PIN);

    //CW gets the wallet user's own private key
    //CW looks up the vendors public key from their userid
    //encrypt hashedVID_PIN
    const encryptedVID_PIN = DashmachineCrypto.encrypt(
      userPrivateKey,
      hashedVID_PIN,
      senderPublicKey,
    ).data;
    console.log('encryptedVID_PIN', encryptedVID_PIN);

    //status: Encrypted [status+entropy] (0 = valid)
    const statusCode = 0;
    const status = statusCode
      .toString()
      .concat(DashmachineCrypto.generateEntropy());
    console.log('status', status);
    const encryptedStatus = DashmachineCrypto.encrypt(
      userPrivateKey,
      status,
      senderPublicKey,
    ).data;
    console.log('encryptedStatus', encryptedStatus);

    //LoginResponse DocData
    const loginResponseDocOpts = {
      reference: vendorUserId,
      vid_pin: encryptedVID_PIN,
      status: encryptedStatus,
    };
    console.log('loginResponseDocOpts');
    console.dir(loginResponseDocOpts);

    /**
     * CW login to dash as the user (bob) and submit a Login reponse document
     */

    const loginContractId =
      'ABk1Bd63Gs2rCwz4kBCuMwda2b2gVne9x6Piu4JXExEy';
    const dpnsContractId =
      '295xRRRMGYyAruG39XdAibaU9jMAzxhknkkAxFE7uVkW';
    const userMnemonic =
      'liar fee island situate deal exotic flat direct save bag fiscal news';
    const userIdentityId =
      '45xcVv3zQnsdZTsCYiS1RfCM7oWErnXpeCWZEK5EZM2W';
    const userLoginOpts = {
      mnemonic: userMnemonic,
      network: 'testnet',
      apps: {
        loginContract: {
          contractId: loginContractId,
        },
        dpnsContract: {
          contractId: dpnsContractId,
        },
      },
    };
    const userClient = new Dash.Client(userLoginOpts);
    await userClient.isReady();
    async function getIdentity() {
      let platform = userClient.platform;
      return await platform.identities.get(userIdentityId);
    }
    console.log('getting identity');
    const identity = await getIdentity();
    console.dir(identity);

    const loginResponseDocument = await userClient.platform.documents.create(
      'loginContract.LoginResponse',
      identity,
      loginResponseDocOpts,
    );
    console.log('loginReponse doc:');
    console.dir(loginResponseDocument);

    return done();
  }, 20000);
});
