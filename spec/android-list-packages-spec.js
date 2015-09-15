'use strict';

var bluebird = require('bluebird');
var proxyquire = require('proxyquire');
var fs = require('fs');
var adbListAVDsFixture = fs.readFileSync(
  './spec/fixtures/adb-shell-pm-list-packages.txt',
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

  describe('listPackages', function() {
    it('should run the right command', function() {
      Android.listPackages('5554');
      expect(ezspawnMock).toHaveBeenCalledWith(
        'adb -s 5554 shell pm list packages'
      );
    });

    it('should return array of android target objects', function(done) {
      Android.listPackages('5554').then(function(result) {
        expect(result).toEqual([
          'com.android.smoketest',
          'com.example.android.livecubes',
          'com.android.providers.telephony',
          'com.android.providers.calendar',
          'com.android.providers.media',
          'com.android.protips',
          'com.android.launcher',
          'com.android.documentsui',
          'com.android.gallery',
          'com.android.externalstorage',
          'com.android.htmlviewer',
          'com.android.quicksearchbox',
          'com.android.mms.service',
          'com.android.providers.downloads',
          'com.android.browser',
          'com.android.soundrecorder',
          'com.android.defcontainer',
          'com.android.providers.downloads.ui',
          'com.android.pacprocessor',
          'com.android.certinstaller',
          'com.android.speechrecorder',
          'android',
          'com.android.contacts',
          'com.android.mms',
          'com.android.backupconfirm',
          'com.android.calendar',
          'com.android.providers.settings',
          'com.android.sharedstoragebackup',
          'com.android.printspooler',
          'com.android.dreams.basic',
          'com.android.webview',
          'com.android.inputdevices',
          'com.android.sdksetup',
          'com.android.development_settings',
          'com.android.server.telecom',
          'com.android.keychain',
          'com.android.camera',
          'com.android.dialer',
          'com.android.emulator.smoketests',
          'com.android.packageinstaller',
          'com.svox.pico',
          'com.example.android.apis',
          'com.android.proxyhandler',
          'com.android.fallback',
          'com.android.inputmethod.latin',
          'com.android.managedprovisioning',
          'com.android.wallpaper.livepicker',
          'com.android.netspeed',
          'jp.co.omronsoft.openwnn',
          'com.android.settings',
          'com.android.calculator2',
          'com.android.gesture.builder',
          'com.android.vpndialogs',
          'com.android.email',
          'com.android.music',
          'com.android.phone',
          'com.android.shell',
          'com.android.providers.userdictionary',
          'com.android.location.fused',
          'com.android.deskclock',
          'com.android.systemui',
          'com.android.exchange',
          'com.android.smoketest.tests',
          'com.android.customlocale2',
          'com.example.android.softkeyboard',
          'com.android.development',
          'com.android.providers.contacts',
          'com.android.captiveportallogin',
          'com.android.widgetpreview',
        ]);
        done();
      });
    });
  });
});
