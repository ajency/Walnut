define(['underscore', 'backbone', 'unserialize'], function(_, Backbone) {
  return _.mixin({
    getTblPrefix: function() {
      return 'wp_' + _.getBlogID() + '_';
    },
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
      if (currentRoute === 'teachers/dashboard' || currentRoute === 'app-login') {
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
    getUserDetails: function(username) {
      var defer, onSuccess, userData;
      defer = $.Deferred();
      userData = {
        user_id: '',
        password: '',
        role: '',
        exists: false
      };
      onSuccess = function(tx, data) {
        var row;
        if (data.rows.length !== 0) {
          row = data.rows.item(0);
          userData = {
            user_id: row['user_id'],
            password: row['password'],
            role: row['user_role'],
            exists: true
          };
        }
        return defer.resolve(userData);
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT * FROM USERS WHERE username=?", [username], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getMetaValue: function(content_piece_id) {
      var defer, meta_value, onSuccess;
      defer = $.Deferred();
      meta_value = {
        content_type: '',
        layout_json: '',
        question_type: '',
        post_tags: '',
        duration: '',
        last_modified_by: '',
        published_by: '',
        term_ids: '',
        instructions: ''
      };
      onSuccess = function(tx, data) {
        var forEach, length;
        length = data.rows.length;
        if (length === 0) {
          return defer.resolve(meta_value);
        } else {
          forEach = function(row, i) {
            var content_piece_meta;
            if (row['meta_key'] === 'content_type') {
              meta_value.content_type = row['meta_value'];
            }
            if (row['meta_key'] === 'layout_json') {
              meta_value.layout_json = _.unserialize(row['meta_value']);
            }
            if (row['meta_key'] === 'question_type') {
              meta_value.question_type = row['meta_value'];
            }
            if (row['meta_key'] === 'content_piece_meta') {
              content_piece_meta = _.unserialize(row['meta_value']);
              meta_value.post_tags = content_piece_meta.post_tags;
              meta_value.duration = content_piece_meta.duration;
              meta_value.last_modified_by = content_piece_meta.last_modified_by;
              meta_value.published_by = content_piece_meta.published_by;
              meta_value.term_ids = content_piece_meta.term_ids;
              meta_value.instructions = content_piece_meta.instructions;
            }
            i = i + 1;
            if (i < length) {
              return forEach(data.rows.item(i), i);
            } else {
              return defer.resolve(meta_value);
            }
          };
          return forEach(data.rows.item(0), 0);
        }
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT * FROM wp_postmeta WHERE post_id=?", [content_piece_id], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    decryptLocalFile: function(source, destination) {
      var defer;
      defer = $.Deferred();
      decrypt.startDecryption(source, destination, function() {
        console.log('Decrypted File: ' + destination);
        return defer.resolve(destination);
      }, function(message) {
        return defer.reject(console.log('FILE DECRYPTION ERROR: ' + message));
      });
      return defer.promise();
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
    downloadSchoolLogo: function(logo_url) {
      return window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function(fileSystem) {
        return fileSystem.root.getFile("logo.jpg", {
          create: true,
          exclusive: false
        }, function(fileEntry) {
          var filePath, fileTransfer, uri;
          filePath = fileEntry.toURL().replace("logo.jpg", "");
          fileEntry.remove();
          uri = encodeURI(logo_url);
          fileTransfer = new FileTransfer();
          return fileTransfer.download(uri, filePath + "logo.jpg", function(file) {
            console.log('School logo download successful');
            console.log('Logo file source: ' + file.toURL());
            return _.setSchoolLogoSrc(file.toURL());
          }, _.fileTransferErrorHandler, true);
        }, _.fileErrorHandler);
      }, _.fileSystemErrorHandler);
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
    audioQueuesSelection: function(selectedAction) {
      var audioCues, filepath, filepathForIndividualAudio;
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
              navigator.notification.vibrate(50);
              filepathForIndividualAudio = filepath + "selectClick.WAV";
              break;
            case 'Click-Start':
              filepathForIndividualAudio = filepath + "startClick.WAV";
              break;
            case 'Click-Unselect':
              navigator.notification.vibrate(50);
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
          return setTimeout(function() {
            return audioCues.release();
          }, 2000);
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
    }
  });
});
