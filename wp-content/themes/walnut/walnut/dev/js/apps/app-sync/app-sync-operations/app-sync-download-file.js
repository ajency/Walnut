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
            console.log('File download details response');
            console.log(resp);
            return _.downloadZipFile(resp);
          };
        })(this), 'json');
      });
    },
    downloadZipFile: function(resp) {
      var uri;
      $('#syncSuccess').css("display", "block").text("Downloading file...");
      uri = encodeURI(resp.exported_csv_url);
      return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (function(_this) {
        return function(fileSystem) {
          return fileSystem.root.getFile("SynapseAssets/file.zip", {
            create: true,
            exclusive: false
          }, function(fileEntry) {
            var filePath, fileTransfer;
            filePath = fileEntry.toURL().replace("file.zip", "");
            _.setFilePath(filePath);
            fileEntry.remove();
            fileTransfer = new FileTransfer();
            return fileTransfer.download(uri, filePath + "csv-synapse.zip", function(file) {
              console.log('Zip file downloaded');
              _this.updateSyncDetails('file_download', resp.last_sync);
              return _this.fileUnZip(filePath, file.toURL());
            }, function(error) {
              $('#syncSuccess').css("display", "none");
              $('#syncStartContinue').css("display", "block");
              $('#syncButtonText').text('Try again');
              return $('#syncError').css("display", "block").text("An error occurred during file download");
            }, true);
          }, _.fileErrorHandler);
        };
      })(this), _.fileSystemErrorHandler);
    }
  });
});
