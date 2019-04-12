#!/usr/bin/env node

'use strict';

const path = require('path');

const Server = require('./Server');
const settings = require('env-smart').load({ lowercase: true, directory: path.join(__dirname, '../') });

const server = new Server(settings);

server.start();
