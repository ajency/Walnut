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
    cordovaCheckIfPathExists: function(filepath) {
      var defer;
      defer = $.Deferred();
      window.resolveLocalFileSystemURL('file://' + filepath + '', function(fileEntry) {
        return fileEntry.getDirectory("tempSA", {
          create: true,
          exclusive: false
        }, function(entry) {
          console.log('tempSA directory path: ' + entry.toURL());
          entry.remove(function() {
            return console.log("Sucess");
          }, function() {
            return console.log("error");
          });
          return defer.resolve(true);
        }, function(error) {
          defer.resolve(false);
          return console.log('ERROR: ' + error.code);
        });
      }, function() {
        console.log('resolveLocalFileSystemURL error ');
        return defer.resolve(false);
      });
      return defer.promise();
    },
    cordovaCreateDirectory: function(directory) {
      var defer, filepath, option, value;
      defer = $.Deferred();
      value = _.getStorageOption();
      option = JSON.parse(value);
      if (option.internal) {
        filepath = option.internal;
      } else if (option.external) {
        filepath = option.external;
      }
      window.resolveLocalFileSystemURL('file://' + filepath + '', function(fileEntry) {
        return fileEntry.getDirectory(directory, {
          create: true,
          exclusive: false
        }, function(entry) {
          console.log('directory path: ' + entry.toURL());
          return defer.resolve(entry.toURL());
        }, function(error) {
          defer.resolve(false);
          return console.log('ERROR: ' + error.code);
        });
      }, function() {
        console.log('cordovaCreateDirectory error ');
        return defer.resolve(false);
      });
      return defer.promise();
    }
  });
});
