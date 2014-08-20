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
      var onSuccess, runQuery, userData;
      userData = {
        user_id: '',
        password: '',
        role: '',
        exists: false
      };
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM USERS WHERE username=?", [username], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
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
          return d.resolve(userData);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getUserDetails transaction completed');
      }).fail(_.failureHandler);
    },
    getMetaValue: function(content_piece_id) {
      var meta_value, onSuccess, runQuery;
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
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM wp_postmeta WHERE post_id=?", [content_piece_id], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var i, row, _fn, _i, _ref;
          _fn = function(row) {
            var content_piece_meta;
            if (row['meta_key'] === 'content_type') {
              meta_value.content_type = row['meta_value'];
            }
            if (row['meta_key'] === 'layout_json') {
              meta_value.layout_json = _.unserialize(_.unserialize(row['meta_value']));
            }
            if (row['meta_key'] === 'question_type') {
              meta_value.question_type = row['meta_value'];
            }
            if (row['meta_key'] === 'content_piece_meta') {
              content_piece_meta = _.unserialize(_.unserialize(row['meta_value']));
              meta_value.post_tags = content_piece_meta.post_tags;
              meta_value.duration = content_piece_meta.duration;
              meta_value.last_modified_by = content_piece_meta.last_modified_by;
              meta_value.published_by = content_piece_meta.published_by;
              meta_value.term_ids = content_piece_meta.term_ids;
              return meta_value.instructions = content_piece_meta.instructions;
            }
          };
          for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
            row = data.rows.item(i);
            _fn(row);
          }
          return d.resolve(meta_value);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getMetaValue transaction completed');
      }).fail(_.failureHandler);
    },
    decryptVideoFile: function(source, destination) {
      var runFunc;
      runFunc = function() {
        return $.Deferred(function(d) {
          return decrypt.startDecryption(source, destination, function() {
            console.log(destination);
            return d.resolve(destination);
          }, function(message) {
            return console.log('ERROR: ' + message);
          });
        });
      };
      return $.when(runFunc()).done(function() {
        return console.log('Decrypted video file at location: ' + destination);
      }).fail(_.failureHandler);
    },
    decryptAudioFile: function(source, destination) {
      return $.Deferred(function(d) {
        return decrypt.startDecryption(source, destination, function() {
          console.log(destination);
          return d.resolve(destination);
        }, function(message) {
          return console.log('ERROR: ' + message);
        });
      });
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
    }
  });
});
