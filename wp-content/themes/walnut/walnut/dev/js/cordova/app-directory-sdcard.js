define(['underscore'], function(_) {
  return _.mixin({
    checkSynapseAssetsDirectory: function() {
      return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        return fileSystem.root.getDirectory("SynapseAssets", {
          create: false,
          exclusive: false
        }, function(fileEntry) {
          _.setSynapseAssetsDirectoryPath(fileEntry.toURL() + '/SynapseImages/');
          return console.log('Full path: ' + _.getSynapseAssetsDirectoryPath());
        }, function(error) {
          return console.log('ERROR: ' + error.code);
        });
      }, _.fileSystemErrorHandler);
    },
    createSynapseAssetsDirectory: function() {
      return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        return fileSystem.root.getDirectory("SynapseAssets", {
          create: true,
          exclusive: false
        }, function(fileEntry) {
          return console.log('SynapseAssets directory path: ' + fileEntry.toURL());
        }, function(error) {
          return console.log('ERROR: ' + error.code);
        });
      }, _.fileSystemErrorHandler);
    },
    createSynapseImagesDirectory: function() {
      _.createSynapseAssetsDirectory();
      return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        return fileSystem.root.getDirectory("SynapseAssets/SynapseImages", {
          create: true,
          exclusive: false
        }, function(fileEntry) {
          return console.log('SynapseImages directory path: ' + fileEntry.toURL());
        }, function(error) {
          return console.log('ERROR: ' + error.code);
        });
      }, _.fileSystemErrorHandler);
    },
    createSynapseDataDirectory: function() {
      _.createSynapseAssetsDirectory();
      return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        return fileSystem.root.getDirectory("SynapseAssets/SynapseData", {
          create: true,
          exclusive: false
        }, function(fileEntry) {
          return console.log('SynapseData directory path: ' + fileEntry.toURL());
        }, function(error) {
          return console.log('ERROR: ' + error.code);
        });
      }, _.fileSystemErrorHandler);
    }
  });
});
