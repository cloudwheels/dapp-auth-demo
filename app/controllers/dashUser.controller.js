//imports
const debug = require('debug')('server:debug');
const DashUser = require('../models/dashUser.model');
const DashConnection = require('../services/dashConnection.service');

exports.find = async (req, res, next) => {
  debug(`** Running Find User Middleware **`);
  try {
    const dashConnection = new DashConnection(
      'testnet',
      {},
      {},
      { service: '34.215.175.142:3000' },
    );
    await dashConnection.connect();
    let founduser = await DashUser.find(
      req.params.name,
      dashConnection,
    );
    await dashConnection.disconnect();
    if (founduser.success) {
      const dashUser = founduser.data;
      return res.status(200).json(dashUser.toJSON());
    } else {
      // TODO send 500s if error retreiving error
      // empty 200 if no matching user of that name
      return res.status(200).send({});
    }
  } catch (e) {
    //catch any other uncaught errors
    debug(`Caught otherwise uncaught error ${e}`);
    return res.status(500).json({ error: e });
  } finally {
    //close connection if there is one
    if (typeof dashConnection != 'undefined') {
      debug(`Finally: Closing dash connection`);
      dashConnection.disconnect();
      dashConnection = null;
    }
  }
};
