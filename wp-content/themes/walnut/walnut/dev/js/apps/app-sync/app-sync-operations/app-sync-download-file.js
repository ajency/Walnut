define(['underscore'], function(_) {
  return _.mixin({
    getZipFileDownloadDetails: function() {
      var lastDownloadTimestamp;
      $('#syncSuccess').css("display", "block").text("Starting file download...");
      lastDownloadTimestamp = _.getLastDownloadTimeStamp();
      return lastDownloadTimestamp.done(function(time_stamp) {
        var data;
        data = {
          blog_id: _.getBlogID(),
          last_sync: time_stamp
        };
        return $.get(AJAXURL + '?action=sync-database', data, (function(_this) {
          return function(resp) {
            console.log('getZipFileDownloadDetails response');
            console.log(resp);
            return _.downloadZipFile(resp);
          };
        })(this), 'json').fail(function() {
          return _.onDataSyncError("none", "Could not connect to server");
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
