define(['underscore'], function(_) {
  return _.mixin({
    uploadGeneratedZipFile: function() {
      var userDetails;
      userDetails = _.getUserDetails(_.getUserID());
      return userDetails.done(function(userDetails) {
        var blog_id, fileTransfer, options, params, uploadURI, zipFilePath;
        blog_id = userDetails.blog_id;
        $('#syncSuccess').css("display", "block").text("Starting file upload...");
        zipFilePath = _.getGeneratedZipFilePath();
        uploadURI = encodeURI(AJAXURL + '?action=sync-app-data');
        options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = zipFilePath.substr(zipFilePath.lastIndexOf('/') + 1);
        options.mimeType = "application/octet";
        params = {
          blog_id: blog_id
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
          _.onDataSyncError(error, "An error occurred during file upload");
          console.log("UPLOAD ERROR SOURCE" + error.source);
          return console.log("UPLOAD ERROR TARGET" + error.target);
        }, options);
      });
    },
    onFileUploadSuccess: function() {
      _.updateSyncDetails('file_upload', _.getCurrentDateTime(2));
      $('#syncSuccess').css("display", "block").text("File upload completed...");
      return setTimeout((function(_this) {
        return function() {
          return _.checkIfServerImportOperationCompleted();
        };
      })(this), 2000);
    },
    checkIfServerImportOperationCompleted: function() {
      var userDetails;
      userDetails = _.getUserDetails(_.getUserID());
      return userDetails.done(function(userDetails) {
        var blog_id, escaped;
        blog_id = userDetails.blog_id;
        escaped = $('<div>').text("Please wait...\nThis should take a few minutes").text();
        $('#syncSuccess').css("display", "block").html(escaped.replace(/\n/g, '<br />'));
        return setTimeout((function(_this) {
          return function() {
            var data;
            data = {
              blog_id: blog_id
            };
            return $.get(AJAXURL + '?action=check-app-data-sync-completion&sync_request_id=' + _.getSyncRequestId(), data, function(resp) {
              console.log('Sync completion response');
              console.log(resp);
              if (!resp) {
                return _.checkIfServerImportOperationCompleted();
              } else {
                return _.getZipFileDownloadDetails();
              }
            }, 'json').fail(function() {
              return _.onDataSyncError("none", "Could not connect to server");
            });
          };
        })(this), 10000);
      });
    }
  });
});
