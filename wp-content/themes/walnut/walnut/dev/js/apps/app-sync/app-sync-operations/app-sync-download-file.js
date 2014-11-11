define(['underscore', 'bootbox'], function(_, bootbox) {
  return _.mixin({
    getZipFileDownloadDetails: function() {
      var userDetails;
      $('#syncSuccess').css("display", "block").text("Starting file download...");
      userDetails = _.getUserDetails(_.getUserID());
      return userDetails.done(function(userDetails) {
        var blog_id, lastDownloadTimestamp;
        blog_id = userDetails.blog_id;
        lastDownloadTimestamp = _.getLastDownloadTimeStamp();
        return lastDownloadTimestamp.done(function(time_stamp) {
          var data;
          data = {
            blog_id: blog_id,
            last_sync: time_stamp,
            user_id: _.getUserID(),
            sync_type: "student_app"
          };
          console.log(JSON.stringify(data));
          return $.get(AJAXURL + '?action=sync-database', data, (function(_this) {
            return function(resp) {
              var userInfo;
              if (resp === 0) {
                userInfo = _.getUserDetails(_.getUserID());
                return userInfo.done(function(user_Details) {
                  var user, username;
                  _.removeCordovaBackbuttonEventListener();
                  _.setUserID(null);
                  _.setTblPrefix(null);
                  user = App.request("get:user:model");
                  user.clear();
                  App.leftNavRegion.close();
                  App.headerRegion.close();
                  App.mainContentRegion.close();
                  App.breadcrumbRegion.close();
                  bootbox.alert("Hi, your session has expired. Please log in to continue");
                  username = user_Details.username;
                  return setTimeout((function(_this) {
                    return function() {
                      App.navigate("login/" + username, {
                        trigger: true
                      });
                      return $('#onOffSwitch').prop({
                        "disabled": true,
                        "checked": true
                      });
                    };
                  })(this), 1000);
                });
              } else {
                console.log('getZipFileDownloadDetails response');
                return _.downloadZipFile(resp);
              }
            };
          })(this), 'json').fail(function() {
            return _.onDataSyncError("none", "Could not connect to server");
          });
        });
      });
    },
    downloadZipFile: function(resp) {
      var filepath, option, uri, value;
      $('#syncSuccess').css("display", "block").text("Downloading file...");
      uri = encodeURI(resp.exported_csv_url);
      value = _.getStorageOption();
      option = JSON.parse(value);
      if (option.internal) {
        filepath = option.internal;
      } else if (option.external) {
        filepath = option.external;
      }
      return window.resolveLocalFileSystemURL('file://' + filepath + '', function(fileSystem) {
        return fileSystem.getFile("SynapseAssets/SynapseData/csv-synapse.zip", {
          create: true,
          exclusive: false
        }, function(fileEntry) {
          var csvFilePath, fileTransfer;
          csvFilePath = fileEntry.toURL().replace("csv-synapse.zip", "");
          fileEntry.remove();
          fileTransfer = new FileTransfer();
          return fileTransfer.download(uri, csvFilePath + "csv-synapse.zip", function(file) {
            return _.onFileDownloadSuccess(file.toURL(), csvFilePath, resp.last_sync);
          }, function(error) {
            return _.onDataSyncError(error, "An error occurred during file download");
          }, true);
        }, _.fileErrorHandler);
      }, _.fileSystemErrorHandler);
    },
    onFileDownloadSuccess: function(source, destination, last_sync) {
      var onFileUnzipSuccess;
      console.log('Downloaded Zip file successfully');
      onFileUnzipSuccess = function() {
        console.log('Files unzipped successfully');
        _.updateSyncDetails('file_download', last_sync);
        $('#syncSuccess').css("display", "block").text("File download completed");
        return setTimeout((function(_this) {
          return function() {
            return _.startFileImport();
          };
        })(this), 2000);
      };
      return zip.unzip(source, destination, onFileUnzipSuccess);
    }
  });
});
