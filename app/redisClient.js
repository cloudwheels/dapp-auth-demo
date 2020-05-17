/**
 * Exports a redis client
 */

const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, './config/.env'),
});
const debug = require('debug')('server:debug');
const redis = require('redis');

// set in .env
const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = process.env.REDIS_PORT || 6379;
const redisAuth = process.env.REDIS_AUTH || '';
debug(`redisHost: ${redisHost}`);
debug(`redisPort: ${redisPort}`);
debug(`redisAuth: ${redisAuth}`);

const redisClient = redis.createClient({
  port: redisPort,
  host: redisHost,
});
debug(`redis client created: ${redisClient}`);

redisClient.auth(redisAuth, function (err, response) {
  debug(`Authorising redis client`);
  if (err) {
    throw `redis Auth error: ${err}`;
  }
  debug(`Redis client authorised: ${response}`);
});

module.exports = {
  client: redisClient,
  close: function closeInstance(callback) {
    redisClient.quit(callback);
  },
};
