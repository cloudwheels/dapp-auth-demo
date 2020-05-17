const DashUser = require('../../app/models/dashUser.model');
const DashAccount = require('../../app/models/dashAccount.model');
const DashConnection = require('../../app/services/dashConnection.service');
const Encryption = require('../../app/services/encryption.service.copy');
const HashService = require('../../app/services/hash.service');

describe('Hashing', () => {
  it('Hashes a message', () => {
    const message = 'message';
    const digest = HashService.hash(message);
    expect(digest.data).toBe(
      '1458843c4cbf3458efa01e8c4d1c62df6bbb9aabd1f0dbe0448e5f6acb5fdfa0',
    );
  });

  it('Verifies a hash', () => {
    const message = 'message';
    const digest = HashService.hash(message);
    expect(digest.data).toBe(
      '1458843c4cbf3458efa01e8c4d1c62df6bbb9aabd1f0dbe0448e5f6acb5fdfa0',
    );
    const verifies = HashService.verify(message, digest.data);
    expect(verifies.success).toBe(true);
  });
});

describe('Integration Connection', () => {
  it('Connects', async () => {
    const conn = new DashConnection(
      '',
      {},
      {},
      { service: '34.215.175.142:3000' },
    );
    await conn.connect();
    conn.disconnect();
  });

  it('Connect with a mnemonic', async () => {
    const vendorAccount = new DashAccount();
    vendorAccount.mnemonic =
      'liar fee island situate deal exotic flat direct save bag fiscal news'; //bob

    // vendorAccount.mnemonic = 'uniform analyst paper father soldier toe lesson fetch exhaust jazz swim response'; //alice vendor
    const conn = new DashConnection(
      '',
      {},
      {},
      { service: '34.215.175.142:3000' },
    );
    await conn.connect();
    conn.disconnect();
  });

  it('Encrypts and decrypts', () => {
    const vendorPrivateKey =
      '40148175614f062fb0b4e5c519be7b6f57b872ebb55ea719376322fd12547bff';
    const message = 'hello';
    const userPubicKey =
      'A7GGInyvn7ExXkSVg+OFhbhVjEMhIFv0oyeJl03gFDRo';
    const userPrivateKey =
      '219c8a8f9376750cee9f06e0409718f2a1b88df4acc61bf9ed9cf252c8602768';
    const vendorPublicKey =
      'A0/qSE6tis4l6BtQlTXB2PHW+WV+Iy0rpF5hAvX8hDRz';
    const encrypted = Encryption.encrypt(
      vendorPrivateKey,
      message,
      userPubicKey,
    ).data;
    console.dir(encrypted);

    const decrypted = Encryption.decrypt(
      userPrivateKey,
      encrypted,
      vendorPublicKey,
      false,
    ).data;
    console.dir(decrypted);
  }, 5000);
});

//Encryption test do not run properly
/*
const vendor = new DashUser();
vendor.identityId = 'CheZBPQHztvLNqN67i4KxcTU1XmDz7qG85X1XeJbc7K5';
const vendorAccount = new DashAccount()
vendorAccount.mnemonic = 'uniform analyst paper father soldier toe lesson fetch exhaust jazz swim response';

const loginContractId =
'ABk1Bd63Gs2rCwz4kBCuMwda2b2gVne9x6Piu4JXExEy';
    const apps = {
        loginContract: {
          contractId: loginContractId,
        },
      };

const vendorConnection = new DashConnection('testnet', vendorAccount, apps, {})
//const vendorConnection = new DashConnection('',{},{},{})

const user = new DashUser();
user.identityId = '45xcVv3zQnsdZTsCYiS1RfCM7oWErnXpeCWZEK5EZM2W';
const userAccount = new DashAccount()
userAccount.mnemonic = 'liar fee island situate deal exotic flat direct save bag fiscal news';


const userConnection = new DashConnection('testnet', userAccount, apps, {})

const message = 'hello';
vendorConnection.connect();




describe('Encryption', () => {
    it('Encrypts and decrypts successfully', () => {
       
        
        const encrypted = Encryption.encrypt(vendorConnection, message, user);
        //await vendorConnection.disconnect
        expect(encrypted.success).toBe(true);
    
       
        const encryptedMessage = encrypted.success.data;
        userConnection.connect();
        const decrypted = Encryption.decrypt(userConnection, encryptedMessage, vendor)
        userConnection.disconnect();
        expect(decrypted.success).toBe(true);

        const decryptedMessage = decrypted.success.data;

        expect(decryptedMessage).toEqual(message);
 
    },10000);

}); 
*/
