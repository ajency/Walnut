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
                console.log(JSON.stringify(resp));
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
      var uri;
      $('#syncSuccess').css("display", "block").text("Downloading file...");
      uri = encodeURI(resp.exported_csv_url);
      return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (function(_this) {
        return function(fileSystem) {
          return fileSystem.root.getFile("SynapseAssets/SynapseData/csv-synapse.zip", {
            create: true,
            exclusive: false
          }, function(fileEntry) {
            var filePath, fileTransfer;
            filePath = fileEntry.toURL().replace("csv-synapse.zip", "");
            fileEntry.remove();
            fileTransfer = new FileTransfer();
            return fileTransfer.download(uri, filePath + "csv-synapse.zip", function(file) {
              return _.onFileDownloadSuccess(file.toURL(), filePath, resp.last_sync);
            }, function(error) {
              return _.onDataSyncError(error, "An error occurred during file download");
            }, true);
          }, _.fileErrorHandler);
        };
      })(this), _.fileSystemErrorHandler);
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
