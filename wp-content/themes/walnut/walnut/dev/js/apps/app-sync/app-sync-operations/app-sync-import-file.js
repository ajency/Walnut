define(['underscore', 'csvparse'], function(_) {
  return _.mixin({
    startFileImport: function() {
      $('#syncSuccess').css("display", "block").text("Starting file import...");
      return setTimeout((function(_this) {
        return function() {
          return _.insertIntoWpClassDivisions();
        };
      })(this), 2000);
    },
    parseCSVToJSON: function(fileName) {
      var filepath, option, readFile, value;
      value = _.getStorageOption();
      option = JSON.parse(value);
      if (option.internal) {
        filepath = option.internal;
      } else if (option.external) {
        filepath = option.external;
      }
      readFile = function() {
        return $.Deferred(function(d) {
          return window.resolveLocalFileSystemURL('file://' + filepath + '', function(fileSystem) {
            return fileSystem.getFile("SynapseAssets/SynapseData/" + fileName, {
              create: false
            }, function(fileEntry) {
              return fileEntry.file(function(file) {
                var reader;
                reader = new FileReader();
                reader.onloadend = function(evt) {
                  var csvString, parsedData, parsedObj;
                  csvString = evt.target.result;
                  parsedObj = Papa.parse(csvString, {
                    header: false,
                    dynamicTyping: false
                  });
                  parsedData = parsedObj.data;
                  (function(parsedData) {
                    return _.each(parsedData, function(outerRow, i) {
                      return _.each(outerRow, function(innerRow, j) {
                        return parsedData[i][j] = parsedData[i][j].replace(/\\/g, '');
                      });
                    });
                  })(parsedData);
                  return d.resolve(parsedData);
                };
                return reader.readAsText(file);
              }, _.fileErrorHandler);
            }, _.fileErrorHandler);
          }, _.fileSystemErrorHandler);
        });
      };
      return $.when(readFile()).done(function() {
        return console.log('parseCSVToJSON done for file ' + fileName);
      }).fail(_.failureHandler);
    },
    insertIntoWpClassDivisions: function() {
      var getParsedData;
      _.importingFileMessage(1);
      getParsedData = _.parseCSVToJSON(_.getTblPrefix() + 'class_divisions.csv');
      return getParsedData.done(function(data) {
        return _.db.transaction(function(tx) {
          tx.executeSql("DELETE FROM " + _.getTblPrefix() + "class_divisions");
          return _.each(data, function(row, i) {
            return tx.executeSql("INSERT INTO " + _.getTblPrefix() + "class_divisions (id , division, class_id) VALUES (?,?,?)", [row[0], row[1], row[2]]);
          });
        }, _.transactionErrorhandler, function(tx) {
          console.log('Inserted data in ' + _.getTblPrefix() + 'class_divisions');
          return _.insertIntoWpQuizQuestionResponse();
        });
      });
    },
    insertIntoWpQuizQuestionResponse: function() {
      var getParsedData;
      _.importingFileMessage(2);
      getParsedData = _.parseCSVToJSON(_.getTblPrefix() + 'quiz_question_response.csv');
      return getParsedData.done(function(data) {
        return _.db.transaction(function(tx) {
          tx.executeSql("DELETE FROM " + _.getTblPrefix() + "quiz_question_response");
          return _.each(data, function(row, i) {
            return tx.executeSql("INSERT INTO " + _.getTblPrefix() + "quiz_question_response (qr_id , summary_id, content_piece_id, question_response, time_taken , marks_scored, status, sync) VALUES (?,?,?,?,?,?,?,?)", [row[0], row[1], row[2], row[3], row[4], row[5], row[6], 1]);
          });
        }, _.transactionErrorhandler, function(tx) {
          console.log('Inserted data in ' + _.getTblPrefix() + 'quiz_question_response');
          return _.insertIntoWpQuizResponseSummary();
        });
      });
    },
    insertIntoWpQuizResponseSummary: function() {
      var getParsedData;
      _.importingFileMessage(3);
      getParsedData = _.parseCSVToJSON(_.getTblPrefix() + 'quiz_response_summary.csv');
      return getParsedData.done(function(data) {
        return _.db.transaction(function(tx) {
          tx.executeSql("DELETE FROM " + _.getTblPrefix() + "quiz_response_summary");
          return _.each(data, function(row, i) {
            return tx.executeSql("INSERT INTO " + _.getTblPrefix() + "quiz_response_summary (summary_id, collection_id, student_id, taken_on, quiz_meta, sync) VALUES (?,?,?,?,?,?)", [row[0], row[1], row[2], row[3], row[4], 1]);
          });
        }, _.transactionErrorhandler, function(tx) {
          console.log('Inserted data in ' + _.getTblPrefix() + 'quiz_response_summary');
          return _.insertIntoWpCollectionMeta();
        });
      });
    },
    insertIntoWpCollectionMeta: function() {
      var getParsedData;
      _.importingFileMessage(4);
      getParsedData = _.parseCSVToJSON('wp_collection_meta.csv');
      return getParsedData.done(function(data) {
        return _.db.transaction(function(tx) {
          return _.each(data, function(row, i) {
            return tx.executeSql("INSERT OR REPLACE INTO wp_collection_meta (id, collection_id , meta_key, meta_value) VALUES (?,?,?,?)", [row[0], row[1], row[2], row[3]]);
          });
        }, _.transactionErrorhandler, function(tx) {
          console.log('Inserted data in wp_collection_meta');
          return _.insertIntoWpContentCollection();
        });
      });
    },
    insertIntoWpContentCollection: function() {
      var getParsedData;
      _.importingFileMessage(5);
      getParsedData = _.parseCSVToJSON('wp_content_collection.csv');
      return getParsedData.done(function(data) {
        return _.db.transaction(function(tx) {
          return _.each(data, function(row, i) {
            return tx.executeSql("INSERT OR REPLACE INTO wp_content_collection (id, name, created_on , created_by, last_modified_on, last_modified_by, published_on, published_by , post_status, type, term_ids, duration) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", [row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10], row[11]]);
          });
        }, _.transactionErrorhandler, function(tx) {
          console.log('Inserted data in wp_content_collection');
          return _.insertIntoWpOptions();
        });
      });
    },
    insertIntoWpOptions: function() {
      var getParsedData;
      _.importingFileMessage(6);
      getParsedData = _.parseCSVToJSON('wp_options.csv');
      return getParsedData.done(function(data) {
        return _.db.transaction(function(tx) {
          return _.each(data, function(row, i) {
            return tx.executeSql("INSERT OR REPLACE INTO wp_options (option_id, option_name , option_value, autoload) VALUES (?,?,?,?)", [row[0], row[1], row[2], row[3]]);
          });
        }, _.transactionErrorhandler, function(tx) {
          console.log('Inserted data in wp_options');
          return _.insertIntoWpPostMeta();
        });
      });
    },
    insertIntoWpPostMeta: function() {
      var getParsedData;
      _.importingFileMessage(7);
      getParsedData = _.parseCSVToJSON('wp_postmeta.csv');
      return getParsedData.done(function(data) {
        var insertRecords, splitArray;
        splitArray = _.groupBy(data, function(element, index) {
          return Math.floor(index / 2000);
        });
        splitArray = _.toArray(splitArray);
        insertRecords = function(splitData, index) {
          return _.db.transaction(function(tx) {
            return _.each(splitData, function(row, i) {
              return tx.executeSql("INSERT OR REPLACE INTO wp_postmeta (meta_id, post_id , meta_key, meta_value) VALUES (?,?,?,?)", [row[0], row[1], row[2], row[3]]);
            });
          }, _.transactionErrorHandler, function(tx) {
            console.log('Inserted data in wp_postmeta');
            index = index + 1;
            if (index < splitArray.length) {
              return setTimeout(function() {
                return insertRecords(splitArray[index], index);
              }, 100);
            } else {
              return _.insertIntoWpPosts();
            }
          });
        };
        return insertRecords(splitArray[0], 0);
      });
    },
    insertIntoWpPosts: function() {
      var getParsedData;
      _.importingFileMessage(8);
      getParsedData = _.parseCSVToJSON('wp_posts.csv');
      return getParsedData.done(function(data) {
        return _.db.transaction(function(tx) {
          return _.each(data, function(row, i) {
            return tx.executeSql("INSERT OR REPLACE INTO wp_posts (ID, post_author, post_date , post_date_gmt, post_content, post_title, post_excerpt, post_status , comment_status, ping_status, post_password, post_name, to_ping, pinged , post_modified, post_modified_gmt, post_content_filtered, post_parent , guid, menu_order, post_type, post_mime_type, comment_count) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10], row[11], row[12], row[13], row[14], row[15], row[16], row[17], row[18], row[19], row[20], row[21], row[22]]);
          });
        }, _.transactionErrorhandler, function(tx) {
          console.log('Inserted data in wp_posts');
          return _.insertIntoWpTermRelationships();
        });
      });
    },
    insertIntoWpTermRelationships: function() {
      var getParsedData;
      _.importingFileMessage(9);
      getParsedData = _.parseCSVToJSON('wp_term_relationships.csv');
      return getParsedData.done(function(data) {
        return _.db.transaction(function(tx) {
          return _.each(data, function(row, i) {
            return tx.executeSql("INSERT OR REPLACE INTO wp_term_relationships (object_id, term_taxonomy_id , term_order) VALUES (?,?,?)", [row[0], row[1], row[2]]);
          });
        }, _.transactionErrorhandler, function(tx) {
          console.log('Inserted data in wp_term_relationships');
          return _.insertIntoWpTermTaxonomy();
        });
      });
    },
    insertIntoWpTermTaxonomy: function() {
      var getParsedData;
      _.importingFileMessage(10);
      getParsedData = _.parseCSVToJSON('wp_term_taxonomy.csv');
      return getParsedData.done(function(data) {
        return _.db.transaction(function(tx) {
          return _.each(data, function(row, i) {
            return tx.executeSql("INSERT OR REPLACE INTO wp_term_taxonomy (term_taxonomy_id, term_id, taxonomy , description, parent, count) VALUES (?,?,?,?,?,?)", [row[0], row[1], row[2], row[3], row[4], row[5]]);
          });
        }, _.transactionErrorhandler, function(tx) {
          console.log('Inserted data in wp_term_taxonomy');
          return _.insertIntoWpTerms();
        });
      });
    },
    insertIntoWpTerms: function() {
      var getParsedData;
      _.importingFileMessage(11);
      getParsedData = _.parseCSVToJSON('wp_terms.csv');
      return getParsedData.done(function(data) {
        return _.db.transaction(function(tx) {
          return _.each(data, function(row, i) {
            return tx.executeSql("INSERT OR REPLACE INTO wp_terms (term_id, name, slug, term_group) VALUES (?,?,?,?)", [row[0], row[1], row[2], row[3]]);
          });
        }, _.transactionErrorhandler, (function(_this) {
          return function(tx) {
            console.log('Inserted data in wp_terms');
            return _.insertIntoWpTextbookRelationships();
          };
        })(this));
      });
    },
    insertIntoWpTextbookRelationships: function() {
      var getParsedData;
      _.importingFileMessage(12);
      getParsedData = _.parseCSVToJSON('wp_textbook_relationships.csv');
      return getParsedData.done(function(data) {
        return _.db.transaction(function(tx) {
          return _.each(data, function(row, i) {
            return tx.executeSql("INSERT OR REPLACE INTO wp_textbook_relationships (id, textbook_id, class_id, tags) VALUES (?,?,?,?)", [row[0], row[1], row[2], row[3]]);
          });
        }, _.transactionErrorhandler, function(tx) {
          console.log('Inserted data in wp_textbook_relationships');
          return _.insertIntoWpUserMeta();
        });
      });
    },
    insertIntoWpUserMeta: function() {
      var getParsedData;
      _.importingFileMessage(13);
      getParsedData = _.parseCSVToJSON('wp_usermeta.csv');
      return getParsedData.done(function(data) {
        return _.db.transaction(function(tx) {
          return _.each(data, function(row, i) {
            return tx.executeSql("INSERT OR REPLACE INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (?,?,?,?)", [row[0], row[1], row[2], row[3]]);
          });
        }, _.transactionErrorhandler, function(tx) {
          console.log('Inserted data in wp_usermeta');
          return _.insertIntoWpUsers();
        });
      });
    },
    insertIntoWpUsers: function() {
      var getParsedData;
      _.importingFileMessage(14);
      getParsedData = _.parseCSVToJSON('wp_users.csv');
      return getParsedData.done(function(data) {
        return _.db.transaction(function(tx) {
          return _.each(data, function(row, i) {
            return tx.executeSql("INSERT OR REPLACE INTO wp_users (ID, user_login, user_pass, user_nicename , user_email, user_url, user_registered, user_activation_key, user_status , display_name, spam,deleted) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", [row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10], row[11]]);
          });
        }, _.transactionErrorhandler, function(tx) {
          console.log('Inserted data in wp_users');
          return _.insertIntoWpQuizSchedules();
        });
      });
    },
    insertIntoWpQuizSchedules: function() {
      var getParsedData;
      _.importingFileMessage(15);
      getParsedData = _.parseCSVToJSON(_.getTblPrefix() + 'quiz_schedules.csv');
      return getParsedData.done(function(data) {
        return _.db.transaction(function(tx) {
          tx.executeSql("DELETE FROM " + _.getTblPrefix() + "quiz_schedules");
          return _.each(data, function(row, i) {
            return tx.executeSql("INSERT OR REPLACE INTO " + _.getTblPrefix() + "quiz_schedules (quiz_id, division_id, schedule_from, schedule_to) VALUES (?,?,?,?)", [row[0], row[1], row[2], row[3]]);
          });
        }, _.transactionErrorhandler, function(tx) {
          console.log('Inserted data ' + _.getTblPrefix() + 'quiz_schedules');
          return _.onFileImportSuccess();
        });
      });
    },
    importingFileMessage: function(file_number) {
      return $('#syncSuccess').css("display", "block").text("Importing files... (" + file_number + ")");
    },
    onFileImportSuccess: function() {
      _.updateSyncDetails('file_import', _.getCurrentDateTime(2));
      _.clearSynapseDataDirectory();
      $('#syncSuccess').css("display", "block").text("File import completed");
      setTimeout((function(_this) {
        return function() {
          $('#syncSuccess').css("display", "block").text("Sync completed successfully");
          return $('#main-menu-toggle').css('display', 'block');
        };
      })(this), 2000);
      return setTimeout((function(_this) {
        return function() {
          return App.navigate('students/dashboard', {
            trigger: true
          });
        };
      })(this), 2000);
    }
  });
});
