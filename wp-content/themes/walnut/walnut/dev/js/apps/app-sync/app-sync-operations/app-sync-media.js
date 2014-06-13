define(['underscore', 'jquery'], function(_, $) {
  return _.mixin({
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
        return console.log('List of all files present in the directory');
      }).fail(_.failureHandler);
    },
    chkDeferred: function() {
      var directoryEntriesPresent;
      directoryEntriesPresent = _.getListOfMediaFilesFromLocalDirectory();
      return directoryEntriesPresent.done(function(local_entries) {
        if (_.isArray(local_entries)) {
          return console.log("entries" + local_entries);
        } else {
          return console.log("Error reading the directory entries array");
        }
      });
    },
    getListOfMediaFilesFromServer: function() {
      var listOfFiles;
      alert("list of files");
      listOfFiles = [];
      listOfFiles = {
        fileImg: ["1_2.jpg", "1_2_2.jpg", "1_2_3.jpg", "1_2_4.jpg", "1_2_5.jpg", "1_2_6.jpg", "1_2_7.jpg", "1_2_8.jpg", "1_2_9.jpg", "1_2_10.jpg", "1_2_11.jpg", "1_3.jpg", "1_3_2.jpg", "1_3_3.jpg", "1_3_4.jpg", "1_3_5.jpg", "1_90.jpg", "1_90_2.jpg", "1_90_3.jpg"]
      };
      return listOfFiles;
    },
    compareFiles: function(localEntries, serverEntries) {
      var checkingTheFiles;
      alert("last");
      checkingTheFiles = function() {
        return $.Deferred(function(d) {
          var filesTobeDownloaded, i, _i, _ref;
          filesTobeDownloaded = [];
          alert("image" + serverEntries.fileImg.length);
          for (i = _i = 0, _ref = serverEntries.fileImg.length - 1; _i <= _ref; i = _i += 1) {
            if (localEntries.indexOf(serverEntries.fileImg[i]) === -1) {
              filesTobeDownloaded.push(serverEntries.fileImg[i]);
            }
          }
          console.log("files needed to be dwnlded" + filesTobeDownloaded.length);
          return d.resolve(filesTobeDownloaded);
        });
      };
      return $.when(checkingTheFiles()).done(function() {
        return console.log('List of files which need to be downloaded');
      }).fail(_.failureHandler);
    },
    downloadMediaFiles: function() {
      var localFiles;
      $('#syncMediaSuccess').css("display", "block").text("Contacting server...");
      localFiles = _.getListOfMediaFilesFromLocalDirectory();
      return localFiles.done(function(local_entries) {
        var filesOnServer, filesToBeDownloaded;
        filesOnServer = _.getListOfMediaFilesFromServer();
        console.log("server list" + filesOnServer);
        filesToBeDownloaded = _.compareFiles(local_entries, filesOnServer);
        return filesToBeDownloaded.done(function(filesTobeDownloaded) {
          alert("needed to be downloaded are " + filesTobeDownloaded);
          return console.log("needed to be downloaded are " + filesTobeDownloaded);
        });
      });
    }
  });
});
