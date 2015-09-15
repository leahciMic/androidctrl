'use strict';

var bluebird = require('bluebird');
var proxyquire = require('proxyquire');
var fs = require('fs');
var adbListTargetFixture = fs.readFileSync('./spec/fixtures/adb-list-targets.txt', 'utf8');

var ezspawnMock;
var Android;

var fakeEzspawnReturn = {
  code: 0,
  stdout: adbListTargetFixture,
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

  describe('listTargets', function() {
    it('should run the right command', function() {
      Android.listAVDs();
      expect(ezspawnMock).toHaveBeenCalledWith(
        'android list avds'
      );
    });

    it('should return array of android target objects', function(done) {
      Android.listAVDs().then(function(result) {
        expect(result).toEqual([
          {
            id: '1 or "android-22"',
            Name: 'Android 5.1.1',
            Type: 'Platform',
            level: '22',
            Revision: '2',
            Skins: 'HVGA, QVGA, WQVGA400, WQVGA432, WSVGA, WVGA800 (default), WVGA854, WXGA720, WXGA800, WXGA800-7in',
          },
          {
            id: '2 or "android-23"',
            Name: 'Android 6.0.0',
            Type: 'Platform',
            level: '23',
            Revision: '2',
            Skins: 'HVGA, QVGA, WQVGA400, WQVGA432, WSVGA, WVGA800 (default), WVGA854, WXGA720, WXGA800, WXGA800-7in',
          },
        ]);
        done();
      });
    });
  });
});
