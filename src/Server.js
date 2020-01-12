'use strict';

const http = require('http');
const express = require('express');
const colors = require('simple-log-colors');

const logger = require('./logger')();
const { name, version } = require('../package.json');

class Server {

  constructor(settings) {

    settings = settings || {};

    if (typeof settings.verbose !== 'boolean') {
      settings.verbose = true;
    }

    if (typeof settings.port !== 'number') {
      settings.port = 80;
    }

    this.settings = settings;
  }

  log(...messages) {

    if (this.settings.verbose === true) {
      // eslint-disable-next-line no-console
      console.log(colors.blue(name), ...messages);
    }
  }

  start() {

    const { port } = this.settings;

    this.app = this.setup();

    this.server = http.createServer(this.app).listen(port, () => {
      console.log(`${name} ${version} live on port ${port} 👌`);
    });
  }

  stop() {

    this.server.close();

    this.server = null;
    this.app = null;
  }

  setup() {

    const app = express();

    // Log incoming requests, if verbose debug is enabled
    if (this.settings.verbose === true) {
      app.use(logger);
    }

    // Replace default branding
    app.use((request, response, next) => {
      response.setHeader('X-Powered-By', `${name} ${version}`);
      next();
    });

    // Serve our notice and all associated files
    app.use(express.static(`${__dirname}/public/`));

    // ..serve that notice for everything
    app.all('*', (request, response) => {
      response.status(200).sendFile('index.html', { root: `${__dirname}/public/` });
    });

    // Handle errors
    app.use((error, request, response, next) => {

      console.error(`${colors.red('Error')} ${request.connection.encrypted ? 'https' : 'http'} ${colors.blue(request.method)} ${request.url}`, error.message, error.stack);

      response.status(500).sendFile('index.html', { root: `${__dirname}/public` });
    });

    return app;
  }
}

module.exports = Server;
