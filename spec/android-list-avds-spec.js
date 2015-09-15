'use strict';

var bluebird = require('bluebird');
var proxyquire = require('proxyquire');
var fs = require('fs');
var adbListAVDsFixture = fs.readFileSync(
  './spec/fixtures/adb-list-avds.txt',
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

  describe('listAVDs', function() {
    it('should run the right command', function() {
      Android.listAVDs();
      expect(ezspawnMock).toHaveBeenCalledWith(
        'android list avds'
      );
    });

    it('should return array of android avds', function(done) {
      Android.listAVDs().then(function(result) {
        expect(result).toEqual([
          {
            Name: 'Android511',
            Device: 'Nexus 5 (Google)',
            Path: '/Users/michael/.android/avd/Android511.avd',
            Target: 'Android 5.1.1 (API level 22)',
            'Tag/ABI': 'default/x86',
            Skin: '1080x1920',
            Sdcard: '500M'
          },
          {
            Name: 'Android600',
            Device: 'Nexus 5 (Google)',
            Path: '/Users/michael/.android/avd/Android600.avd',
            Target: 'Android 6.0.0 (API level 23)',
            'Tag/ABI': 'default/x86',
            Skin: '1080x1920',
            Sdcard: '500M'
          }
        ]);
        done();
      });
    });
  });
});
