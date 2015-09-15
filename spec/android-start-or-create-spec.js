var bluebird = require('bluebird');
var Android = require('../android.js');

describe('Android', function() {
  beforeEach(function() {
    spyOn(Android, 'adb').and.callFake(function() {
      return bluebird.resolve('some fake data');
    });
  });

  describe('waitForDevice', function() {
    it('should run the right command', function() {
      Android.waitForDevice('5554');
      expect(Android.adb).toHaveBeenCalledWith('5554', 'wait-for-device');
    });

    it('should resolve with nothing', function(done) {
      Android.waitForDevice('5554').then(function(data) {
        expect(data).toBeUndefined();
        done();
      });
    });
  });
});
