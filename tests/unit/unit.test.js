const path = require('path');
const DashUser = require('../../app/models/dashUser.model');
const DashAccount = require('../../app/models/dashAccount.model');
const DataDocument = require('../../app/models/dataDocument.model');
const LoginDocument = require('../../app/models/loginDocument.model');

const DashConnection = require('../../app/services/dashConnection.service');

describe('DashUser model', () => {
  it('Instantiates a new DashUser', async () => {
    const dashUser = new DashUser();
    expect(dashUser).toBeDefined();
  });
  it('Has a name property', async () => {
    const dashUser = new DashUser();
    dashUser.name = 'testuser';
    expect(dashUser.name).toBeDefined();
    expect(dashUser.name).toBe('testuser');
  });
});

describe('DataDocument model', () => {
  /*
    let dataDocument;
    beforeAll(function () {
        let dataDocument = new DataDocument('CONTRACTABC', 'OWNER123', {content: "data"});
     });
     */
  it('Instantiated a new DataDocument', async () => {
    let dataDocument = new DataDocument('CONTRACTABC', 'OWNER123', {
      content: 'data',
    });
    expect(dataDocument).toBeDefined();
  });
  it('Has a contractId property', async () => {
    let dataDocument = new DataDocument('CONTRACTABC', 'OWNER123', {
      content: 'data',
    });
    expect(dataDocument.contractId).toBe('CONTRACTABC');
  });
  it('Can set and get contractId property', async () => {
    let dataDocument = new DataDocument('CONTRACTABC', 'OWNER123', {
      content: 'data',
    });
    dataDocument.contractId = 'CONTRACTDEF';
    expect(dataDocument.contractId).toBe('CONTRACTDEF');
  });
  it('Has an ownerId property', async () => {
    let dataDocument = new DataDocument('CONTRACTABC', 'OWNER123', {
      content: 'data',
    });
    expect(dataDocument.ownerId).toBe('OWNER123');
  });
  it('Can set and get ownerId property', async () => {
    let dataDocument = new DataDocument('CONTRACTABC', 'OWNER123', {
      content: 'data',
    });
    dataDocument.ownerId = 'OWNER456';
    expect(dataDocument.ownerId).toBe('OWNER456');
  });
  it('Has an data property', async () => {
    let dataDocument = new DataDocument('CONTRACTABC', 'OWNER123', {
      content: 'data',
    });
    expect(dataDocument.data).toStrictEqual({ content: 'data' });
  });
  it('Can set and get data property', async () => {
    let dataDocument = new DataDocument('CONTRACTABC', 'OWNER123', {
      content: 'data',
    });
    dataDocument.data = { newcontent: 'newdata' };
    expect(dataDocument.data).toStrictEqual({
      newcontent: 'newdata',
    });
  });
});

describe('LoginDocument model', () => {
  /*
    let loginDocument;
    beforeAll(function () {
        let loginDocument = new LoginDocument('CONTRACTABC', 'OWNER123', {content: "data"});
     });
     */
  it('Instantiated a new LoginDocument', async () => {
    let loginDocument = new LoginDocument('CONTRACTABC', 'OWNER123', {
      content: 'data',
    });
    expect(loginDocument).toBeDefined();
  });
  it('Has a contractId property', async () => {
    let loginDocument = new LoginDocument('CONTRACTABC', 'OWNER123', {
      content: 'data',
    });
    expect(loginDocument.contractId).toBe('CONTRACTABC');
  });
  it('Can set and get contractId property', async () => {
    let loginDocument = new LoginDocument('CONTRACTABC', 'OWNER123', {
      content: 'data',
    });
    loginDocument.contractId = 'CONTRACTDEF';
    expect(loginDocument.contractId).toBe('CONTRACTDEF');
  });
  it('Has an ownerId property', async () => {
    let loginDocument = new LoginDocument('CONTRACTABC', 'OWNER123', {
      content: 'data',
    });
    expect(loginDocument.ownerId).toBe('OWNER123');
  });
  it('Can set and get ownerId property', async () => {
    let loginDocument = new LoginDocument('CONTRACTABC', 'OWNER123', {
      content: 'data',
    });
    loginDocument.ownerId = 'OWNER456';
    expect(loginDocument.ownerId).toBe('OWNER456');
  });
  it('Has an data property', async () => {
    let loginDocument = new LoginDocument('CONTRACTABC', 'OWNER123', {
      content: 'data',
    });
    expect(loginDocument.data).toStrictEqual({ content: 'data' });
  });
  it('Can set and get data property', async () => {
    let loginDocument = new LoginDocument('CONTRACTABC', 'OWNER123', {
      content: 'data',
    });
    loginDocument.data = { newcontent: 'newdata' };
    expect(loginDocument.data).toStrictEqual({
      newcontent: 'newdata',
    });
  });
});

describe('DashAccount model', () => {
  it('Instantiates a new DashAccount', async () => {
    const dashAccount = new DashAccount();
    expect(dashAccount).toBeDefined();
  });
  it('Has a mnemonic property', async () => {
    const dashAccount = new DashAccount();
    dashAccount.mnemonic = 'testuser';
    expect(dashAccount.mnemonic).toBeDefined();
    expect(dashAccount.mnemonic).toBe('testuser');
  });
});
