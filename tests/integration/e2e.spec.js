var SauceLabsConnector = require('../../lib/index');
var chai = require('chai');
var expect = chai.expect;

// Use this online tool to generate a valid platform configuration:
// https://wiki.saucelabs.com/display/DOCS/Platform+Configurator#/
var browserInfo = {
    platform:    'Windows 10',
    browserName: 'chrome',
    version:     'latest'
};

var pageUrl    = 'http://devexpress.github.io/testcafe/example';
var jobTimeout = 60; // in seconds
var jobOptions = {
    jobName: 'Sample tests',
    build:   'build-1234',
    tags:    ['tag1', 'tag2', 'tag3']
};


var saucelabsConnector = new SauceLabsConnector(process.env.SAUCE_USERNAME, process.env.SAUCE_ACCESS_KEY);
var saucelabsBrowser   = null;

/* eslint-disable no-console */
var exitOnError = function (err) {
    console.log(err);
    process.exit(1); // eslint-disable-line no-process-exit
};

describe('e2e', function () { // eslint-disable-line no-undef
    it('complete flow', function (done) { // eslint-disable-line no-undef
        // Connects the local machine to SauceLabs
        console.log('Starting tunnel');
        saucelabsConnector
        .connect()
        .then(function () {
            // Use the waitForFreeMachines method to ensure that the required number of machines is available.
            var machineCount    = 3;     // the required number of machines.
            var requestInterval = 30000; // the request delay in milliseconds.
            var maxAttemptCount = 5;     // the maximum number of attempts.

            return saucelabsConnector.waitForFreeMachines(machineCount, requestInterval, maxAttemptCount);
        })
	.catch(exitOnError)
        .then(function () {
            // Starts a remote browser on SauceLabs with the specified url.
            // jobOptions and jobTimeout are optional arguments.
            console.log('Starting browser');
            return saucelabsConnector.startBrowser(browserInfo, pageUrl, jobOptions, jobTimeout);
        })
        .catch(exitOnError)
        .then(function (browser) {
            saucelabsBrowser = browser;
            // Do some work with the browser
            console.log('Getting browser title');
            return browser.title();
        })
	.catch(exitOnError)
	.then(function (title) {
            expect(title).to.equal('TestCafe Example Page'); // eslint-disable-line indent
            return new Promise(function (resolve) { // eslint-disable-line indent
                setTimeout(resolve, 1500);
            });
	})
	.catch(exitOnError)
        .then(function () {
            // Closes the browser
            console.log('Stopping browser');
            return saucelabsConnector.stopBrowser(saucelabsBrowser);
        })
	.catch(exitOnError)
        .then(function () {
            console.log('Disconnecting tunnel');
            return saucelabsConnector.disconnect();
        })
	.catch(exitOnError)
	.then(function () {
            done(); // eslint-disable-line indent
	});
    });
});
