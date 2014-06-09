var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette", "app", "underscore", "csvparse"], function(Marionette, App, _, parse) {
  var SynchronizationController;
  SynchronizationController = (function(_super) {
    __extends(SynchronizationController, _super);

    function SynchronizationController() {
      this.sendParsedData14 = __bind(this.sendParsedData14, this);
      this.sendParsedData13 = __bind(this.sendParsedData13, this);
      this.sendParsedData12 = __bind(this.sendParsedData12, this);
      this.sendParsedData11 = __bind(this.sendParsedData11, this);
      this.sendParsedData10 = __bind(this.sendParsedData10, this);
      this.sendParsedData9 = __bind(this.sendParsedData9, this);
      this.sendParsedData8 = __bind(this.sendParsedData8, this);
      this.sendParsedData7 = __bind(this.sendParsedData7, this);
      this.sendParsedData6 = __bind(this.sendParsedData6, this);
      this.sendParsedData5 = __bind(this.sendParsedData5, this);
      this.sendParsedData4 = __bind(this.sendParsedData4, this);
      this.sendParsedData2 = __bind(this.sendParsedData2, this);
      this.sendParsedData1 = __bind(this.sendParsedData1, this);
      return SynchronizationController.__super__.constructor.apply(this, arguments);
    }

    SynchronizationController.prototype.getDownloadURL = function() {
      var data;
      $('#syncSuccess').css("display", "block").text("Starting file download...");
      data = {
        blog_id: _.getBlogID(),
        last_sync: ''
      };
      return $.get(AJAXURL + '?action=sync-database', data, (function(_this) {
        return function(resp) {
          console.log('RESP');
          console.log(resp);
          return _this.dwnldUnZip(resp);
        };
      })(this), 'json');
    };

    SynchronizationController.prototype.dwnldUnZip = function(resp) {
      var uri;
      $('#syncSuccess').css("display", "block").text("Downloading file...");
      uri = encodeURI(resp.exported_csv_url);
      return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (function(_this) {
        return function(fileSystem) {
          return fileSystem.root.getFile("SynapseAssets/file.zip", {
            create: true,
            exclusive: false
          }, function(fileEntry) {
            var filePath, fileTransfer;
            filePath = fileEntry.toURL().replace("file.zip", "");
            _.setFilePath(filePath);
            fileEntry.remove();
            fileTransfer = new FileTransfer();
            return fileTransfer.download(uri, filePath + "csv-synapse.zip", function(file) {
              console.log('Zip file downloaded');
              _.updateSyncDetails('file_download', resp.last_sync);
              return _this.fileUnZip(filePath, file.toURL());
            }, function(error) {
              $('#syncSuccess').css("display", "none");
              $('#syncStartContinue').css("display", "block");
              $('#syncButtonText').text('Try again');
              return $('#syncError').css("display", "block").text("An error occurred during file download");
            }, true);
          }, _.fileErrorHandler);
        };
      })(this), _.fileSystemErrorHandler);
    };

    SynchronizationController.prototype.chkReader = function(file1) {
      var read;
      read = function() {
        return $.Deferred(function(d) {
          return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (function(_this) {
            return function(fileSystem) {
              return fileSystem.root.getFile(file1, {
                create: false
              }, function(fileEntry) {
                return fileEntry.file(function(file) {
                  var reader;
                  console.log("is" + file);
                  reader = new FileReader();
                  reader.onloadend = function(evt) {
                    var csvString, parsedData;
                    csvString = evt.target.result;
                    parsedData = $.parse(csvString, {
                      header: false,
                      dynamicTyping: false
                    });
                    (function(parsedData) {
                      var i, j, _i, _ref, _results;
                      _results = [];
                      for (i = _i = 0, _ref = parsedData.results.length - 1; _i <= _ref; i = _i += 1) {
                        _results.push((function() {
                          var _j, _ref1, _results1;
                          _results1 = [];
                          for (j = _j = 0, _ref1 = parsedData.results[i].length - 1; _j <= _ref1; j = _j += 1) {
                            _results1.push(parsedData.results[i][j] = parsedData.results[i][j].replace(/\\/g, '"'));
                          }
                          return _results1;
                        })());
                      }
                      return _results;
                    })(parsedData);
                    return d.resolve(parsedData.results);
                  };
                  return reader.readAsText(file);
                }, _.fileErrorHandler);
              }, _.fileErrorHandler);
            };
          })(this), _.fileSystemErrorHandler);
        });
      };
      return $.when(read()).done(function() {
        return console.log('read done');
      }).fail(_.failureHandler);
    };

    SynchronizationController.prototype.fileUnZip = function(filePath, fullpath) {
      var success;
      $('#syncSuccess').css("display", "block").text("File download completed");
      success = (function(_this) {
        return function() {
          console.log('Files unzipped successfully');
          return setTimeout(function() {
            return _this.readUnzipFile1();
          }, 3000);
        };
      })(this);
      return zip.unzip(fullpath, filePath, success);
    };

    SynchronizationController.prototype.readUnzipFile1 = function() {
      var file, filePath;
      $('#syncSuccess').css("display", "block").text("Starting file import...");
      filePath = _.getFilePath();
      file = "SynapseAssets/" + _.getTblPrefix() + "class_divisions.csv";
      return setTimeout((function(_this) {
        return function() {
          return _this.sendParsedData1(file, filePath);
        };
      })(this), 3000);
    };

    SynchronizationController.prototype.sendParsedData1 = function(file, fileEntry) {
      var readData;
      $('#syncSuccess').css("display", "block").text("Importing file...");
      fileEntry = fileEntry;
      readData = this.chkReader(file);
      return readData.done((function(_this) {
        return function(data) {
          return _.db.transaction(function(tx) {
            var i, _i, _ref, _results;
            tx.executeSql("DELETE FROM " + _.getTblPrefix() + "class_divisions");
            _results = [];
            for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
              _results.push(tx.executeSql("INSERT INTO " + _.getTblPrefix() + "class_divisions (id, division, class_id) VALUES (?, ?, ?)", [data[i][0], data[i][1], data[i][2]]));
            }
            return _results;
          }, _.transactionErrorhandler, function(tx) {
            var file1;
            console.log('Data inserted successfully1');
            file1 = "SynapseAssets/" + _.getTblPrefix() + "question_response.csv";
            return _this.sendParsedData2(file1, fileEntry);
          });
        };
      })(this));
    };

    SynchronizationController.prototype.sendParsedData2 = function(file1, fileEntry) {
      var readData;
      fileEntry = fileEntry;
      readData = this.chkReader(file1);
      return readData.done((function(_this) {
        return function(data) {
          return _.db.transaction(function(tx) {
            var i, row, _i, _ref, _results;
            tx.executeSql("DELETE FROM " + _.getTblPrefix() + "question_response");
            _results = [];
            for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
              row = data[i];
              _results.push(tx.executeSql("INSERT INTO " + _.getTblPrefix() + "question_response (ref_id, teacher_id, content_piece_id, collection_id, division ,question_response ,time_taken ,start_date ,end_date ,status ,sync) VALUES (?,?,?,?,?,?,?,?,?,?,?)", [data[i][0], data[i][1], data[i][2], data[i][3], data[i][4], data[i][5], data[i][6], data[i][7], data[i][8], data[i][9], 1]));
            }
            return _results;
          }, _.transactionErrorhandler, function(tx) {
            var file3;
            console.log('Data inserted successfully2');
            file3 = "SynapseAssets/wp_collection_meta.csv";
            return _this.sendParsedData4(file3, fileEntry);
          });
        };
      })(this));
    };

    SynchronizationController.prototype.sendParsedData4 = function(file3, fileEntry) {
      var readData;
      readData = this.chkReader(file3);
      return readData.done((function(_this) {
        return function(data) {
          return _.db.transaction(function(tx) {
            var i, row, _i, _ref, _results;
            tx.executeSql("DELETE FROM wp_collection_meta");
            _results = [];
            for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
              row = data[i];
              _results.push(tx.executeSql("INSERT INTO wp_collection_meta (id, collection_id, meta_key, meta_value) VALUES (?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3]]));
            }
            return _results;
          }, _.transactionErrorhandler, function(tx) {
            var file4;
            console.log('Data inserted successfully4');
            file4 = "SynapseAssets/wp_content_collection.csv";
            return _this.sendParsedData5(file4, fileEntry);
          });
        };
      })(this));
    };

    SynchronizationController.prototype.sendParsedData5 = function(file4, fileEntry) {
      var readData;
      readData = this.chkReader(file4);
      return readData.done((function(_this) {
        return function(data) {
          return _.db.transaction(function(tx) {
            var i, row, _i, _ref, _results;
            tx.executeSql("DELETE FROM wp_content_collection");
            _results = [];
            for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
              row = data[i];
              _results.push(tx.executeSql("INSERT INTO wp_content_collection (id, name, created_on, created_by, last_modified_on,last_modified_by,published_on,published_by, status,type, term_ids, duration) VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3], data[i][4], data[i][5], data[i][6], data[i][7], data[i][8], data[i][9], data[i][10], data[i][11]]));
            }
            return _results;
          }, _.transactionErrorhandler, function(tx) {
            var file5;
            console.log('Data inserted successfully5');
            file5 = "SynapseAssets/wp_options.csv";
            return _this.sendParsedData6(file5, fileEntry);
          });
        };
      })(this));
    };

    SynchronizationController.prototype.sendParsedData6 = function(file5, fileEntry) {
      var readData;
      readData = this.chkReader(file5);
      return readData.done((function(_this) {
        return function(data) {
          return _.db.transaction(function(tx) {
            var i, row, _i, _ref, _results;
            tx.executeSql("DELETE FROM wp_options");
            _results = [];
            for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
              row = data[i];
              _results.push(tx.executeSql("INSERT INTO wp_options (option_id, option_name, option_value, autoload) VALUES (?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3]]));
            }
            return _results;
          }, _.transactionErrorhandler, function(tx) {
            var file6;
            console.log('Data inserted successfully6');
            file6 = "SynapseAssets/wp_postmeta.csv";
            return _this.sendParsedData7(file6, fileEntry);
          });
        };
      })(this));
    };

    SynchronizationController.prototype.sendParsedData7 = function(file6, fileEntry) {
      var readData;
      readData = this.chkReader(file6);
      return readData.done((function(_this) {
        return function(data) {
          console.log('wp_postmeta data');
          console.log(data);
          return _.db.transaction(function(tx) {
            var i, row, _i, _ref, _results;
            tx.executeSql("DELETE FROM wp_postmeta");
            _results = [];
            for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
              row = data[i];
              _results.push(tx.executeSql("INSERT INTO wp_postmeta (meta_id, post_id, meta_key, meta_value) VALUES (?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3]]));
            }
            return _results;
          }, _.transactionErrorhandler, function(tx) {
            var file7;
            console.log('Data inserted successfully7');
            file7 = "SynapseAssets/wp_posts.csv";
            return _this.sendParsedData8(file7, fileEntry);
          });
        };
      })(this));
    };

    SynchronizationController.prototype.sendParsedData8 = function(file7, fileEntry) {
      var readData;
      readData = this.chkReader(file7);
      return readData.done((function(_this) {
        return function(data) {
          return _.db.transaction(function(tx) {
            var i, row, _i, _ref, _results;
            tx.executeSql("DELETE FROM wp_posts");
            _results = [];
            for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
              row = data[i];
              _results.push(tx.executeSql("INSERT INTO wp_posts (ID,post_author,post_date,post_date_gmt,post_content,post_title,post_excerpt,post_status,comment_status,ping_status,post_password,post_name,to_ping,pinged,post_modified,post_modified_gmt,post_content_filtered,post_parent,guid,menu_order,post_type,post_mime_type,comment_count) VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3], data[i][4], data[i][5], data[i][6], data[i][7], data[i][8], data[i][9], data[i][10], data[i][11], data[i][12], data[i][13], data[i][14], data[i][15], data[i][16], data[i][17], data[i][18], data[i][19], data[i][20], data[i][21], data[i][22]]));
            }
            return _results;
          }, _.transactionErrorhandler, function(tx) {
            var file8;
            console.log('Data inserted successfully8');
            file8 = "SynapseAssets/wp_term_relationships.csv";
            return _this.sendParsedData9(file8, fileEntry);
          });
        };
      })(this));
    };

    SynchronizationController.prototype.sendParsedData9 = function(file8, fileEntry) {
      var readData;
      readData = this.chkReader(file8);
      return readData.done((function(_this) {
        return function(data) {
          return _.db.transaction(function(tx) {
            var i, row, _i, _ref, _results;
            tx.executeSql("DELETE FROM wp_term_relationships");
            _results = [];
            for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
              row = data[i];
              _results.push(tx.executeSql("INSERT INTO wp_term_relationships (object_id,term_taxonomy_id, term_order) VALUES (?, ?, ?)", [data[i][0], data[i][1], data[i][2]]));
            }
            return _results;
          }, _.transactionErrorhandler, function(tx) {
            var file9;
            console.log('Data inserted successfully9');
            file9 = "SynapseAssets/wp_term_taxonomy.csv";
            return _this.sendParsedData10(file9, fileEntry);
          });
        };
      })(this));
    };

    SynchronizationController.prototype.sendParsedData10 = function(file9, fileEntry) {
      var readData;
      readData = this.chkReader(file9);
      return readData.done((function(_this) {
        return function(data) {
          return _.db.transaction(function(tx) {
            var i, row, _i, _ref, _results;
            tx.executeSql("DELETE FROM wp_term_taxonomy");
            _results = [];
            for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
              row = data[i];
              _results.push(tx.executeSql("INSERT INTO wp_term_taxonomy (term_taxonomy_id, term_id, taxonomy, description, parent, count) VALUES (?, ?, ?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3], data[i][4], data[i][5]]));
            }
            return _results;
          }, _.transactionErrorhandler, function(tx) {
            var file10;
            console.log('Data inserted successfully10');
            file10 = "SynapseAssets/wp_terms.csv";
            return _this.sendParsedData11(file10, fileEntry);
          });
        };
      })(this));
    };

    SynchronizationController.prototype.sendParsedData11 = function(file10, fileEntry) {
      var readData;
      readData = this.chkReader(file10);
      return readData.done((function(_this) {
        return function(data) {
          return _.db.transaction(function(tx) {
            var i, row, _i, _ref, _results;
            tx.executeSql("DELETE FROM wp_terms");
            _results = [];
            for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
              row = data[i];
              _results.push(tx.executeSql("INSERT INTO wp_terms (term_id, name, slug, term_group) VALUES (?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3]]));
            }
            return _results;
          }, _.transactionErrorhandler, function(tx) {
            var file11;
            console.log('Data inserted successfully11');
            file11 = "SynapseAssets/wp_textbook_relationships.csv";
            return _this.sendParsedData12(file11, fileEntry);
          });
        };
      })(this));
    };

    SynchronizationController.prototype.sendParsedData12 = function(file11, fileEntry) {
      var readData;
      readData = this.chkReader(file11);
      return readData.done((function(_this) {
        return function(data) {
          return _.db.transaction(function(tx) {
            var i, row, _i, _ref, _results;
            tx.executeSql("DELETE FROM wp_textbook_relationships");
            _results = [];
            for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
              row = data[i];
              _results.push(tx.executeSql("INSERT INTO wp_textbook_relationships (id, textbook_id, class_id, tags) VALUES (?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3]]));
            }
            return _results;
          }, _.transactionErrorhandler, function(tx) {
            var file12;
            console.log('Data inserted successfully12');
            file12 = "SynapseAssets/wp_usermeta.csv";
            return _this.sendParsedData13(file12, fileEntry);
          });
        };
      })(this));
    };

    SynchronizationController.prototype.sendParsedData13 = function(file12, fileEntry) {
      var readData;
      readData = this.chkReader(file12);
      return readData.done((function(_this) {
        return function(data) {
          return _.db.transaction(function(tx) {
            var i, row, _i, _ref, _results;
            tx.executeSql("DELETE FROM wp_usermeta");
            _results = [];
            for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
              row = data[i];
              _results.push(tx.executeSql("INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3]]));
            }
            return _results;
          }, _.transactionErrorhandler, function(tx) {
            var file13;
            console.log('Data inserted successfully13');
            file13 = "SynapseAssets/wp_users.csv";
            return _this.sendParsedData14(file13, fileEntry);
          });
        };
      })(this));
    };

    SynchronizationController.prototype.sendParsedData14 = function(file13, fileEntry) {
      var readData;
      readData = this.chkReader(file13);
      return readData.done((function(_this) {
        return function(data) {
          return _.db.transaction(function(tx) {
            var i, row, _i, _ref, _results;
            tx.executeSql("DELETE FROM wp_users");
            _results = [];
            for (i = _i = 0, _ref = data.length - 1; _i <= _ref; i = _i += 1) {
              row = data[i];
              _results.push(tx.executeSql("INSERT INTO wp_users (ID, user_login, user_pass, user_nicename,user_email,user_url,user_registered,user_activation_key, user_status,display_name, spam,deleted) VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?)", [data[i][0], data[i][1], data[i][2], data[i][3], data[i][4], data[i][5], data[i][6], data[i][7], data[i][8], data[i][9], data[i][10], data[i][11]]));
            }
            return _results;
          }, _.transactionErrorhandler, function(tx) {
            console.log('Data inserted successfully14');
            _.updateSyncDetails('file_import', _.getCurrentDateTime(2));
            $('#syncSuccess').css("display", "block").text("File import completed");
            setTimeout(function() {
              $('#syncSuccess').css("display", "block").text("Sync completed successfully");
              return App.execute("show:leftnavapp", {
                region: App.leftNavRegion
              });
            }, 2000);
            return setTimeout(function() {
              return App.navigate('teachers/dashboard', {
                trigger: true
              });
            }, 3000);
          });
        };
      })(this));
    };

    return SynchronizationController;

  })(Marionette.Controller);
  return App.reqres.setHandler("get:sync:controller", function() {
    return new SynchronizationController;
  });
});
