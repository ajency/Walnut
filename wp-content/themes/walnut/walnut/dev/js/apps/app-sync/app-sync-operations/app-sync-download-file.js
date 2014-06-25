define(['underscore'], function(_) {
  return _.mixin({
    getZipFileDownloadDetails: function() {
      var data, lastDownloadTimestamp;
      $('#syncSuccess').css("display", "block").text("Starting file download...");
      lastDownloadTimestamp = _.getLastDownloadTimeStamp();
      lastDownloadTimestamp.done(function(time_stamp) {});
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
      })(this), 'json');
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
              return _.onFileDownloadError(error);
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
    },
    onFileDownloadError: function(error) {
      console.log('ERROR: ' + error.code);
      $('#syncSuccess').css("display", "none");
      $('#syncStartContinue').css("display", "block");
      $('#syncButtonText').text('Try again');
      return $('#syncError').css("display", "block").text("An error occurred during file download");
    }
  });
});
