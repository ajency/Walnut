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
          console.log('FILE DECRYPTION ERROR: ' + message);
          return d.resolve(destination);
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
      var filepath, option, value;
      value = _.getStorageOption();
      option = JSON.parse(value);
      if (option.internal) {
        filepath = option.internal;
      } else if (option.external) {
        filepath = option.external;
      }
      return window.resolveLocalFileSystemURL('file://' + filepath + '', function(fileEntry) {
        return fileEntry.getDirectory("SynapseAssets/SynapseMedia/uploads/" + directory_name, {
          create: false,
          exclusive: false
        }, function(entry) {
          var reader;
          reader = entry.createReader();
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
    },
    initLocalVideosCheck: function(videoIds) {
      var defer, videoIdAndUrl;
      defer = $.Deferred();
      videoIdAndUrl = new Array();
      _.createVideosWebDirectory().done((function(_this) {
        return function() {
          var forEach;
          forEach = function(videoId, index) {
            return _.getMediaById(videoId).then(function(video) {
              var decryptedPath, decryptedVideoPath, encryptedPath, encryptedVideoPath, option, url, value, videoUrl, videosWebUrl;
              url = video.url.replace("media-web/", "");
              videosWebUrl = url.substr(url.indexOf("uploads/"));
              videoUrl = videosWebUrl.replace("videos-web", "videos");
              encryptedPath = "SynapseAssets/SynapseMedia/" + videoUrl;
              decryptedPath = "SynapseAssets/SynapseMedia/" + videosWebUrl;
              value = _.getStorageOption();
              option = JSON.parse(value);
              encryptedVideoPath = '';
              decryptedVideoPath = '';
              if (option.internal) {
                encryptedVideoPath = option.internal + '/' + encryptedPath;
                decryptedVideoPath = option.internal + '/' + decryptedPath;
              } else if (option.external) {
                encryptedVideoPath = option.external + '/' + encryptedPath;
                decryptedVideoPath = option.external + '/' + decryptedPath;
              }
              videoIdAndUrl[index] = {
                encryptedPath: encryptedVideoPath,
                decryptedPath: decryptedVideoPath,
                url: 'file://' + decryptedVideoPath,
                vId: videoId
              };
              index = index + 1;
              if (index < _.size(videoIds)) {
                return forEach(videoIds[index], index);
              } else {
                return defer.resolve(videoIdAndUrl);
              }
            });
          };
          return forEach(videoIds[0], 0);
        };
      })(this));
      return defer.promise();
    },
    decryptVideos: function(videoIdAndUrl) {
      var decryptedVideoPath, defer, forEach;
      defer = $.Deferred();
      decryptedVideoPath = new Array();
      forEach = function(videoId, index) {
        var getdecryptedLocalFile;
        getdecryptedLocalFile = _.decryptLocalFile(videoId.encryptedPath, videoId.decryptedPath);
        return getdecryptedLocalFile.done(function(localVideoPath) {
          if (_.size(localVideoPath) === 0) {
            decryptedVideoPath[0] = {
              videoDecryptedPath: '',
              vId: ''
            };
            return defer.resolve(decryptedVideoPath);
          } else {
            index = index + 1;
            if (index < _.size(videoIdAndUrl)) {
              decryptedVideoPath[index - 1] = {
                videoDecryptedPath: 'file://' + localVideoPath,
                vId: videoId.vId
              };
              return forEach(videoIdAndUrl[index], index);
            } else {
              decryptedVideoPath[index - 1] = {
                videoDecryptedPath: 'file://' + localVideoPath,
                vId: videoId.vId
              };
              return defer.resolve(decryptedVideoPath);
            }
          }
        });
      };
      forEach(videoIdAndUrl[0], 0);
      return defer.promise();
    }
  });
});
