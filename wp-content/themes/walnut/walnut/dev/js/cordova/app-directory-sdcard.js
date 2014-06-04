define(['underscore'], function(_) {
  return _.checkSynapseAssetsDirectory = function() {
    return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
      return fileSystem.root.getDirectory("SynapseAssets", {
        create: true,
        exclusive: false
      }, function(fileEntry) {
        _.setSynapseAssetsDirectoryPath(fileEntry.toURL() + '/SynapseImages/');
        return console.log('Full path: ' + _.getSynapseAssetsDirectoryPath());
      }, function(error) {
        return console.log('ERROR: ' + error);
      });
    }, _.fileSystemErrorHandler);
  };
});
