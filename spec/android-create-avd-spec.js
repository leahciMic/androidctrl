'use strict';

var bluebird = require('bluebird');
var proxyquire = require('proxyquire');

var ezspawnMock;
var Android;

var fakeEzspawnReturn = {
  code: 0,
  stdout: 'command completed',
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

  describe('adb', function() {
    it('should run the right command', function() {
      Android.createAVD('1', 'foobar');
      expect(ezspawnMock).toHaveBeenCalledWith(
        'android create avd -t 1 -a -c 500M -d "Nexus 5" -n "foobar"'
      );
    });

    it('should return result from ezspawn', function(done) {
      Android.createAVD('1', 'foobar').then(function(result) {
        expect(result).toBeUndefined();
        done();
      });
    });
  });
});
