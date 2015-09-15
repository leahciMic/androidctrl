var proxyquire = require('proxyquire');
var bluebird = require('bluebird');

var ezspawnMock;
var Android;

var fakeEzspawnReturn = {
  code: 0,
  stdout: 'command completed',
  stderr: ''
};

describe('Android', function() {
  var fakeProcess;

  beforeEach(function() {
    ezspawnMock = jasmine.createSpy('ezspawnMock');

    ezspawnMock.and.callFake(function(cmd) {
      return bluebird.resolve(fakeEzspawnReturn);
    });

    Android = proxyquire('../android.js', {
      'ezspawn': ezspawnMock
    });
  });

  describe('adb', function() {
    it('should run the right command', function(done) {
      Android.adb('5554', 'foobar').then(function(result) {
        expect(ezspawnMock).toHaveBeenCalledWith(
          'adb -s 5554 foobar'
        );
        done();
      });
    });

    it('should return result from ezspawn', function(done) {
      Android.adb('5554', 'foobar').then(function(result) {
        expect(result).toEqual(fakeEzspawnReturn);
        done();
      });
    });
  });
});
