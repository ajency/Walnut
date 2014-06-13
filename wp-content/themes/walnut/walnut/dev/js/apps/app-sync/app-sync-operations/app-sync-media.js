define(['underscore', 'jquery'], function(_, $) {
  return _.mixin({
    downloadMediaFiles: function() {
      var localFiles;
      $('#syncMediaSuccess').css("display", "block").text("Contacting server...");
      localFiles = _.getListOfMediaFilesFromLocalDirectory();
      return localFiles.done(function(local_entries) {
        var filesOnServer, filesToBeDownloaded;
        filesOnServer = _.getListOfMediaFilesFromServer();
        filesToBeDownloaded = _.compareFiles(local_entries, filesOnServer);
        return _.each(filesToBeDownloaded, function(file, i) {
          var directoryPath, directoryStructure;
          directoryPath = file.substr(file.indexOf("uploads/"));
          directoryStructure = _.createDirectoryStructure(directoryPath);
          return directoryStructure.done(function() {
            return console.log('Directory successfully created');
          });
        });
      });
    },
    compareFiles: function(localEntries, serverEntries) {
      var filesTobeDownloaded;
      filesTobeDownloaded = [];
      _.each(serverEntries.fileImg, function(serverFile, i) {
        var fileName;
        fileName = serverFile[i].substr(serverFile[i].lastIndexOf('/') + 1);
        if (localEntries.indexOf(fileName) === -1) {
          return filesTobeDownloaded.push(serverFile[i]);
        }
      });
      return filesTobeDownloaded;
    },
    getListOfMediaFilesFromLocalDirectory: function() {
      var listOfPresentFilesInDirectory;
      listOfPresentFilesInDirectory = function() {
        return $.Deferred(function(d) {
          var fullDirectoryEntry;
          fullDirectoryEntry = [];
          return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            return fileSystem.root.getDirectory("SynapseAssets/SynapseImages", {
              create: false,
              exclusive: false
            }, function(directoryEnrty) {
              var reader;
              reader = directoryEnrty.createReader();
              return reader.readEntries((function(directoryEnrty) {
                var i, _i, _ref;
                for (i = _i = 0, _ref = directoryEnrty.length - 1; _i <= _ref; i = _i += 1) {
                  console.log(directoryEnrty[i].name + ' dir? ' + directoryEnrty[i].isDirectory);
                  console.log("your path is " + directoryEnrty[i].toURL());
                  fullDirectoryEntry[i] = directoryEnrty[i].name;
                }
                console.log("value is " + fullDirectoryEntry);
                return d.resolve(fullDirectoryEntry);
              }));
            }, function(error) {
              return d.resolve(error);
            });
          }, _.fileSystemErrorHandler);
        });
      };
      return $.when(listOfPresentFilesInDirectory()).done(function() {
        return console.log('Got list of all files present in the directory');
      }).fail(_.failureHandler);
    },
    getListOfMediaFilesFromServer: function() {
      var listOfFiles;
      listOfFiles = [];
      listOfFiles = {
        fileImg: ["http://synapsedu.info/wp-content/uploads/videos/oceans-clip.mp4", "http://synapsedu.info/wp-content/uploads/2014/05/tux.png", "http://synapsedu.info/wp-content/uploads/2014/05/Vertical-large.jpg", "http://synapsedu.info/wp-content/uploads/2014/05/imag56es.jpg", "http://synapsedu.info/wp-content/uploads/2014/05/girl1.jpg", "http://synapsedu.info/wp-content/uploads/2014/05/tom_jerry.jpg", "http://synapsedu.info/wp-content/uploads/2014/05/cover_pic1.png", "http://synapsedu.info/wp-content/uploads/2014/06/Tulips.jpg", "http://synapsedu.info/wp-content/uploads/2014/06/Jellyfish.jpg", "http://synapsedu.info/wp-content/uploads/2014/06/Koala.jpg", "http://synapsedu.info/wp-content/uploads/2014/06/Lighthouse.jpg"]
      };
      return listOfFiles;
    }
  });
});
