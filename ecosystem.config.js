'use strict';

// http://pm2.keymetrics.io/docs/usage/application-declaration/

module.exports = {

  apps: [{

    name: 'brb',
    cwd: './',
    script: 'src/index.js',

    watch: true,
    ignore_watch: [
      '.git',
      '**/.DS_Store',
      'src/public'
    ]
  }]
};
