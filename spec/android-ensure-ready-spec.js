var bluebird = require('bluebird');
var Android = require('../android.js');

var FAIL_COUNT;

describe('Android', function() {
  beforeEach(function() {
    var tries = 0;
    FAIL_COUNT = 0;

    spyOn(Android, 'waitForDevice').and.callFake(function() {
      return bluebird.resolve();
    });

    spyOn(Android, 'adb').and.callFake(function() {
      var obj = {
        stdout: ++tries > FAIL_COUNT ? '1' : '0'
      };
      return bluebird.resolve(obj);
    });
  });

  describe('ensureReady', function() {
    it('should waitForDevice', function() {
      Android.ensureReady('5554');
      expect(Android.waitForDevice).toHaveBeenCalledWith('5554');
    });

    it('should use correct command', function(done) {
      Android.ensureReady('5554').then(function(data) {
        expect(Android.adb).toHaveBeenCalledWith(
          '5554',
          'shell getprop sys.boot_completed'
        );
        done();
      });
    });

    it('should retry if not ready', function(done) {
      FAIL_COUNT = 2;
      Android.ensureReady('5554').then(function(data) {
        // fail twice, succeed on the third.
        expect(Android.adb.calls.count()).toEqual(3);
        done();
      });
    });

    it('should resolve with nothing', function(done) {
      Android.ensureReady('5554').then(function(data) {
        expect(data).toBeUndefined();
        done();
      });
    });
  });
});
