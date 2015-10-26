'use strict';

var Android = require('../android.js');
var bluebird = require('bluebird');
var avds = [
  {
    Name: 'android-firefox',
    Device: 'Nexus 5 (Google)',
    Path: '/Users/michael/.android/avd/android-firefox.avd',
    Target: 'Android 5.1.1 (API level 22)',
    'Tag/ABI': 'default/x86',
    Skin: 'WVGA800',
    Sdcard: '500M'
  },
  {
    Name: 'Android511',
    Device: 'Nexus 5 (Google)',
    Path: '/Users/michael/.android/avd/Android511.avd',
    Target: 'Android 5.1.1 (API level 22)',
    'Tag/ABI': 'default/x86',
    Skin: 'WVGA800',
    Sdcard: '500M'
  }
];

describe('Android', function() {
  describe('hasAVD', function() {
    beforeEach(function() {
      spyOn(Android, 'listAVDs').and.callFake(function() {
        return bluebird.resolve(avds);
      });
    });

    it('should resolve to true if AVD exists', function(done) {
      Android.hasAVD('Android511').then(function(hasAVD) {
        expect(hasAVD).toEqual(true);
        done();
      });
    });

    it('should resolve to false if AVD does not exist', function(done) {
      Android.hasAVD('non-existant-avd').then(function(hasAVD) {
        expect(hasAVD).toEqual(false);
        done();
      });
    });
  });
});
