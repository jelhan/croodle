/* eslint-env node */
/* eslint-disable no-console */
'use strict';

const { copy, ensureDir, unlink } = require('fs-extra');
const { exec } = require('child_process');

const apiPath = 'api/';
const targets = [
  'composer.json',
  'composer.lock',
  'config.default.php',
  'cron.php',
  'index.php',
  'classes/',
  'utils/',
];

module.exports = {
  name: 'include-api-in-build',

  postBuild(result) {
    let outputPath = result.directory + '/api';

    return Promise.resolve()
      .then(() => {
        return ensureDir(outputPath);
      })
      .then(() => {
        return Promise.all(
          targets.map((target) => {
            return copy(`${apiPath}/${target}`, `${outputPath}/${target}`);
          })
        );
      })
      .then(() => {
        return new Promise((resolve, reject) => {
          exec('composer install --no-dev', {
            cwd: outputPath
          }, (err) => {
            if (err) {
              reject(err);
            }

            resolve();
          });
        });
      })
      .then(() => {
        return Promise.all([
          unlink(`${outputPath}/composer.json`),
          unlink(`${outputPath}/composer.lock`),
        ]);
      });
  }
};
