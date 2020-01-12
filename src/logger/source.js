//
//  Created by Jesse T Youngblood on 3/30/16
//  Copyright (c) 2019 Jesse T Youngblood. All rights reserved.
//

'use strict';

const dns = require('dns');

const cache = {};

function middleware(request, response, next) {

  let ip = request.connection.remoteAddress.replace('::ffff:', '');

  // If this was forwarded for something, us that IP instead
  if (request.headers.hasOwnProperty('x-forwarded-for')) {

    ip = request.headers['x-forwarded-for'];
    delete request.headers['x-forwarded-for'];
  }

  const source = {
    ip,
    host: reverseDNS(ip)
  };

  request.source = source;

  next();
}

function reverseDNS(ip) {

  if (cache.hasOwnProperty(ip)) {

    return cache[ip];
  }

  // Load the DNS information for next time
  dns.reverse(ip, (error, domains) => {

    if (error) {
      return;
    }

    if (domains.length > 0) {
      [cache[ip]] = domains;
    }
  });
}

module.exports = (options) => {

  return middleware;
};
