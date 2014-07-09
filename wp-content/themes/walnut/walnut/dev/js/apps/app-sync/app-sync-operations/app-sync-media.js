define(['underscore', 'jquery'], function(_, $) {
  return _.mixin({
    startMediaSync: function() {
      return _.syncFiles('Image');
    },
    syncFiles: function(file_type) {
      var localFileList;
      localFileList = _.getListOfFilesFromLocalDirectory(file_type);
      return localFileList.done(function(localFilesList) {
        var remoteFileList;
        remoteFileList = _.getListOfMediaFilesFromServer(file_type);
        return remoteFileList.done(function(remoteFilesList) {
          var fileTobeDownloaded;
          fileTobeDownloaded = _.getFilesToBeDownloaded(localFilesList, remoteFilesList);
          return fileTobeDownloaded.done(function(files_to_be_downloaded) {
            var downloadFiles;
            if (files_to_be_downloaded.length > 0) {
              $('#syncMediaSuccess').css("display", "block").text("Downloading " + file_type + " files...");
              return downloadFiles = _.downloadMediaFiles(files_to_be_downloaded, 0, file_type);
            } else {
              $('#syncMediaSuccess').css("display", "block").text(file_type + " files already upto date");
              if (file_type === 'Image') {
                _.syncFiles('Audio');
              }
              if (file_type === 'Audio') {
                _.syncFiles('Video');
              }
              if (file_type === 'Video') {
                return setTimeout((function(_this) {
                  return function() {
                    return App.navigate('teachers/dashboard', {
                      trigger: true
                    });
                  };
                })(this), 2000);
              }
            }
          });
        });
      });
    },
    downloadMediaFiles: function(filesTobeDownloaded, index, file_type) {
      var directoryPath, directoryStructure, file, fileName, localPath, uri;
      file = filesTobeDownloaded[index];
      directoryPath = file.substr(file.indexOf("uploads/"));
      fileName = file.substr(file.lastIndexOf('/') + 1);
      if (file_type === 'Audio') {
        directoryPath = directoryPath.replace("media-web/audio-web", "audios");
      }
      $('#syncMediaSuccess').css("display", "block").text("Downloading file: \n" + fileName);
      uri = encodeURI(file);
      localPath = _.getSynapseMediaDirectoryPath() + directoryPath;
      directoryStructure = _.createDirectoryStructure(directoryPath);
      return directoryStructure.done(function() {
        var fileTransfer;
        fileTransfer = new FileTransfer();
        return fileTransfer.download(uri, localPath, function(file) {
          if (index < filesTobeDownloaded.length - 1) {
            return _.downloadMediaFiles(filesTobeDownloaded, index + 1, file_type);
          } else {
            $('#syncMediaSuccess').css("display", "block").text("Downloaded all " + file_type + " files");
            if (file_type === 'Image') {
              _.syncFiles('Audio');
            }
            if (file_type === 'Audio') {
              _.syncFiles('Video');
            }
            if (file_type === 'Video') {
              return setTimeout((function(_this) {
                return function() {
                  return App.navigate('teachers/dashboard', {
                    trigger: true
                  });
                };
              })(this), 2000);
            }
          }
        }, function(error) {
          console.log('ERROR: ' + error.code);
          $('#syncMediaSuccess').css("display", "none");
          $('#syncMediaStart').css("display", "block");
          $('syncMediaButtonText').text('Try again');
          return $('syncMediaError').css("display", "block").text('An error occurred during file download');
        }, true);
      });
    },
    getListOfFilesFromLocalDirectory: function(file_type) {
      var path, runFunc;
      if (file_type === 'Image') {
        path = 'images';
      }
      if (file_type === 'Audio') {
        path = 'audios';
      }
      if (file_type === 'Video') {
        path = 'videos';
      }
      runFunc = function() {
        return $.Deferred(function(d) {
          var localFilesList;
          localFilesList = [];
          return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            return fileSystem.root.getDirectory("SynapseAssets/SynapseMedia/uploads/" + path, {
              create: false,
              exclusive: false
            }, function(directoryEntry) {
              var reader;
              reader = directoryEntry.createReader();
              return reader.readEntries((function(entries) {
                var i, _i, _ref;
                for (i = _i = 0, _ref = entries.length - 1; _i <= _ref; i = _i += 1) {
                  localFilesList[i] = entries[i].name;
                }
                return d.resolve(localFilesList);
              }));
            }, function(error) {
              return d.resolve(localFilesList);
            });
          }, _.fileSystemErrorHandler);
        });
      };
      return $.when(runFunc()).done(function() {
        return console.log('getListOfFilesFromLocalDirectory done');
      }).fail(_.failureHandler);
    },
    getListOfMediaFilesFromServer: function(file_type) {
      var runFunc;
      runFunc = function() {
        return $.Deferred(function(d) {
          var action, data;
          if (file_type === 'Image') {
            action = 'get-site-image-resources-data';
          }
          if (file_type === 'Audio') {
            action = 'get-site-audio-resources-data';
          }
          if (file_type === 'Video') {
            action = 'get-site-video-resources-data';
          }
          data = '';
          return $.get(AJAXURL + '?action=' + action, data, (function(_this) {
            return function(resp) {
              console.log('Download details response for ' + file_type);
              console.log(resp);
              return d.resolve(resp);
            };
          })(this), 'json');
        });
      };
      return $.when(runFunc()).done(function() {
        return console.log('getListOfMediaFilesFromServer done');
      }).fail(_.failureHandler);
    },
    getFilesToBeDownloaded: function(localEntries, serverEntries) {
      var runFunc;
      runFunc = function() {
        return $.Deferred(function(d) {
          var filesTobeDownloaded;
          if (localEntries.length === 0) {
            return d.resolve(serverEntries);
          } else {
            filesTobeDownloaded = [];
            _.each(serverEntries, function(serverFile, i) {
              var fileName;
              fileName = serverFile.substr(serverFile.lastIndexOf('/') + 1);
              if (localEntries.indexOf(fileName) === -1) {
                return filesTobeDownloaded.push(serverFile);
              }
            });
            return d.resolve(filesTobeDownloaded);
          }
        });
      };
      return $.when(runFunc()).done(function() {
        return console.log('getFilesToBeDownloaded done');
      }).fail(_.failureHandler);
    }
  });
});
