'use strict';

var proxyquire = require('proxyquire');
var bluebird = require('bluebird');
var spawnWaitForMock;
var Android;

describe('Android', function() {
  var fakeProcess;

  beforeEach(function() {
    spawnWaitForMock = jasmine.createSpy('spwanWaitForMock');

    spawnWaitForMock.and.callFake(function(cmd) {
      var obj = {
        process: fakeProcess = {},
        matches: [
          'emulator: Serial number of this emulator (for ADB): emulator-5554',
          '5554',
        ],
        line: 'emulator: Serial number of this emulator (for ADB): emulator-5554',
      };

      return bluebird.resolve(obj);
    });

    Android = proxyquire('../android.js', {
      'spawn-wait-for': spawnWaitForMock,
    });
  });

  describe('start', function() {
    it('should run the right command', function(done) {
      Android.start('foobar').then(function(result) {
        expect(spawnWaitForMock).toHaveBeenCalledWith(
          'emulator -verbose -avd "foobar"',
          jasmine.any(RegExp)
        );
        done();
      });
    });

    it('should get the correct emulator id', function(done) {
      Android.start('foobar').then(function(result) {
        expect(result.id).toEqual('emulator-5554');
        done();
      });
    });

    it('should get the process object back', function(done) {
      Android.start('foobar').then(function(result) {
        expect(result.process).toEqual(fakeProcess);
        done();
      });
    });
  });
});
