/**
 * app.js
 *
 * @description: Main app
 */

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const RedisStore = require('connect-redis')(session);
const path = require('path');
const debug = require('debug')('server:debug');
require('dotenv').config({
  path: path.resolve(__dirname, './config/.env'),
});
//import { v4 as uuidv4 } from 'uuid';
/*
const UUID = require('uuid');
const uuidv4 = UUID.v4
*/

const app = express();

const isTest = process.env.NODE_ENV === 'test';
debug(`Test env?: ${isTest}`);

// TODO: move session stuff to a module
let store;

// only configue store if not a test env
// otherwise use a mock in tests
if (!isTest) {
  //if redis connection env vars use those
  //else default to Memeory Store as session store
  if (!process.env.REDIS_HOST && !process.env.REDIS_PORT) {
    let MemoryStore = require('memorystore')(session);
    let store = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  } else {
    let redisClient = require('./redisClient');
    // create new redis store
    let store = new RedisStore({
      port: process.env.REDIS_PORT || 6379,
      host: process.env.REDIS_HOST || '127.0.0.1',
      client: redisClient.client,
      ttl: 260,
    });
  }
}

app.use(
  session({
    /*
    genid: function (req) {
      return uuidv4(); // use UUIDs for session IDs
    },
    */
    secret: 'secret',
    store: store,
    saveUninitialized: false,
    resave: false,
  }),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('root', `${__dirname}/..`);

//app.set('views', path.join(__dirname, './views'));
/*
GRRRR - Don't do this... Serves a static index file eveytime to home page
app.use(express.static(path.join(__dirname, './views'), {
        etag: false
}));
*/

//app.set('etag', false);

app.use(express.static(path.join(__dirname, 'static')));

const routes = require('./routes');
app.use('/', routes);

module.exports = app;
