define(['underscore'], function(_) {
  return _.mixin({
    uploadGeneratedZipFile: function() {
      var fileTransfer, options, params, uploadURI, zipFilePath;
      $('#syncSuccess').css("display", "block").text("Starting file upload...");
      zipFilePath = _.getGeneratedZipFilePath();
      uploadURI = encodeURI(AJAXURL + '?action=sync-app-data');
      options = new FileUploadOptions();
      options.fileKey = "file";
      options.fileName = zipFilePath.substr(zipFilePath.lastIndexOf('/') + 1);
      options.mimeType = "application/octet";
      params = {
        blog_id: _.getBlogID()
      };
      options.params = params;
      fileTransfer = new FileTransfer();
      return fileTransfer.upload(zipFilePath, uploadURI, function(success) {
        var response;
        response = JSON.parse(success.response);
        _.setSyncRequestId(response.sync_request_id);
        _.onFileUploadSuccess();
        console.log("CODE: " + success.responseCode);
        console.log("RESPONSE: " + success.response);
        return console.log("BYTES SENT: " + success.bytesSent);
      }, function(error) {
        _.onFileUploadError();
        console.log("UPLOAD ERROR SOURCE" + error.source);
        return console.log("UPLOAD ERROR TARGET" + error.target);
      }, options);
    },
    onFileUploadSuccess: function() {
      _.updateSyncDetails('file_upload', _.getCurrentDateTime(2));
      $('#syncSuccess').css("display", "block").text("File upload completed...");
      return setTimeout((function(_this) {
        return function() {
          var syncController;
          syncController = App.request("get:sync:controller");
          return syncController.getDownloadURL();
        };
      })(this), 2000);
    },
    checkIfServerImportOperationCompleted: function() {
      $('#syncSuccess').css("display", "block").text("Please wait...");
      return setTimeout((function(_this) {
        return function() {
          var data;
          data = {
            blog_id: _.getBlogID()
          };
          return $.get(AJAXURL + '?action=check-app-data-sync-completion&sync_request_id=' + _.getSyncRequestId(), data, function(resp) {
            var syncController;
            console.log('Sync completion response');
            console.log(resp);
            if (!resp) {
              return _.checkIfServerImportOperationCompleted();
            } else {
              syncController = App.request("get:sync:controller");
              return syncController.getDownloadURL();
            }
          }, 'json');
        };
      })(this), 5000);
    },
    onFileUploadError: function() {
      $('#syncSuccess').css("display", "none");
      $('#syncStartContinue').css("display", "block");
      $('#syncButtonText').text('Try again');
      return $('#syncError').css("display", "block").text("An error occurred during file upload");
    }
  });
});
