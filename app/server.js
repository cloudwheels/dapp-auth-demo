/**
 * Imports app and starts a listening server
 */

const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, './config/.env'),
});
const debug = require('debug')('server:debug');
const app = require('./app.js');
require('dotenv').config();

app.listen(process.env.SERVER_PORT || 3000, () => {
  debug(`App Started on PORT ${process.env.SERVER_PORT || 3000}`);
});
