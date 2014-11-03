define(['underscore'], function(_) {
  return _.mixin({
    setSynapseMediaDirectoryPathToLocalStorage: function() {
      var synapseMediaDirectory;
      synapseMediaDirectory = _.createSynapseMediaDirectory();
      return synapseMediaDirectory.done(function() {
        return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
          return fileSystem.root.getDirectory("SynapseAssets/SynapseMedia", {
            create: false,
            exclusive: false
          }, function(fileEntry) {
            console.log('SynapseMedia directory path: ' + fileEntry.toURL() + '/');
            return _.setSynapseMediaDirectoryPath(fileEntry.toURL() + '/');
          }, function(error) {
            return console.log('ERROR: ' + error.code);
          });
        }, _.fileSystemErrorHandler);
      });
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
    createSynapseMediaDirectory: function() {
      var runFunc;
      runFunc = function() {
        return $.Deferred(function(d) {
          var synapseAssetsDirectory;
          synapseAssetsDirectory = _.createSynapseAssetsDirectory();
          return synapseAssetsDirectory.done(function() {
            return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
              return fileSystem.root.getDirectory("SynapseAssets/SynapseMedia", {
                create: true,
                exclusive: false
              }, function(fileEntry) {
                console.log('SynapseMedia directory path: ' + fileEntry.toURL());
                return d.resolve(fileEntry);
              }, function(error) {
                return console.log('ERROR: ' + error.code);
              });
            }, _.fileSystemErrorHandler);
          });
        });
      };
      return $.when(runFunc()).done(function() {
        return console.log('createSynapseMediaDirectory done');
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
    createVideosWebDirectory: function() {
      var runFunc;
      runFunc = function() {
        return $.Deferred(function(d) {
          return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            return fileSystem.root.getDirectory("SynapseAssets/SynapseMedia/uploads/videos-web", {
              create: true,
              exclusive: false
            }, function(fileEntry) {
              console.log('videos-web directory path: ' + fileEntry.toURL());
              return d.resolve(fileEntry);
            }, function(error) {
              return console.log('ERROR: ' + error.code);
            });
          }, _.fileSystemErrorHandler);
        });
      };
      return $.when(runFunc()).done(function() {
        return console.log('createVideosWebDirectory done');
      }).fail(_.failureHandler);
    },
    createAudiosWebDirectory: function() {
      var runFunc;
      runFunc = function() {
        return $.Deferred(function(d) {
          return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            return fileSystem.root.getDirectory("SynapseAssets/SynapseMedia/uploads/audio-web", {
              create: true,
              exclusive: false
            }, function(fileEntry) {
              console.log('audios-web directory path: ' + fileEntry.toURL());
              return d.resolve(fileEntry);
            }, function(error) {
              return console.log('ERROR: ' + error.code);
            });
          }, _.fileSystemErrorHandler);
        });
      };
      return $.when(runFunc()).done(function() {
        return console.log('createAudiosWebDirectory done');
      }).fail(_.failureHandler);
    },
    createDirectoryStructure: function(path) {
      var runFunc;
      runFunc = function() {
        return $.Deferred(function(d) {
          var directoryPath, synapseImagesDirectory;
          directoryPath = "SynapseAssets/SynapseMedia";
          synapseImagesDirectory = _.createSynapseMediaDirectory();
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
