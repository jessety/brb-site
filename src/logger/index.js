//
//  Created by Jesse Youngblood on 1/13/18 at 11:37
//  Copyright (c) 2019 Jesse T Youngblood. All rights reserved.
//

'use strict';

const source = require('./source');
const logger = require('./logger');

/**
 * Create the logger
 * @param {object} [options={}] Options for the logger
 */
function setup(options) {

  options = options || {};

  if (options.reverseDNS === false) {
    return logger(options);
  }

  // Unless reverse DNS lookups are explicitly disabled, use them.

  return [

    // Add the source IP / hostname to a request
    source(options),

    // Log all requests
    logger(options)
  ];
}

module.exports = setup;
