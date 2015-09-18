'use strict';

var proxyquire = require('proxyquire');
var bluebird = require('bluebird');
var fs = require('fs');

var fsMock = jasmine.createSpyObj('fsMock', [
  'readFileSync',
  'writeFileSync'
]);

var configFixture = fs.readFileSync(
  './spec/fixtures/config.ini', 'utf8'
);

fsMock.readFileSync.and.returnValue(configFixture);

var Android = proxyquire('../android.js', {
  fs: fsMock
});

describe('Android', function() {
  describe('setHardwareOptions', function() {
    beforeEach(function() {
      spyOn(Android, 'listAVDs').and.callFake(function() {
        var avds = [{
          Name: 'foobar',
          Device: 'Nexus 5 (Google)',
          Path: '/Users/michael/.android/avd/Android511.avd',
          Target: 'Android 5.1.1 (API level 22)',
          'Tag/ABI': 'default/x86',
          Skin: '1080x1920',
          Sdcard: '500M'
        }, {
          Name: 'foobar1'
        }];

        return bluebird.resolve(avds);
      });
    });

    it('should bail if avd does not exist', function(done) {
      Android.setHardwareOptions('fakeAVD', {})
        .then(function() {
          fail('expected to fail');
          done();
        })
        .catch(function(err) {
          expect(err.message).toEqual('avd fakeAVD could not be found');
          done();
        });
    });

    it('should read right file', function(done) {
      Android.setHardwareOptions('foobar', {}).then(function() {
        expect(fsMock.readFileSync).toHaveBeenCalledWith(
          '/Users/michael/.android/avd/Android511.avd/config.ini',
          'utf8'
        );
        done();
      });
    });

    it('should change the config correctly', function(done) {
      Android.setHardwareOptions('foobar', {
        'hw.gpu.enabled': 'yes'
      }).then(function() {
        expect(fsMock.writeFileSync).toHaveBeenCalledWith(
          '/Users/michael/.android/avd/Android511.avd/config.ini',
          configFixture.replace('hw.gpu.enabled=no', 'hw.gpu.enabled=yes')
        );
        done();
      });
    });
  });
});
