//
//  Created by Jesse T Youngblood on 9/13/18
//  Copyright (c) 2019 Jesse T Youngblood. All rights reserved.
//

'use strict';

const url = require('url');
const colors = require('simple-log-colors');

let settings;

function middleware(request, response, next) {

  const protocol = request.connection.encrypted ? 'https' : 'http';

  let message = `${colors.cyan(timeString())} ${protocol} ${colors.blue(request.method)} ${request.url}`;

  // This property is created by the 'source' middleware
  if (request.source !== undefined && request.source.ip !== '::1' && request.source.ip !== '127.0.0.1') {

    message += ` from ${request.source.ip}`;

    if (request.source.host !== undefined) {
      message += ` (${request.source.host})`;
    }
  }

  if (request.headers.referer !== undefined && request.connection.servername !== undefined) {

    const referrer = url.parse(request.headers.referer);

    if (referrer.hostname !== request.connection.servername) {

      message += ` referred by ${colors.yellow(request.headers.referer)}`;
    }
  }

  if (settings.headers === true) {

    const keys = Object.keys(request.headers);

    let headerString = '';

    keys.forEach((key, index) => {

      headerString += `${key}: "${request.headers[key]}"${index !== keys.length - 1 ? ', ' : ''}`;
    });

    message += ` ${colors.green('Headers')}: { ${headerString} }`;
  }

  if (settings.body === true && request.body !== undefined) {

    let bodyString = '';

    if (typeof request.body === 'string') {

      bodyString = request.body;

    } else if (typeof request.body === 'object') {

      try {

        bodyString = JSON.stringify(request.body);

      } catch (e) {

        bodyString = '[..]';
      }
    }

    message += ` ${colors.green('Body')}: ${bodyString}`;
  }

  // eslint-disable-next-line no-console
  console.log(message);

  next();
}

/**
* Output a string representing the current time
* @returns {string} - The current time, as a UTC string
*/
function timeString() {

  const time = new Date();

  const hours = time.getUTCHours();
  let minutes = time.getUTCMinutes();

  if (minutes === 0) {

    minutes = '00';

  } else if (minutes < 10) {

    minutes = `0${minutes}`;
  }

  const date = time.getUTCDate();
  const month = time.getUTCMonth() + 1;
  const year = time.getFullYear();

  return `${hours}:${minutes} ${month}/${date}/${year} UTC:`;
}

module.exports = options => {

  settings = options;

  return middleware;
};
