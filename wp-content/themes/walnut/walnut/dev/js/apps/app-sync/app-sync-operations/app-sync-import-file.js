define(['underscore', 'csvparse'], function(_, parse) {
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
      var readFile;
      readFile = function() {
        return $.Deferred(function(d) {
          return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            return fileSystem.root.getFile("SynapseAssets/SynapseData/" + fileName, {
              create: false
            }, function(fileEntry) {
              return fileEntry.file(function(file) {
                var reader;
                reader = new FileReader();
                reader.onloadend = function(evt) {
                  var csvString, parsedData, parsedObj;
                  csvString = evt.target.result;
                  parsedObj = $.parse(csvString, {
                    header: false,
                    dynamicTyping: false
                  });
                  parsedData = parsedObj.results;
                  (function(parsedData) {
                    return _.each(parsedData, function(outerRow, i) {
                      return _.each(outerRow, function(innerRow, j) {
                        return parsedData[i][j] = parsedData[i][j].replace(/\\/g, '"');
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
      $('#syncSuccess').css("display", "block").text("Importing file...");
      getParsedData = _.parseCSVToJSON(_.getTblPrefix() + 'class_divisions.csv');
      return getParsedData.done(function(data) {
        return _.db.transaction(function(tx) {
          tx.executeSql("DELETE FROM " + _.getTblPrefix() + "class_divisions");
          return _.each(data, function(row, i) {
            return tx.executeSql("INSERT INTO " + _.getTblPrefix() + "class_divisions (id , division, class_id) VALUES (?,?,?)", [row[0], row[1], row[2]]);
          });
        }, _.transactionErrorhandler, function(tx) {
          console.log('Inserted data in ' + _.getTblPrefix() + 'class_divisions');
          return _.insertIntoWpQuestionResponse();
        });
      });
    },
    insertIntoWpQuestionResponse: function() {
      var getParsedData;
      getParsedData = _.parseCSVToJSON(_.getTblPrefix() + 'question_response.csv');
      return getParsedData.done(function(data) {
        return _.db.transaction(function(tx) {
          tx.executeSql("DELETE FROM " + _.getTblPrefix() + "question_response");
          return _.each(data, function(row, i) {
            return tx.executeSql("INSERT INTO " + _.getTblPrefix() + "question_response (ref_id , teacher_id, content_piece_id, collection_id, division , question_response , time_taken , start_date, end_date, status, sync) VALUES (?,?,?,?,?,?,?,?,?,?,?)", [row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], 1]);
          });
        }, _.transactionErrorhandler, function(tx) {
          console.log('Inserted data in ' + _.getTblPrefix() + 'question_response');
          return _.insertIntoWpCollectionMeta();
        });
      });
    },
    insertIntoWpCollectionMeta: function() {
      var getParsedData;
      getParsedData = _.parseCSVToJSON('wp_collection_meta.csv');
      return getParsedData.done(function(data) {
        return _.db.transaction(function(tx) {
          tx.executeSql("DELETE FROM wp_collection_meta");
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
      getParsedData = _.parseCSVToJSON('wp_content_collection.csv');
      return getParsedData.done(function(data) {
        return _.db.transaction(function(tx) {
          tx.executeSql("DELETE FROM wp_content_collection");
          return _.each(data, function(row, i) {
            return tx.executeSql("INSERT OR REPLACE INTO wp_content_collection (id, name, created_on , created_by, last_modified_on, last_modified_by, published_on, published_by , status, type, term_ids, duration) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", [row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10], row[11]]);
          });
        }, _.transactionErrorhandler, function(tx) {
          console.log('Inserted data in wp_content_collection');
          return _.insertIntoWpOptions();
        });
      });
    },
    insertIntoWpOptions: function() {
      var getParsedData;
      getParsedData = _.parseCSVToJSON('wp_options.csv');
      return getParsedData.done(function(data) {
        return _.db.transaction(function(tx) {
          tx.executeSql("DELETE FROM wp_options");
          return _.each(data, function(row, i) {
            return tx.executeSql("INSERT INTO wp_options (option_id, option_name , option_value, autoload) VALUES (?,?,?,?)", [row[0], row[1], row[2], row[3]]);
          });
        }, _.transactionErrorhandler, function(tx) {
          console.log('Inserted data in wp_options');
          return _.insertIntoWpPostMeta();
        });
      });
    },
    insertIntoWpPostMeta: function() {
      var getParsedData;
      getParsedData = _.parseCSVToJSON('wp_postmeta.csv');
      return getParsedData.done(function(data) {
        return _.db.transaction(function(tx) {
          tx.executeSql("DELETE FROM wp_postmeta");
          return _.each(data, function(row, i) {
            return tx.executeSql("INSERT OR REPLACE INTO wp_postmeta (meta_id, post_id , meta_key, meta_value) VALUES (?,?,?,?)", [row[0], row[1], row[2], row[3]]);
          });
        }, _.transactionErrorhandler, function(tx) {
          console.log('Inserted data in wp_postmeta');
          return _.insertIntoWpPosts();
        });
      });
    },
    insertIntoWpPosts: function() {
      var getParsedData;
      getParsedData = _.parseCSVToJSON('wp_posts.csv');
      return getParsedData.done(function(data) {
        return _.db.transaction(function(tx) {
          tx.executeSql("DELETE FROM wp_posts");
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
      getParsedData = _.parseCSVToJSON('wp_term_relationships.csv');
      return getParsedData.done(function(data) {
        return _.db.transaction(function(tx) {
          tx.executeSql("DELETE FROM wp_term_relationships");
          return _.each(data, function(row, i) {
            return tx.executeSql("INSERT INTO wp_term_relationships (object_id, term_taxonomy_id , term_order) VALUES (?,?,?)", [row[0], row[1], row[2]]);
          });
        }, _.transactionErrorhandler, function(tx) {
          console.log('Inserted data in wp_term_relationships');
          return _.insertIntoWpTermTaxonomy();
        });
      });
    },
    insertIntoWpTermTaxonomy: function() {
      var getParsedData;
      getParsedData = _.parseCSVToJSON('wp_term_taxonomy.csv');
      return getParsedData.done(function(data) {
        return _.db.transaction(function(tx) {
          tx.executeSql("DELETE FROM wp_term_taxonomy");
          return _.each(data, function(row, i) {
            return tx.executeSql("INSERT INTO wp_term_taxonomy (term_taxonomy_id, term_id, taxonomy , description, parent, count) VALUES (?,?,?,?,?,?)", [row[0], row[1], row[2], row[3], row[4], row[5]]);
          });
        }, _.transactionErrorhandler, function(tx) {
          console.log('Inserted data in wp_term_taxonomy');
          return _.insertIntoWpTerms();
        });
      });
    },
    insertIntoWpTerms: function() {
      var getParsedData;
      getParsedData = _.parseCSVToJSON('wp_terms.csv');
      return getParsedData.done(function(data) {
        return _.db.transaction(function(tx) {
          tx.executeSql("DELETE FROM wp_terms");
          return _.each(data, function(row, i) {
            return tx.executeSql("INSERT INTO wp_terms (term_id, name, slug, term_group) VALUES (?,?,?,?)", [row[0], row[1], row[2], row[3]]);
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
      getParsedData = _.parseCSVToJSON('wp_textbook_relationships.csv');
      return getParsedData.done(function(data) {
        return _.db.transaction(function(tx) {
          tx.executeSql("DELETE FROM wp_textbook_relationships");
          return _.each(data, function(row, i) {
            return tx.executeSql("INSERT INTO wp_textbook_relationships (id, textbook_id, class_id, tags) VALUES (?,?,?,?)", [row[0], row[1], row[2], row[3]]);
          });
        }, _.transactionErrorhandler, function(tx) {
          console.log('Inserted data in wp_textbook_relationships');
          return _.insertIntoWpUserMeta();
        });
      });
    },
    insertIntoWpUserMeta: function() {
      var getParsedData;
      getParsedData = _.parseCSVToJSON('wp_usermeta.csv');
      return getParsedData.done(function(data) {
        return _.db.transaction(function(tx) {
          tx.executeSql("DELETE FROM wp_usermeta");
          return _.each(data, function(row, i) {
            return tx.executeSql("INSERT INTO wp_usermeta (umeta_id, user_id, meta_key, meta_value) VALUES (?,?,?,?)", [row[0], row[1], row[2], row[3]]);
          });
        }, _.transactionErrorhandler, function(tx) {
          console.log('Inserted data in wp_usermeta');
          return _.insertIntoWpUsers();
        });
      });
    },
    insertIntoWpUsers: function() {
      var getParsedData;
      getParsedData = _.parseCSVToJSON('wp_users.csv');
      return getParsedData.done(function(data) {
        return _.db.transaction(function(tx) {
          tx.executeSql("DELETE FROM wp_users");
          return _.each(data, function(row, i) {
            return tx.executeSql("INSERT INTO wp_users (ID, user_login, user_pass, user_nicename , user_email, user_url, user_registered, user_activation_key, user_status , display_name, spam,deleted) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", [row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10], row[11]]);
          });
        }, _.transactionErrorhandler, function(tx) {
          console.log('Inserted data in wp_users');
          return _.onFileImportSuccess();
        });
      });
    },
    onFileImportSuccess: function() {
      _.updateSyncDetails('file_import', _.getCurrentDateTime(2));
      $('#syncSuccess').css("display", "block").text("File import completed");
      setTimeout((function(_this) {
        return function() {
          $('#syncSuccess').css("display", "block").text("Sync completed successfully");
          return App.execute("show:leftnavapp", {
            region: App.leftNavRegion
          });
        };
      })(this), 2000);
      return setTimeout((function(_this) {
        return function() {
          return App.navigate('teachers/dashboard', {
            trigger: true
          });
        };
      })(this), 2000);
    }
  });
});
