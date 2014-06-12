define(['underscore'], function(_) {
  return _.mixin({
    getSynapseImagesDirectoryPath: function() {
      var runFunc;
      runFunc = function() {
        return $.Deferred(function(d) {
          return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            return fileSystem.root.getDirectory("SynapseAssets/SynapseImages", {
              create: false,
              exclusive: false
            }, function(fileEntry) {
              console.log('SynapseImages directory path: ' + fileEntry.toURL() + '/');
              return d.resolve(fileEntry.toURL() + '/');
            }, function(error) {
              return console.log('ERROR: ' + error.code);
            });
          }, _.fileSystemErrorHandler);
        });
      };
      return $.when(runFunc()).done(function() {
        return console.log('getSynapseImagesDirectoryPath done');
      }).fail(_.failureHandler);
    },
    createSynapseAssetsDirectory: function() {
      var runFunc;
      runFunc = function() {
        return $.Deferred(function(d) {
          return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            return fileSystem.root.getDirectory("SynapseAssets", {
              create: true,
              exclusive: false
            }, function(fileEntry) {
              console.log('SynapseAssets directory path: ' + fileEntry.toURL());
              return d.resolve(fileEntry);
            }, function(error) {
              return console.log('ERROR: ' + error.code);
            });
          }, _.fileSystemErrorHandler);
        });
      };
      return $.when(runFunc()).done(function() {
        return console.log('createSynapseAssetsDirectory done');
      }).fail(_.failureHandler);
    },
    createSynapseImagesDirectory: function() {
      var runFunc;
      runFunc = function() {
        return $.Deferred(function(d) {
          var synapseAssetsDirectory;
          synapseAssetsDirectory = _.createSynapseAssetsDirectory();
          return synapseAssetsDirectory.done(function() {
            return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
              return fileSystem.root.getDirectory("SynapseAssets/SynapseImages", {
                create: true,
                exclusive: false
              }, function(fileEntry) {
                console.log('SynapseImages directory path: ' + fileEntry.toURL());
                return d.resolve(fileEntry);
              }, function(error) {
                return console.log('ERROR: ' + error.code);
              });
            }, _.fileSystemErrorHandler);
          });
        });
      };
      return $.when(runFunc()).done(function() {
        return console.log('createSynapseImagesDirectory done');
      }).fail(_.failureHandler);
    },
    createSynapseDataDirectory: function() {
      var runFunc;
      runFunc = function() {
        return $.Deferred(function(d) {
          var synapseAssetsDirectory;
          synapseAssetsDirectory = _.createSynapseAssetsDirectory();
          return synapseAssetsDirectory.done(function() {
            return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
              return fileSystem.root.getDirectory("SynapseAssets/SynapseData", {
                create: true,
                exclusive: false
              }, function(fileEntry) {
                console.log('SynapseData directory path: ' + fileEntry.toURL());
                return d.resolve(fileEntry);
              }, function(error) {
                return console.log('ERROR: ' + error.code);
              });
            }, _.fileSystemErrorHandler);
          });
        });
      };
      return $.when(runFunc()).done(function() {
        return console.log('createSynapseDataDirectory done');
      }).fail(_.failureHandler);
    },
    createDirectoryStructure: function(path) {
      var runFunc;
      runFunc = function() {
        return $.Deferred(function(d) {
          var directoryPath, synapseImagesDirectory;
          directoryPath = "SynapseAssets/SynapseImages";
          synapseImagesDirectory = _.createSynapseImagesDirectory();
          return synapseImagesDirectory.done(function() {
            var directories;
            directories = path.split('/');
            directories.pop();
            _.each(directories, function(directory, key) {
              return (function(directory) {
                var createDirectory;
                directoryPath = directoryPath + '/' + directory;
                createDirectory = _.createDirectoryBasedOnDirectoryPath(directoryPath);
                return createDirectory.done(function() {
                  return console.log('Created directory: ' + directory);
                });
              })(directory);
            });
            return d.resolve(directories);
          });
        });
      };
      return $.when(runFunc()).done(function() {
        return console.log('createDirectoryStructure done');
      }).fail(_.failureHandler);
    },
    createDirectoryBasedOnDirectoryPath: function(directoryPath) {
      var runFunc;
      runFunc = function() {
        return $.Deferred(function(d) {
          return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            return fileSystem.root.getDirectory(directoryPath, {
              create: true,
              exclusive: false
            }, function(fileEntry) {
              console.log('Directory path: ' + fileEntry.toURL());
              return d.resolve(fileEntry);
            }, function(error) {
              return console.log('ERROR: ' + error.code);
            });
          }, _.fileSystemErrorHandler);
        });
      };
      return $.when(runFunc()).done(function() {
        return console.log('createDirectoryBasedOnDirectoryPath done');
      }).fail(_.failureHandler);
    }
  });
});
