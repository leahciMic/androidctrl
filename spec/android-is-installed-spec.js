'use strict';

var Android = require('../android.js');
var bluebird = require('bluebird');
var packages;

describe('Android', function() {
  describe('isIntalled', function() {
    beforeEach(function() {
      packages = [
        'com.android.providers.calendar',
        'com.android.providers.contacts',
      ];
      spyOn(Android, 'listPackages').and.callFake(function() {
        return bluebird.resolve(packages);
      })
    });

    it('should call listPackages', function() {
      Android.isInstalled('5554', 'foobar');
      expect(Android.listPackages).toHaveBeenCalledWith('5554');
    });

    it('should return true for an installed package', function(done) {
      Android.isInstalled('5554', 'com.android.providers.calendar').then(function(isInstalled) {
        expect(isInstalled).toEqual(true);
        done();
      });
    });

    it('should return false for a missing package', function(done) {
      Android.isInstalled('5554', 'com.android.test').then(function(isInstalled) {
        expect(isInstalled).toEqual(false);
        done();
      });
    });
  });
});
