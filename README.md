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

## createAVD(targetId, name)

Create an AVD based upon `targetId` (from `listTargets`). Returns a promise
that will be resolved when the AVD has finished being created.

## listTargets

Returns a list of Android targets that can be used with createAVD.

## getAVDs

## getDevices
