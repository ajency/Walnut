define(['underscore', 'backbone', 'unserialize'], function(_, Backbone) {
  return _.mixin({
    getTheBlogId: function(id) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT blog_id FROM USERS WHERE user_id=?", [id], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var blog_id;
          blog_id = '';
          if (data.rows.length !== 0) {
            blog_id = data.rows.items(0)['blog_id'];
            console.log(blog_id);
          }
          return d.resolve(blog_id);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('get blog id from the local users table');
      }).fail(_.failureHandler);
    },
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
              session_id: row['session_id'],
              blog_id: row['blog_id'],
              exists: true
            };
            console.log("user data");
            console.log(userData);
          }
          return d.resolve(userData);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getUserDetails transaction completed');
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
    },
    getSingleDivsionByUserId: function(id) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT meta_value FROM wp_usermeta WHERE user_id=? AND meta_key=?", [id, 'student_division'], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          id = '';
          if (data.rows.length !== 0) {
            id = data.rows.item(0)['meta_value'];
            console.log(id);
          }
          return d.resolve(id);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('fetchSingleDivsion transaction completed');
      }).fail(_.failureHandler);
    },
    setUserModel: function() {
      var singleDivision, user;
      user = App.request("get:user:model");
      user.set({
        'ID': '' + _.getUserID()
      });
      if (!_.isNull(_.getUserCapabilities())) {
        user.set({
          'allcaps': _.getUserCapabilities()
        });
      }
      singleDivision = this.getSingleDivsionByUserId(_.getUserID());
      return singleDivision.done(function(division) {
        var data;
        data = {
          'division': division
        };
        return user.set({
          'data': data
        });
      });
    }
  });
});
