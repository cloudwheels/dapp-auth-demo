/**
 * middleware for route authorisation
 *
 */

const debug = require('debug')('server:debug');

const auth = function (req, res, next) {
  res.setHeader('Last-Modified', new Date().toUTCString());
  debug(`Auth request from ${req.path}`);
  if (req.session && req.session.user) {
    debug('pass');
    return next();
  } else {
    debug('fail');
    //return res.redirect('/login');
    return res.status(401).json({ error: 'Not authorised' });
  }
};

module.exports = auth;
