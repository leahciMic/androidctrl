'use strict';

var bluebird = require('bluebird');
var proxyquire = require('proxyquire');
var fs = require('fs');
var adbListAVDsFixture = fs.readFileSync(
  './spec/fixtures/adb-devices.txt',
   'utf8'
 );

var ezspawnMock;
var Android;

var fakeEzspawnReturn = {
  code: 0,
  stdout: adbListAVDsFixture,
  stderr: '',
};

describe('Android', function() {
  beforeEach(function() {
    ezspawnMock = jasmine.createSpy('ezspawnMock');

    ezspawnMock.and.callFake(function() {
      return bluebird.resolve(fakeEzspawnReturn);
    });

    Android = proxyquire('../android.js', {
      ezspawn: ezspawnMock,
    });
  });

  describe('devices', function() {
    it('should run the right command', function() {
      Android.devices();
      expect(ezspawnMock).toHaveBeenCalledWith(
        'adb devices'
      );
    });

    it('should return array of android avds', function(done) {
      Android.devices().then(function(result) {
        expect(result).toEqual([
          { name: 'emulator-5554', status: 'device' },
          { name: 'emulator-5555', status: 'device' },
          { name: 'emulator-5556', status: 'device' },
          { name: 'foobarserial', status: 'offline' },
        ]);
        done();
      });
    });
  });
});
