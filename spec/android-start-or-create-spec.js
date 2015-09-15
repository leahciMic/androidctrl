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
          'emulator: control console listening on port (5554), ADB on port 5555',
          '5554'
        ],
        line: 'emulator: control console listening on port (5554), ADB on port 5555'
      };

      return bluebird.resolve(obj);
    });

    Android = proxyquire('../android.js', {
      'spawn-wait-for': spawnWaitForMock
    });
  });

  describe('start', function() {
    it('should run the right command', function(done) {
      Android.start('foobar').then(function(result) {
        expect(spawnWaitForMock).toHaveBeenCalledWith(
          'emulator -verbose -avd "foobar" -no-boot-anim -no-skin',
          jasmine.any(RegExp)
        );
        done();
      });
    });

    it('should get the correct emulator id', function(done) {
      Android.start('foobar').then(function(result) {
        expect(result.id).toEqual('5554');
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
