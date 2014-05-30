define(['underscore', 'unserialize'], function(_) {
  return _.mixin({
    getTblPrefix: function() {
      return 'wp_' + _.getBlogID() + '_';
    },
    getUserDetails: function(username) {
      var onSuccess, runQuery, userData;
      userData = {
        user_id: '',
        password: '',
        role: '',
        exists: false
      };
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM USERS WHERE username=?", [username], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var row;
          if (data.rows.length !== 0) {
            row = data.rows.item(0);
            userData = {
              user_id: row['user_id'],
              password: row['password'],
              role: row['user_role'],
              exists: true
            };
          }
          return d.resolve(userData);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getUserDetails transaction completed');
      }).fail(_.failureHandler);
    },
    getMetaValue: function(content_piece_id) {
      var meta_value, onSuccess, runQuery;
      meta_value = {
        content_type: '',
        layout_json: '',
        question_type: '',
        post_tags: '',
        duration: '',
        last_modified_by: '',
        published_by: '',
        term_ids: '',
        instructions: ''
      };
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM wp_postmeta WHERE post_id=?", [content_piece_id], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var content_piece_meta, i, row, _i, _ref;
          for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
            row = data.rows.item(i);
            if (row['meta_key'] === 'content_type') {
              meta_value.content_type = row['meta_value'];
            }
            if (row['meta_key'] === 'layout_json') {
              meta_value.layout_json = unserialize(unserialize(row['meta_value']));
            }
            if (row['meta_key'] === 'question_type') {
              meta_value.question_type = row['meta_value'];
            }
            if (row['meta_key'] === 'content_piece_meta') {
              content_piece_meta = unserialize(unserialize(row['meta_value']));
              meta_value.post_tags = content_piece_meta.post_tags;
              meta_value.duration = content_piece_meta.duration;
              meta_value.last_modified_by = content_piece_meta.last_modified_by;
              meta_value.published_by = content_piece_meta.published_by;
              meta_value.term_ids = content_piece_meta.term_ids;
              meta_value.instructions = content_piece_meta.instructions;
            }
          }
          return d.resolve(meta_value);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getMetaValue transaction completed');
      }).fail(_.failureHandler);
    },
    getTextbookOptions: function(id) {
      var onSuccess, options, runQuery;
      options = {
        author: '',
        attachmenturl: ''
      };
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT option_value FROM wp_options WHERE option_name=?", ['taxonomy_' + id], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var attachmenturl, option_value, url;
          if (data.rows.length !== 0) {
            option_value = unserialize(data.rows.item(0)['option_value']);
            url = option_value.attachmenturl;
            if (url === 'false') {
              attachmenturl = '';
            } else {
              attachmenturl = _.getSynapseAssetsDirectoryPath() + url.substr(url.indexOf("uploads/"));
              attachmenturl = '<img src="' + attachmenturl + '">';
            }
            options = {
              author: option_value.author,
              attachmenturl: attachmenturl
            };
          }
          return d.resolve(options);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getTextbookOptions transaction completed');
      }).fail(_.failureHandler);
    },
    updateQuestionResponseLogs: function(refID) {
      return _.db.transaction(function(tx) {
        return tx.executeSql('INSERT INTO ' + _.getTblPrefix() + 'question_response_logs (qr_ref_id, start_time, sync) VALUES (?,?,?)', [refID, _.getCurrentDateTime(2), 0]);
      }, _.transactionErrorHandler, function(tx) {
        return console.log('SUCCESS: Inserted new record in wp_question_response_logs');
      });
    },
    getCurrentDateTime: function(bit) {
      var d, date, time;
      d = new Date();
      date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      time = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
      if (bit === 0) {
        return date;
      }
      if (bit === 1) {
        return time;
      }
      if (bit === 2) {
        return date + ' ' + time;
      }
    }
  });
});
