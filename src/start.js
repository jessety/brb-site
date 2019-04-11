'use strict';

const Server = require('./Server');
const settings = require('env-smart').load({ lowercase: true });

const server = new Server(settings);

server.start();
