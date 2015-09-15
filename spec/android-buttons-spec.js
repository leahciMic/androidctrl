'use strict';

var bluebird = require('bluebird');
var Android = require('../android.js');

describe('Android', function() {
  beforeEach(function() {
    spyOn(Android, 'adb').and.callFake(function() {
      return bluebird.resolve();
    });
  });

  describe('inputKeyEvent', function() {
    it('should send the right command', function() {
      Android.inputKeyEvent('5554', '45');
      expect(Android.adb).toHaveBeenCalledWith(
        '5554', 'shell input keyevent 45'
      );
    });

    it('should resolve with undefined', function(done) {
      Android.inputKeyEvent('5554', '45').then(function(res) {
        expect(res).toBeUndefined();
        done();
      });
    });
  });

  describe('helpers', function() {
    beforeEach(function() {
      spyOn(Android, 'inputKeyEvent');
    });

    it('should send correct keyCode for powerOn', function() {
      Android.powerOn('5554');
      expect(Android.inputKeyEvent).toHaveBeenCalledWith('5554', '26');
    });

    it('should send correct keyCode for unlock', function() {
      Android.unlock('5554');
      expect(Android.inputKeyEvent).toHaveBeenCalledWith('5554', '82');
    });
  });
});
