define(['underscore', 'jquery'], function(_, $) {
  return _.mixin({
    downloadMediaFiles: function() {
      var localFiles;
      $('#syncMediaSuccess').css("display", "block").text("Contacting server...");
      localFiles = _.getListOfMediaFilesFromLocalDirectory();
      return localFiles.done(function(local_entries) {
        var filesOnServer;
        console.log('local_entries');
        console.log(local_entries);
        filesOnServer = _.getListOfMediaFilesFromServer();
        return filesOnServer.done(function(files_on_server) {
          var filesToBeDownloaded;
          filesToBeDownloaded = _.compareFiles(local_entries, files_on_server);
          return filesToBeDownloaded.done(function(files_to_be_downloaded) {
            $('#syncMediaSuccess').css("display", "block").text("Downloading files...");
            return _.each(files_to_be_downloaded, function(file, i) {
              var directoryPath, directoryStructure, fileName, localPath, uri;
              directoryPath = file.substr(file.indexOf("uploads/"));
              fileName = file.substr(file.lastIndexOf('/') + 1);
              uri = encodeURI(file);
              localPath = _.getSynapseImagesDirectoryPath() + directoryPath;
              directoryStructure = _.createDirectoryStructure(directoryPath);
              return directoryStructure.done(function() {
                var fileTransfer;
                fileTransfer = new FileTransfer();
                return fileTransfer.download(uri, localPath, function(file) {
                  return $('#syncMediaSuccess').css("display", "block").text("Downloaded file " + fileName);
                }, function(error) {
                  $('#syncMediaSuccess').css("display", "none");
                  return $('#syncMediaError').css("display", "block").text("An error occurred during file download.");
                }, true);
              });
            });
          });
        });
      });
    },
    compareFiles: function(localEntries, serverEntries) {
      var runFunc;
      runFunc = function() {
        return $.Deferred(function(d) {
          var filesTobeDownloaded;
          if (localEntries.length === 0) {
            return d.resolve(serverEntries.fileImg);
          } else {
            filesTobeDownloaded = [];
            _.each(serverEntries.fileImg, function(serverFile, i) {
              var fileName;
              fileName = serverFile[i].substr(serverFile[i].lastIndexOf('/') + 1);
              if (localEntries.indexOf(fileName) === -1) {
                return filesTobeDownloaded.push(serverFile[i]);
              }
            });
            return d.resolve(filesTobeDownloaded);
          }
        });
      };
      return $.when(runFunc()).done(function() {
        return console.log('compareFiles done');
      }).fail(_.failureHandler);
    },
    getListOfMediaFilesFromLocalDirectory: function() {
      var runFunc;
      runFunc = function() {
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
                  fullDirectoryEntry[i] = directoryEnrty[i].name;
                }
                return d.resolve(fullDirectoryEntry);
              }));
            }, function(error) {
              return d.resolve(error);
            });
          }, _.fileSystemErrorHandler);
        });
      };
      return $.when(runFunc()).done(function() {
        return console.log('Got list of all files present in the local directory');
      }).fail(_.failureHandler);
    },
    getListOfMediaFilesFromServer: function() {
      var runFunc;
      runFunc = function() {
        return $.Deferred(function(d) {
          var listOfFiles;
          listOfFiles = [];
          listOfFiles = {
            fileImg: ["http://synapsedu.info/wp-content/uploads/videos/oceans-clip.mp4", "http://synapsedu.info/wp-content/uploads/2014/05/tux.png", "http://synapsedu.info/wp-content/uploads/2014/05/Vertical-large.jpg", "http://synapsedu.info/wp-content/uploads/2014/05/imag56es.jpg", "http://synapsedu.info/wp-content/uploads/2014/05/girl1.jpg", "http://synapsedu.info/wp-content/uploads/2014/05/tom_jerry.jpg", "http://synapsedu.info/wp-content/uploads/2014/05/cover_pic1.png", "http://synapsedu.info/wp-content/uploads/2014/06/Tulips.jpg", "http://synapsedu.info/wp-content/uploads/2014/06/Jellyfish.jpg", "http://synapsedu.info/wp-content/uploads/2014/06/Koala.jpg", "http://synapsedu.info/wp-content/uploads/2014/06/Lighthouse.jpg"]
          };
          return d.resolve(listOfFiles);
        });
      };
      return $.when(runFunc()).done(function() {
        return console.log('getListOfMediaFilesFromServer done');
      }).fail(_.failureHandler);
    }
  });
});
