// imports
const debug = require('debug')('server:debug');
const AuthRequest = require('dashmachine-auth-request');
const Options = require('../config/options');
const TweetDocument = require('../models/tweetDocument.model');
const DashConnection = require('../services/dashConnection.service');
const Tweet = require('../models/tweet.model');

// TODO: factor code for common operations
// TODO: get vendor data from .env
const tempDappName = 'Web dApp Sample';

const vendorMnemonic =
  'uniform analyst paper father soldier toe lesson fetch exhaust jazz swim response';
const vendorUsername = 'alice';
const vendorUserId = 'Aobc5KKaA4ZqzP7unc6WawQXQEK2S3y6EwrmvJLLn1ui';
const vendorIdenityId =
  'CheZBPQHztvLNqN67i4KxcTU1XmDz7qG85X1XeJbc7K5';
const vendorPublicKey =
  'A0/qSE6tis4l6BtQlTXB2PHW+WV+Iy0rpF5hAvX8hDRz';
const vendorPrivateKey =
  '40148175614f062fb0b4e5c519be7b6f57b872ebb55ea719376322fd12547bff';
const vendorObj = {
  name: vendorUsername,
  id: vendorUserId,
  identityId: vendorIdenityId,
  identity: {
    id: vendorIdenityId,
    publicKeys: [
      {
        id: 0,
        type: 0,
        data: vendorPublicKey,
        isEnabled: true,
      },
    ],
    balance: 9686447,
  },
  publicKey: vendorPublicKey,
  privateKey: vendorPrivateKey,
};

exports.login = async (req, res, next) => {
  debug(`** Running Auth Request Middleware **`);
  try {
    const pin = req.body.pin;
    debug(`PIN submnitted: ${pin}`);
    let requestedName = req.params.name;

    debug(`Attempting login for ${requestedName}`);

    loginRequest = new AuthRequest(
      2,
      requestedName,
      pin,
      vendorUsername,
      vendorMnemonic,
      tempDappName,
      Options.options,
    );

    loginRequest.vendor = vendorObj;

    let enduser,
      createdDoc,
      submittedDoc,
      foundResponses,
      verifiedRequest;
    try {
      await loginRequest.connect();
      enduser = await loginRequest.findEnduser();
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    if (!enduser.success) {
      return res
        .status(401)
        .json({ error: `Unable to find user ${requestedName}` });
    }

    try {
      createdDoc = await loginRequest.create();
      console.log(`createdDoc:${JSON.stringify(createdDoc)}`);
    } catch (e) {
      console.log(`createdDoc ERROR:${e}`);
      return res.status(400).json({ error: e.message });
    }
    if (createdDoc.success) {
      try {
        submittedDoc = await loginRequest.submit();
        console.log(`submittedDoc:${JSON.stringify(submittedDoc)}`);
      } catch (e) {
        console.log(`submittedDoc ERROR:${e}`);
        return res.status(400).json({ error: e.message });
      }
    }

    if (submittedDoc.success) {
      try {
        foundResponses = await loginRequest.findResponses();
        console.log(
          `foundResponses:${JSON.stringify(foundResponses)}`,
        );
      } catch (e) {
        console.log(`foundResponses ERROR:${e}`);
        return res.status(400).json({ error: e.message });
      }
    }
    if (foundResponses.success) {
      try {
        verifiedRequest = await loginRequest.verify();
        console.log(
          `verifiedRequest:${JSON.stringify(verifiedRequest)}`,
        );
      } catch (e) {
        console.log(`verifiedRequest ERROR:${e}`);
        return res.status(400).json({ error: e.message });
      }
    }
    if (verifiedRequest.success) {
      console.log(`Login Success!!!`);
      req.session.user = requestedName;
      return res.status(200).json(verifiedRequest);
    } else {
      console.log(`Login Failed`);
      return res
        .status(401)
        .json({ error: 'Unable to complete authorisation' });
    }
  } catch (e) {
    debug(`Login Error: ${e}`);
    return res.status(400).json({ error: e.message });
  } finally {
    await loginRequest.disconnect();
  }
};

exports.signup = async (req, res, next) => {
  debug(`** Running Auth Request Middleware **`);
  try {
    const pin = req.body.pin;
    debug(`PIN submnitted: ${pin}`);
    let requestedName = req.params.name;

    debug(`Attempting signup for ${requestedName}`);

    signupRequest = new AuthRequest(
      1,
      requestedName,
      pin,
      vendorUsername,
      vendorMnemonic,
      tempDappName,
      Options.options,
    );
    signupRequest.vendor = vendorObj;

    let enduser,
      createdDoc,
      submittedDoc,
      foundResponses,
      verifiedRequest;
    try {
      await signupRequest.connect();
      enduser = await signupRequest.findEnduser();
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    if (!enduser.success) {
      return res
        .status(401)
        .json({ error: `Unable to find user ${requestedName}` });
    }

    try {
      createdDoc = await signupRequest.create();
      console.log(`createdDoc:${JSON.stringify(createdDoc)}`);
    } catch (e) {
      console.log(`createdDoc ERROR:${e}`);
      return res.status(400).json({ error: e.message });
    }
    if (createdDoc.success) {
      try {
        submittedDoc = await signupRequest.submit();
        console.log(`submittedDoc:${JSON.stringify(submittedDoc)}`);
      } catch (e) {
        console.log(`submittedDoc ERROR:${e}`);
        return res.status(400).json({ error: e.message });
      }
    }

    if (submittedDoc.success) {
      try {
        foundResponses = await signupRequest.findResponses();
        console.log(
          `foundResponses:${JSON.stringify(foundResponses)}`,
        );
      } catch (e) {
        console.log(`foundResponses ERROR:${e}`);
        return res.status(400).json({ error: e.message });
      }
    }
    if (foundResponses.success) {
      try {
        verifiedRequest = await signupRequest.verify();
        console.log(
          `verifiedRequest:${JSON.stringify(verifiedRequest)}`,
        );
      } catch (e) {
        console.log(`verifiedRequest ERROR:${e}`);
        return res.status(400).json({ error: e.message });
      }
    }
    if (verifiedRequest.success) {
      console.log(`Signup Success!!!`);
      // TODO : should this also act as a login?
      req.session.user = requestedName;

      //create and submit a new signup document

      // TODO: use temp_timeampe as the date
      const signupTimestamp =
        verifiedRequest.data.submittedDoc.data.temp_timestamp;
      debug(`signupTimestamp: ${signupTimestamp}`);
      const signupTimestampDate = signupTimestamp.substr(0, 14);
      debug(`signupTimestampDate: ${signupTimestampDate}`);
      const signupAuthReponseId =
        verifiedRequest.data.validResponseData.responseDocId;
      debug(`signupAuthReponseId: ${signupAuthReponseId}`);

      // TODO: Ho wdo we endure the message has't been changed?
      // for rnow - use te original message

      const signupObj = {
        username: requestedName,
        authref: signupAuthReponseId,
        temp_timestamp: signupTimestampDate,
      };

      debug(`creating New Signup Document`);

      const signupdoc = new TweetDocument(
        'tweetContract.signups',
        null,
        signupRequest.vendor.identityId,
        signupObj,
      );

      // TODO: Rework this

      const signupConnection = new DashConnection(
        'testnet',
        vendorMnemonic,
        Options.options.connection.apps,
        Options.options.connection.seeds,
      );
      await signupConnection.connect();
      const signupSubmitted = await signupdoc.submit(
        signupConnection,
      );
      signupConnection.disconnect();

      try {
        if (signupSubmitted.success) {
          debug(
            `successfully submitted signup Document: ${JSON.stringify(
              signupSubmitted.data.create[0],
            )} `,
          );
          return res
            .status(200)
            .json({ success: true, data: signupSubmitted.data.create[0] });
        } else {
          debug(`unknown error submitting Tweet Document `);
          return res
            .status(400)
            .json({ error: 'unknwon error submitting signup' });
        }
      } catch (e) {
        debug(
          `error submitting signup Document: ${JSON.stringify(e)} `,
        );
        return res.status(400).json({ error: e });
      }
    } else {
      console.log(`Signup Failed`);
      return res
        .status(401)
        .json({ error: 'Unable to complete authorisation' });
    }
  } catch (e) {
    debug(`Signup Error: ${e}`);
    return res.status(400).json({ error: e.message });
  } finally {
    await signupRequest.disconnect();
  }
};

exports.tweet = async (req, res, next) => {
  debug(`** Running Auth Request Middleware **`);
  try {
    const pin = req.body.pin;
    debug(`PIN submnitted: ${pin}`);
    let requestedName = req.params.name;

    const tweet = req.body.tweet;

    debug(`Attempting tweet for ${requestedName}`);

    tweetRequest = new AuthRequest(
      3,
      requestedName,
      pin,
      vendorUsername,
      vendorMnemonic,
      tempDappName,
      Options.options,
      tweet,
    );

    tweetRequest.vendor = vendorObj;

    let enduser,
      createdDoc,
      submittedDoc,
      foundResponses,
      verifiedRequest;
    try {
      await tweetRequest.connect();
      enduser = await tweetRequest.findEnduser();
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    if (!enduser.success) {
      return res
        .status(401)
        .json({ error: `Unable to find user ${requestedName}` });
    }

    try {
      createdDoc = await tweetRequest.create();
      console.log(`createdDoc:${JSON.stringify(createdDoc)}`);
    } catch (e) {
      console.log(`createdDoc ERROR:${e}`);
      return res.status(400).json({ error: e.message });
    }
    if (createdDoc.success) {
      try {
        submittedDoc = await tweetRequest.submit();
        console.log(`submittedDoc:${JSON.stringify(submittedDoc)}`);
      } catch (e) {
        console.log(`submittedDoc ERROR:${e}`);
        return res.status(400).json({ error: e.message });
      }
    }

    if (submittedDoc.success) {
      try {
        foundResponses = await tweetRequest.findResponses();
        console.log(
          `foundResponses:${JSON.stringify(foundResponses)}`,
        );
      } catch (e) {
        console.log(`foundResponses ERROR:${e}`);
        return res.status(400).json({ error: e.message });
      }
    }
    if (foundResponses.success) {
      try {
        verifiedRequest = await tweetRequest.verify();
        console.log(
          `verifiedRequest:${JSON.stringify(verifiedRequest)}`,
        );
      } catch (e) {
        console.log(`verifiedRequest ERROR:${e}`);
        return res.status(400).json({ error: e.message });
      }
    }
    if (verifiedRequest.success) {
      console.log(`Auth Success!!!`);
      // TODO : should this also act as a login?
      req.session.user = requestedName;

      //create and submit a new tweet document

      // TODO: use temp_timeampe as the date
      const tweetTimestamp =
        verifiedRequest.data.submittedDoc.data.temp_timestamp;
      debug(`tweetTimestamp: ${tweetTimestamp}`);
      const tweetTimestampDate = tweetTimestamp.substr(0, 14);
      debug(`tweetTimestampDate: ${tweetTimestampDate}`);
      const tweetAuthReponseId =
        verifiedRequest.data.validResponseData.responseDocId;
      debug(`tweetAuthReponseId: ${tweetAuthReponseId}`);

      // TODO: Ho wdo we endure the message has't been changed?
      // for rnow - use te original message

      const tweetObj = new Tweet(
        tweetTimestamp,
        requestedName,
        tweetAuthReponseId,
        tweet,
        tweetTimestampDate,
      );
      debug(`created new Tweet: ${JSON.stringify(tweetObj)}`);
      debug(`creating New Tweet Document`);

      const tweetdoc = new TweetDocument(
        'tweetContract.tweet',
        null,
        tweetRequest.vendor.identityId,
        JSON.parse(tweetObj.toJSON()),
      );

      // TODO: Rework this

      const tweetConnection = new DashConnection(
        'testnet',
        vendorMnemonic,
        Options.options.connection.apps,
        Options.options.connection.seeds,
      );
      await tweetConnection.connect();
      const tweetSubmitted = await tweetdoc.submit(tweetConnection);
      tweetConnection.disconnect();

      try {
        if (tweetSubmitted.success) {
          debug(
            `successfully submitted Tweet Document: ${JSON.stringify(
              tweetSubmitted.data.create[0],
            )} `,
          );
          return res
            .status(200)
            .json({ success: true, data: tweetSubmitted.data.create[0] });
        } else {
          debug(`unknown error submitting Tweet Document `);
          return res
            .status(400)
            .json({ error: 'unknwon error submitting tweet' });
        }
      } catch (e) {
        debug(
          `error submitting Tweet Document: ${JSON.stringify(e)} `,
        );
        return res.status(400).json({ error: e });
      }
    } else {
      console.log(`Login Failed`);
      return res
        .status(401)
        .json({ error: 'Unable to complete authorisation' });
    }
  } catch (e) {
    debug(`Login Error: ${e}`);
    return res.status(400).json({ error: e.message });
  } finally {
    await tweetRequest.disconnect();
  }
};
