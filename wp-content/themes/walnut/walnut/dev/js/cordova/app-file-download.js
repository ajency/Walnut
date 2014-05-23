define(['underscore'], function(_) {
  return _.downloadSchoolLogo = function(logo_url) {
    return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
      return fileSystem.root.getFile("logo.jpg", {
        create: true,
        exclusive: false
      }, function(fileEntry) {
        var filePath, fileTransfer, uri;
        filePath = fileEntry.toURL().replace("logo.jpg", "");
        fileEntry.remove();
        uri = encodeURI(logo_url);
        fileTransfer = new FileTransfer();
        return fileTransfer.download(uri, filePath + "logo.jpg", function(file) {
          console.log('School logo download successful');
          console.log('Logo file source: ' + file.toURL());
          return _.setSchoolLogoSrc(file.toURL());
        }, _.fileTransferErrorHandler, true);
      }, _.fileErrorHandler);
    }, _.fileSystemErrorHandler);
  };
});
