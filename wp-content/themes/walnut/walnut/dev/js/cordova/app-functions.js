define(['underscore', 'backbone', 'unserialize'], function(_, Backbone) {
  return _.mixin({
    displayConnectionStatusOnMainLoginPage: function() {
      if (_.isOnline()) {
        return $('#connectionStatus').text('Available');
      } else {
        return $('#connectionStatus').text('Unavailable');
      }
    },
    setSchoolLogo: function() {
      if (_.getSchoolLogoSrc() !== null) {
        return $("#logo").attr('src', _.getSchoolLogoSrc());
      } else {
        return $("#logo").attr('src', '/images/synapse-logo-main.png');
      }
    },
    cordovaHideSplashscreen: function() {
      return navigator.splashscreen.hide();
    },
    enableCordovaBackbuttonNavigation: function() {
      navigator.app.overrideBackbutton(true);
      return document.addEventListener("backbutton", _.onDeviceBackButtonClick, false);
    },
    disableCordovaBackbuttonNavigation: function() {
      return navigator.app.overrideBackbutton(false);
    },
    onDeviceBackButtonClick: function() {
      var currentRoute;
      currentRoute = App.getCurrentRoute();
      console.log('Fired cordova back button event for ' + currentRoute);
      if (currentRoute === 'students/dashboard' || currentRoute === 'app-login') {
        navigator.app.exitApp();
      } else {
        App.navigate('app-login', {
          trigger: true
        });
      }
      return _.removeCordovaBackbuttonEventListener();
    },
    removeCordovaBackbuttonEventListener: function() {
      return document.removeEventListener("backbutton", _.onDeviceBackButtonClick, false);
    },
    cordovaOnlineOfflineEvents: function() {
      document.addEventListener("online", (function(_this) {
        return function() {
          $('#connectionStatus').text('Available');
          if (!_.isUndefined(_.app_username)) {
            return $('#onOffSwitch').prop({
              "disabled": false,
              "checked": false
            });
          }
        };
      })(this), false);
      return document.addEventListener("offline", (function(_this) {
        return function() {
          $('#connectionStatus').text('Unavailable');
          if (!_.isUndefined(_.app_username)) {
            return $('#onOffSwitch').prop({
              "disabled": true,
              "checked": false
            });
          }
        };
      })(this), false);
    },
    unserialize: function(string) {
      if (string === '') {
        return string;
      } else {
        return unserialize(string);
      }
    },
    decryptLocalFile: function(source, destination) {
      return $.Deferred(function(d) {
        return decrypt.startDecryption(source, destination, function() {
          return d.resolve(destination);
        }, function(message) {
          return console.log('FILE DECRYPTION ERROR: ' + message);
        });
      });
    },
    getDeviceStorageOptions: function() {
      var defer, storageOptions;
      defer = $.Deferred();
      storageOptions = [];
      Path.CheckPath(function(path) {
        if (!_.isUndefined(path.ExternalPath)) {
          storageOptions['Internal'] = path.InternalPath;
          storageOptions['External'] = path.ExternalPath;
          return _.cordovaCheckIfPathExists(path.ExternalPath).then(function(pathExists) {
            if (pathExists) {
              console.log('Storage Options External');
              return defer.resolve(storageOptions);
            } else {
              console.log('Storage Options Internal');
              storageOptions = _.pick(storageOptions, 'Internal');
              return defer.resolve(storageOptions);
            }
          });
        } else {
          storageOptions['Internal'] = path.InternalPath;
          return defer.resolve(storageOptions);
        }
      }, function(error) {
        console.log('STORAGE ERROR');
        return defer.reject(console.log(error));
      });
      return defer.promise();
    },
    clearMediaDirectory: function(directory_name) {
      return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        return fileSystem.root.getDirectory("SynapseAssets/SynapseMedia/uploads/" + directory_name, {
          create: false,
          exclusive: false
        }, function(directoryEntry) {
          var reader;
          reader = directoryEntry.createReader();
          return reader.readEntries(function(entries) {
            var i, _i, _ref, _results;
            _results = [];
            for (i = _i = 0, _ref = entries.length - 1; _i <= _ref; i = _i += 1) {
              entries[i].remove();
              if (i === entries.length - 1) {
                _results.push(console.log('Deleted all files from ' + directory_name + ' directory'));
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          }, _.directoryErrorHandler);
        }, _.directoryErrorHandler);
      }, _.fileSystemErrorHandler);
    },
    getCurrentDateTime: function(bit) {
      var d, date, time;
      d = new Date();
      date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      time = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
      if (bit === 0) {
        return date;
      }
      if (bit === 1) {
        return time;
      }
      if (bit === 2) {
        return date + ' ' + time;
      }
    },
    audioQueuesSelection: function(selectedAction) {
      var audioCues, filepath, filepathForIndividualAudio;
      if (_.platform() === "DEVICE") {
        if (!_.isNull(_.getAudioCues())) {
          if (_.getAudioCues() !== 'false') {
            audioCues = null;
            filepathForIndividualAudio = null;
            filepath = "/android_asset/www/audioCues/";
            switch (selectedAction) {
              case 'Click-Next':
                filepathForIndividualAudio = filepath + "nextClick.WAV";
                break;
              case 'Click-Select':
                navigator.notification.vibrate(1000);
                filepathForIndividualAudio = filepath + "selectClick.WAV";
                break;
              case 'Click-Start':
                filepathForIndividualAudio = filepath + "startClick.WAV";
                break;
              case 'Click-Unselect':
                navigator.notification.vibrate(1000);
                filepathForIndividualAudio = filepath + "unselectClick.WAV";
                break;
              case 'Click-Save':
                filepathForIndividualAudio = filepath + "saveClick.WAV";
                break;
              case 'Click-Pause':
                filepathForIndividualAudio = filepath + "pauseClick.WAV";
            }
            audioCues = new Media(filepathForIndividualAudio, function() {
              return console.log("media played");
            }, function(error) {
              return console.log("error" + error.code);
            });
            audioCues.play();
            return setTimeout((function(_this) {
              return function() {
                return audioCues.release();
              };
            })(this), 2000);
          }
        }
      }
    },
    setAudioCuesToggle: function() {
      if (_.getAudioCues() === 'true') {
        return $('#onOffSwitchToggle').prop({
          "checked": true
        });
      } else {
        return $('#onOffSwitchToggle').prop({
          "checked": false
        });
      }
    },
    getUserDetails: function(userID) {
      var defer, onSuccess, userDetails;
      userDetails = {
        user_id: '',
        username: '',
        display_name: '',
        password: '',
        user_capabilities: '',
        user_role: '',
        cookie: '',
        blog_id: '',
        user_email: '',
        division: ''
      };
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var row;
        userDetails = '';
        if (data.rows.length !== 0) {
          row = data.rows.item(0);
          userDetails = {
            user_id: row['user_id'],
            username: row['username'],
            display_name: row['display_name'],
            password: row['password'],
            user_capabilities: row['user_capabilities'],
            user_role: row['user_role'],
            cookie: row['cookie'],
            blog_id: row['blog_id'],
            user_email: row['user_email'],
            division: row['division']
          };
        }
        return defer.resolve(userDetails);
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT * FROM USERS WHERE user_id=?", [userID], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    }
  });
});
