'use strict';

var ezspawn = require('ezspawn');
var bluebird = require('bluebird');
var debug = require('debug')('android');
var spawnWaitFor = require('spawn-wait-for');
var promiseRetry = require('promise-retry');
var noop = function() {

};

var processKeyValueGroups = function(str) {
  var lines = str.split('\n');
  var currentKey = {};
  var results = [];

  lines.forEach(function(line) {
    var matches = line.match(/([\w\/]+):\s(.*)/);
    var key;
    var value;

    if (matches === null) {
      return;
    }

    key = matches[1];
    value = matches[2];

    if (typeof currentKey[key] !== 'undefined') {
      results.push(currentKey);
      currentKey = {};
    }

    currentKey[key] = value;
  });

  if (Object.keys(currentKey).length) {
    results.push(currentKey);
  }
  return results;
};

var process;

var Android = {
  startOrCreate: function() {
    var self = this;
    return this.getAVDs().then(function(avds) {
      if (avds.length) {
        return avds;
      }
      // no avds, list targets and create one
      return self.listTargets().then(function(targets) {
        if (!targets.length) {
          throw new Error('Could not find any targets, can not create AVD');
        }
        var target = targets.shift();
        var targetId = String(parseInt(target.id));
        return self.createAVD(targetId, target.Name.replace(/[^\w]+/g, '')).then(function() {
          return self.getAVDs();
        }).catch(function(err) {
          console.error(err);
          throw err;
        });
      });
    }).then(function(avds) {
      var avd = avds.shift();
      return self.start(avd.Name);
    });
  },
  start: function(avdName) {
    var self = this;
    return spawnWaitFor(
      'emulator -verbose -avd "' + avdName + '" -no-boot-anim -no-skin',
      /emulator: control console listening on port (\d+), ADB on port \d+/
    ).then(function(result) {
      return {
        process: result.process,
        id: result.matches[1]
      };
    });
  },
  waitForDevice: function(emulatorId) {
    return this.adb(emulatorId, 'wait-for-device').then(noop);
  },
  ensureReady: function(emulatorId) {
    return this.waitForDevice()
      .then(function() {
        return promiseRetry(function(retry) {
          return this.adb(emulatorId, 'shell getprop sys.boot_completed').then(function(proc) {
            console.log(proc.stdout);
            if (proc.stdout === '0') {
              retry('Device not ready');
            }
          });
        }, {
          retries: 100,
          factor: 1
        });
      });
  },
  adb: function(emulatorId, cmd) {
    return ezspawn('adb -s ' + emulatorId + ' ' + cmd);
  },
  createAVD: function(targetId, name) {
    return ezspawn('android create avd -t ' + targetId + ' -a -c 500M -d "Nexus 5" -n "' + name + '"');
  },
  isInstalled: function() {

  },
  install: function() {

  },
  stop: function() {

  },
  powerOn: function() {

  },
  unlock: function() {

  },
  getDevices: function() {
    return ezspawn('adb devices').then(function(output) {
      var lines = output.stdout.split('\n');
      lines.shift();
      return lines
        .map(function(line) {
          var matches = line.match(/([^\s]+])\s+([^\s]+])/);
          if (matches === null) {
            return null;
          }
          return {
            name: matches[1],
            status: matches[2]
          };
        })
        .filter(function(x) {
          return x !== null;
        });
    });
  },
  getAVDs: function() {
    debug('get avds');
    return ezspawn('android list avds').then(function(output) {
      var avds = processKeyValueGroups(output.stdout);
      debug('got avds', avds);
      return avds;
    });
  },
  listTargets: function() {
    return ezspawn('android list targets').then(function(output) {
      return processKeyValueGroups(output.stdout);
    });
  },
  listPackages: function(emulatorId) {
    return this.adb(emulatorId, 'shell pm list packages').then(function(proc) {
      var lines = proc.stdout.split('\n');
      return lines.map(function(line) {
        return line.split(':')[1];
      });
    });
  }
};

// Android.startOrCreate()
//   .then(function(emulator) {
//     return Android.ensureReady(emulator.id)
//       .then()
//   });
//
module.exports = Android;
