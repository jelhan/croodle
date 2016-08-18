# croodle

[![Build Status](https://travis-ci.org/jelhan/croodle.svg?branch=master)](https://travis-ci.org/jelhan/croodle)
[![Code Climate](https://codeclimate.com/github/jelhan/croodle/badges/gpa.svg)](https://codeclimate.com/github/jelhan/croodle)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/jelhan.svg)](https://saucelabs.com/u/jelhan)

Croodle is a web application to schedule a date or to do a poll on a general topics. Stored content data like title and description, number and labels of options and available answers and names of users and there selections is encrypted/decrypted in the browser using 256 bits AES.

This is an alpha version. Changes could brake backward compatibility. Also it is not well tested and some features are missing. It is not ment for productive use yet.

Croodle is inspired by [ZeroBin](https://github.com/elrido/ZeroBin) and of course by Doodle.

## Security notice

As any other web application based end-to-end encryption Croodle could be attacked by an injection of malicious code on serverside or threw a man-in-the-middle attack. If an attacker could inject for example JavaScript, he would be able to read decrypted content in the browser or the encryption key used and send it to a server under his controll.

Therefore you have to
* use an encrypted connection to the server hosting Croodle. In most use cases this will be an httpS connection. We strongly recomend people hosting Croodle to force an encrypted connection.
* trust the server.

You could check for an attack like this by analysing the source code retrieved from server and/or using developer tools of your browser and check what data is send over the network or stored in cookies, localStorage or similar browser techniques.

## Requirements

Croodle is designed to have as few as possible requirements on the server it is running on. Croodle runs on almost every web space with PHP >= 5.6. Croodle stores the data in textfiles, so there is no need for a database server like mySQL.

Due to security reasons you should have SSL encryption enabled and provide a valid certificate.

## Build process and installation

Production builds are provided [here](https://github.com/jelhan/croodle/releases).

If you like to build yourself you have to install node.js package management tool [npm](https://www.npmjs.org/), [bower](http://bower.io/), [ember-cli](http://www.ember-cli.com/) and [composer](https://getcomposer.org/) before.

```shell
git clone git@github.com:jelhan/croodle.git
cd croodle
npm install
bower install
cd api/ && composer install --no-dev && cd ..
ember build --prod
```

Afterwards copy all files in /dist folder to your werbserver.

### Configuration
Api could be configured by creating a `config.php` inside `api/` folder which returns an associative array.
Have a look at `api/config.default.php` for available options.

### Webserver configuration

* `data/` folder has to be writeable by web server, but **must not** be accessible publicy. Protect it in your webserver configuration or move it out of webroot by changing `dataDir` api option.
* Croodle uses [subresource integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) (SRI) for assets. Therefore you **must not** tamper with build output (e.g. you have to disable cloudflare [*Auto Minify*](https://support.cloudflare.com/hc/en-us/articles/200167996-Does-CloudFlare-have-HTML-JavaScript-and-CSS-compression-features-) feature). If that's not an option for you, you have to [disable SRI](https://github.com/jonathanKingston/ember-cli-sri#options) and build yourself.
* HTTPS connection should be forced. You should consider using [HTTP Strict Transport Security](https://developer.mozilla.org/en-US/docs/Web/Security/HTTP_strict_transport_security) (HSTS) and [HTTP Public Key Pinning](https://developer.mozilla.org/en-US/docs/Web/Security/Public_Key_Pinning) (HPKP).
* [Content-Security-Policy](http://content-security-policy.com/) (CSP) should be used. Default CSP headers are provided in `.htaccess` file but commented out.
* Execute `php api/cron.php` on a regular basis to delete outdated polls. A cronjob running once a day should be fine.

## Running tests

### Ember
Prefered way is to run tests against PhantomJS, Chrome and Firefox
by `ember test --server`. Results are reported in command-line and
browser.
Files are watched for changes.

If you only like to run tests ones against PhantomJS in command-line
you could use `ember test`. This is also used in CI.

### Api
Api tests are provided by Codeception. To run them change current
directory to `/api` and execute `./vendor/bin/codecept run`. You have
to install composer development requirements before (`composer install`
without `--no-dev` option).

## License

croodle is [MIT Licensed](https://github.com/jelhan/croodle/blob/master/LICENSE).
