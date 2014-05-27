define(['underscore'], function(_) {
  return _.checkSynapseAssetsDirectory = function() {
    return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
      return fileSystem.root.getDirectory("SynapseAssets", {
        create: false,
        exclusive: false
      }, function(fileEntry) {
        $('#directory').text('Synapse Assets directory exists on SD Card');
        _.setSynapseAssetsDirectoryPath(fileEntry.toURL() + 'SynapseImages/');
        return console.log('Full path: ' + _.getSynapseAssetsDirectoryPath());
      }, function(error) {
        return $('#directory').text('Synapse Assets directory not found on SD Card');
      });
    }, _.fileSystemErrorHandler);
  };
});
