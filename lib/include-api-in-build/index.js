/* eslint-env node */
/* eslint-disable no-console */
'use strict';

let fse = require('fs-extra');
let child_process = require('child_process');
let RSVP = require('rsvp');

let { copy, ensureDirSync, remove } = fse;
let { exec } = child_process;
let { Promise } = RSVP;

const apiPath = 'api/';
const targets = [
  'composer.json',
  'composer.lock',
  'config.default.php',
  'cron.php',
  'index.php',
  'classes/',
  'utils/'
];

module.exports = {
  name: 'include-api-in-build',

  isDevelopingAddon() {
    return true;
  },

  postBuild(result) {
    console.time('include-api');
    return new RSVP.Promise(function(resolve, reject) {
      let outputPath = result.directory + '/api';
      ensureDirSync(outputPath);

      let copyPromises = targets.map((target) => {
        return copy(apiPath + '/' + target, outputPath + '/' + target);
      });

      Promise.all(copyPromises).then(() => {
        exec('composer install --no-dev', {
          cwd: outputPath
        }, (err) => {
          if (err) {
            reject(err);
          }
          Promise.all([
            remove(outputPath + 'composer.json'),
            remove(outputPath + 'composer.lock')
          ]).then(() => {
            console.timeEnd('include-api');
            resolve();
          }).catch(reject);
        });
      }).catch(reject);
    });
  }
};
