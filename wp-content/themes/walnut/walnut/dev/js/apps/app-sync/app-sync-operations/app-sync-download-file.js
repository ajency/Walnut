define(['underscore'], function(_) {
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
          var textbookIdsByClassID;
          textbookIdsByClassID = _.getTextbookIdsByClassID();
          return textbookIdsByClassID.done(function(textbook_ids) {
            var data;
            data = {
              blog_id: blog_id,
              last_sync: time_stamp,
              textbook_ids: textbook_ids,
              user_id: _.getUserID(),
              sync_type: "student_app"
            };
            console.log(JSON.stringify(data));
            return $.get(AJAXURL + '?action=sync-database', data, (function(_this) {
              return function(resp) {
                console.log('getZipFileDownloadDetails response');
                console.log(JSON.stringify(resp));
                alert("data");
                return _.downloadZipFile(resp);
              };
            })(this), 'json').fail(function() {
              return _.onDataSyncError("none", "Could not connect to server");
            });
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
      console.log(JSON.stringify(source));
      console.log(JSON.stringify(destination));
      onFileUnzipSuccess = function() {
        console.log('Files unzipped successfully');
        _.updateSyncDetails('file_download', last_sync);
        $('#syncSuccess').css("display", "block").text("File download completed");
        return setTimeout((function(_this) {
          return function() {
            return App.navigate('students/dashboard', {
              trigger: true
            });
          };
        })(this), 2000);
      };
      return zip.unzip(source, destination, onFileUnzipSuccess);
    }
  });
});
