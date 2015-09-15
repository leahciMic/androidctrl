'use strict';

var ezspawn = require('ezspawn');
var debug = require('debug')('android');
var spawnWaitFor = require('spawn-wait-for');
var promiseRetry = require('promise-retry');
var returnUndefined = function() {
  return undefined;
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

var Android = {
  startOrCreate: function() {
    var _this = this;
    return this.listAVDs().then(function(avds) {
      if (avds.length) {
        return avds;
      }

      // no avds, list targets and create one
      return _this.listTargets().then(function(targets) {
        if (!targets.length) {
          throw new Error('Could not find any targets, can not create AVD');
        }

        var target = targets.shift();
        var targetId = String(parseInt(target.id));
        return _this.createAVD(targetId, target.Name.replace(/[^\w]+/g, ''))
          .then(function() {
            return _this.listAVDs();
          })
          .catch(function(err) {
            console.error(err);
            throw err;
          });
      });
    }).then(function(avds) {
      var avd = avds.shift();
      return _this.start(avd.Name);
    });
  },

  start: function(avdName) {
    return spawnWaitFor(
      'emulator -verbose -avd "' + avdName + '" -no-boot-anim -no-skin',
      /emulator: control console listening on port (\d+), ADB on port \d+/
    ).then(function(result) {
      return {
        process: result.process,
        id: result.matches[1],
      };
    });
  },

  waitForDevice: function(emulatorId) {
    return this.adb(emulatorId, 'wait-for-device').then(returnUndefined);
  },

  ensureReady: function(emulatorId) {
    var _this = this;
    return this.waitForDevice(emulatorId)
      .then(function() {
        return promiseRetry(
          function(retry) {
            return _this.adb(
              emulatorId,
              'shell getprop sys.boot_completed'
            ).then(function(proc) {
              if (proc.stdout === '0') {
                retry('Device not ready');
              }
            });
          },

          {
            retries: 100,
            factor: 1,
          }
        );
      });
  },

  adb: function(emulatorId, cmd) {
    return ezspawn('adb -s ' + emulatorId + ' ' + cmd);
  },

  createAVD: function(targetId, name) {
    return ezspawn(
      'android create avd -t ' +
      targetId +
      ' -a -c 500M -d "Nexus 5" -n "' +
      name + '"'
    ).then(returnUndefined);
  },

  isInstalled: function(emulatorId, packageName) {
    return this.listPackages(emulatorId)
      .then(function(packages) {
        return packages.indexOf(packageName) > -1;
      });
  },

  install: function(emulatorId, apkPath, reinstall) {
    if (typeof reinstall === 'undefined') {
      reinstall = false;
    }

    return this.adb(
      emulatorId,
      'install ' +
      (reinstall ? '-r ' : '') +
      apkPath
    ).then(function(process) {
      if (process.stdout.match(/Success/)) {
        return undefined;
      }

      if (process.stdout.match(/Failure \[INSTALL_FAILED_ALREADY_EXISTS\]/)) {
        throw new Error('Already installed');
      }

      throw new Error('Could not parse output of adb command');
    });
  },

  stop: function(emulatorId) {
    return this.adb(emulatorId, 'emu kill');
  },

  inputKeyEvent: function(emulatorId, key) {
    return this.adb(emulatorId, 'shell input keyevent ' + key);
  },

  powerOn: function(emulatorId) {
    return this.inputKeyEvent(emulatorId, '26');
  },

  unlock: function(emulatorId) {
    return this.inputKeyEvent(emulatorId, '82');
  },

  devices: function() {
    return ezspawn('adb devices').then(function(output) {
      var lines = output.stdout.split('\n');
      console.log(lines);
      lines.shift();
      return lines
        .map(function(line) {
          var matches = line.match(/([^\s]+)\s+([^\s]+)/);
          console.log('matches', matches, line);
          if (matches === null) {
            return null;
          }

          return {
            name: matches[1],
            status: matches[2],
          };
        })
        .filter(function(x) {
          return x !== null;
        });
    });
  },

  listAVDs: function() {
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
      return lines
        .map(function(line) {
          return line.split(':')[1];
        })
        .filter(function(pkg) {
          return pkg;
        });
    });
  },

};

module.exports = Android;
