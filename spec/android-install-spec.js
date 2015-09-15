'use strict';

var bluebird = require('bluebird');
var fs = require('fs');

var adbInstallFailureFixture = fs.readFileSync(
  './spec/fixtures/adb-install-failure.txt', 'utf8'
);

var adbInstallSuccessFixture = fs.readFileSync(
  './spec/fixtures/adb-install-success.txt',
  'utf8'
);

var Android = require('../android.js');
var mockProcess;

describe('Android', function() {
  describe('install', function() {
    beforeEach(function() {
      mockProcess = {
        stdout: adbInstallSuccessFixture,
        stderr: '',
        code: 0,
      };
      spyOn(Android, 'adb').and.callFake(function() {
        return bluebird.resolve(mockProcess);
      });
    });

    it('should run the right command', function() {
      Android.install('5554', '/foo/bar/baz.apk', false);
      expect(Android.adb).toHaveBeenCalledWith(
        '5554', 'install /foo/bar/baz.apk'
      );
    });

    it('should run the right command with reinstall', function() {
      Android.install('5554', '/foo/bar/baz.apk', true);
      expect(Android.adb).toHaveBeenCalledWith(
        '5554', 'install -r /foo/bar/baz.apk'
      );
    });

    it('should resolve on success', function(done) {
      Android.install('5554', '/foo/bar/baz.apk').then(function(data) {
        expect(data).toBeUndefined();
        done();
      });
    });

    it('should reject on failure', function(done) {
      mockProcess.stdout = adbInstallFailureFixture;

      Android.install('5554', '/foo/bar/baz.apk').then(function() {
        fail('should not have resolved');
        done();
      }).catch(function(err) {
        expect(err.message).toEqual('Already installed');
        done();
      });
    });
  });
});
