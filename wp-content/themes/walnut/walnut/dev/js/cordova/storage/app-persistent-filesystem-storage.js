define(['underscore'], function(_) {
  return _.mixin({
    setSynapseMediaDirectoryPathToLocalStorage: function() {
      var defer;
      defer = $.Deferred();
      _.cordovaCreateDirectory("SynapseAssets").then(function() {
        return _.cordovaCreateDirectory("SynapseAssets/SynapseMedia").then(function(mediaDirectoryPath) {
          return defer.resolve(_.setSynapseMediaDirectoryPath(mediaDirectoryPath));
        });
      });
      return defer.promise();
    },
    createSynapseDataDirectory: function() {
      var defer;
      defer = $.Deferred();
      _.cordovaCreateDirectory("SynapseAssets").then(function() {
        return _.cordovaCreateDirectory("SynapseAssets/SynapseData").then(function() {
          return defer.resolve(console.log('createSynapseDataDirectory done'));
        });
      });
      return defer.promise();
    },
    createDirectoriesForMediaSync: function() {
      var defer;
      defer = $.Deferred();
      _.cordovaCreateDirectory("SynapseAssets").then(function() {
        return _.cordovaCreateDirectory("SynapseAssets/SynapseMedia");
      }).then(function() {
        return _.cordovaCreateDirectory("SynapseAssets/SynapseMedia/uploads");
      }).then(function() {
        return _.cordovaCreateDirectory("SynapseAssets/SynapseMedia/uploads/images");
      }).then(function() {
        return _.cordovaCreateDirectory("SynapseAssets/SynapseMedia/uploads/audios");
      }).then(function() {
        return _.cordovaCreateDirectory("SynapseAssets/SynapseMedia/uploads/videos");
      }).then(function() {
        return defer.resolve(console.log('createDirectoriesForMediaSync done'));
      });
      return defer.promise();
    },
    createVideosWebDirectory: function() {
      var defer;
      defer = $.Deferred();
      _.cordovaCreateDirectory("SynapseAssets/SynapseMedia/uploads").then(function() {
        return _.cordovaCreateDirectory("SynapseAssets/SynapseMedia/uploads/videos-web");
      }).then(function() {
        return defer.resolve(console.log('createVideosWebDirectory done'));
      });
      return defer.promise();
    },
    createAudioWebDirectory: function() {
      var defer;
      defer = $.Deferred();
      _.cordovaCreateDirectory("SynapseAssets/SynapseMedia/uploads").then(function() {
        return _.cordovaCreateDirectory("SynapseAssets/SynapseMedia/uploads/audio-web");
      }).then(function() {
        return defer.resolve(console.log('createAudioWebDirectory done'));
      });
      return defer.promise();
    },
    cordovaCreateDirectory: function(directory) {
      var defer;
      defer = $.Deferred();
      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        return fileSystem.root.getDirectory(directory, {
          create: true,
          exclusive: false
        }, function(fileEntry) {
          console.log(directory + ' PATH: ' + fileEntry.toURL());
          return defer.resolve(fileEntry.toURL());
        }, function(error) {
          return defer.reject(console.log(directory + ' ERROR: ' + error.code));
        });
      }, _.fileSystemErrorHandler);
      return defer.promise();
    }
  });
});
