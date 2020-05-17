/**
 * routes/index.js
 */
const path = require('path');
const debug = require('debug')('server:debug');
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
//const esmImport = require('esm')(module);
const DashUserController = require('../controllers/dashUser.controller');
const AuthRequestController = require('../controllers/auth-request.controller');
const TweetlistController = require('../controllers/tweetlist.controller');
const UserlistController = require('../controllers/userlist.controller');

/*
//staic index page will be sent

router.get('/', async (req, res) => {
  debug('requested route get /');
  return res.status(200).send({ welcome: 'HOME' });
});
*/

// API v1 Routes

router.get('/api/v1/user/:name', DashUserController.find);

router.post(
  '/api/v1/user/:name/signup-request',
  AuthRequestController.signup,
);
router.post(
  '/api/v1/user/:name/login-request',
  AuthRequestController.login,
);
router.post(
  '/api/v1/user/:name/tweet-request',
  AuthRequestController.tweet,
);

router.get(
  '/api/v1/user/:name/tweets',
  TweetlistController.tweetlist,
);
router.get('/api/v1/tweets', TweetlistController.tweetlist);
// Browser Session Routes
router.get('/api/v1/signups', UserlistController.userlist);

router.get('/auth/home', auth, async (req, res) => {
  debug('requested route get /auth/home (auth)');
  return res.status(200).send({ welcome: req.session.user });
  //res.end('<a href=' + '/logout' + '>Logout</a>');
});

router.get('/logout', async (req, res) => {
  debug('requested route get /logout');
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    return res.redirect('/logout-success');
  });
});

router.get('/logout-success', async (req, res) => {
  debug('requested route get /logout-success');
  return res.status(200).send({ logout: 'success' });
});

router.get('/authtest', auth, async (req, res) => {
  debug('requested route get /authtest (auth)');
  return res.json({ authorised: true });
});

// Other route requests and catch all

router.get('*.ico', function () {
  debug('requested .ico file (favicon)');
});

router.get('*.map', function () {
  debug('requested .map file (source map)');
});

router.all('*', async (req, res) => {
  // anything else - send custom 404 not found message
  debug('requested unknown route send 404');
  return res.status(404).send('Page Not Found');
});

module.exports = router;
