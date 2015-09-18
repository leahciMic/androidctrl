# androidctrl [![Build Status](https://travis-ci.org/leahciMic/androidctrl.svg?branch=master)](https://travis-ci.org/leahciMic/androidctrl)

Node module for managing and controlling Android devices and emulators.

## Install

```sh
npm install --save androidctrl
```

## API

### start(avdName)

Start the emulator using the AVD supplied through with `avdName`. Returns a
promise that is resolved with an object that has the following properties.

```js
{
  id: String, // The ID of the emulator
  process: Object // The child_process object
}
```

### waitForDevice(deviceId)

Return a promise that will be resolved when the device specified with `deviceId`
is ready (adb daemon is running).

### ensureReady(deviceId)

Resolves a promise when the device with the id `deviceId` has completed its
boot process.

### adb(deviceId, cmd)

Run an adb command on the device with the id `deviceId`, and resolve to an
object containing the following:

```js
{
    code: Number, // the exit code of the process,
    stdout: String, // The captured stdout
    stderr: String // The captured stderr
}
```

## createAVD(targetId, name, hardwareOptions)

Create an AVD based upon `targetId` (from `listTargets`). Returns a promise
that will be resolved when the AVD has finished being created.

## listTargets

Resolves to an array of Android target objects that can be used with createAVD.

The array looks like:
```js
[
  {
    id: '1 or "android-22"',
    Name: 'Android 5.1.1',
    Type: 'Platform',
    level: '22',
    Revision: '2',
    Skins: 'HVGA, QVGA, WQVGA400, WQVGA432, WSVGA, WVGA800 (default), WVGA854, WXGA720, WXGA800, WXGA800-7in'
  },
  {
    id: '2 or "android-23"',
    Name: 'Android 6.0.0',
    Type: 'Platform',
    level: '23',
    Revision: '2',
    Skins: 'HVGA, QVGA, WQVGA400, WQVGA432, WSVGA, WVGA800 (default), WVGA854, WXGA720, WXGA800, WXGA800-7in'
  }
]
```

## listAVDs

Resolves to an array of Android AVD objects that can be used in conjunction
with `start(avd.Name)`.

The array looks like:
```js
[
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
]
```

## devices

Resolves to an array of device objects.

The array looks like:
```js
[
  { name: 'emulator-5554', status: 'device' },
  { name: 'emulator-5555', status: 'device' },
  { name: 'emulator-5556', status: 'offline' }
]
```

## listPackages(deviceId)

Returns a promise that resolves to an array containing packages installed on
the device with `deviceId`.

The array looks like:
```js
[
  'com.android.smoketest',
  'com.example.android.livecubes',
  'com.android.providers.telephony',
  'com.android.providers.calendar',
  'com.android.providers.media',
  'com.android.protips',
  'com.android.launcher',
  'com.android.documentsui',
  'com.android.gallery',
  'com.android.externalstorage'
]
```

## isInstalled(packageName)

Returns a promise that resolves with a boolean value that is true if the package
specified with `packageName` is installed.

## install(deviceId, apkPath, reinstall=false)

Install an APK located by absolute URI `apkPath` onto device with `deviceId`.

Returns a Promise that resolves to `undefined` on success, and throws
`'Already installed'` if it's already installed.

If `reinstall` is true, than the package will be reinstalled and all related
data will be kept.

## stop(deviceId)

Stop the device specified with `deviceId`. (This should only be used with
  emulators. It will kill the process.)

## powerOn(deviceId)

Presses the power on button on the phone.

## unlock(deviceId)

Presses the unlock button on the phone.

## inputKeyEvent(deviceId, keyCode)

Sends a key event with `keyCode` to device specified with `deviceId`.
