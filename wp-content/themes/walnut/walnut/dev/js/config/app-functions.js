define(['underscore', 'unserialize'], function(_) {
  return _.mixin({
    deferredErrorHandler: function(d) {
      return function(tx, error) {
        return d.reject(error);
      };
    },
    failureHandler: function(error) {
      return console.log('ERROR: ' + error.message);
    },
    transactionErrorHandler: function(error) {
      return console.log('ERROR: ' + error.message);
    },
    fileErrorHandler: function(error) {
      return console.log('FILE ERROR: ' + error.code);
    },
    fileSystemErrorHandler: function(evt) {
      return console.log('FILE SYSTEM ERROR: ' + evt.target.error.code);
    },
    fileTransferErrorHandler: function(error) {
      var err_msg;
      switch (error.code) {
        case 1:
          err_msg = 'FILE NOT FOUND';
          break;
        case 2:
          err_msg = 'INVALID URL';
          break;
        case 3:
          err_msg = 'CONNECTION';
          break;
        case 4:
          err_msg = 'ABORT';
          break;
        default:
          err_msg = 'UNKNOWN';
      }
      console.log('ERROR: ' + err_msg);
      console.log('ERROR SOURCE: ' + error.source);
      return console.log('ERROR TARGET: ' + error.target);
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
        question_type: '',
        content_type: '',
        layout_json: '',
        post_tags: '',
        duration: '',
        last_modified_by: '',
        published_by: '',
        term_ids: ''
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
          var i, row, _i, _ref;
          for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
            row = data.rows.item(i);
            if (row['meta_key'] === 'question_type') {
              meta_value.question_type = row['meta_value'];
            }
            if (row['meta_key'] === 'content_type') {
              meta_value.content_type = row['meta_value'];
            }
            if (row['meta_key'] === 'layout_json') {
              meta_value.layout_json = unserialize(unserialize(row['meta_value']));
            }
            if (row['meta_key'] === 'post_tags') {
              meta_value.post_tags = row['meta_value'];
            }
            if (row['meta_key'] === 'duration') {
              meta_value.duration = row['meta_value'];
            }
            if (row['meta_key'] === 'last_modified_by') {
              meta_value.last_modified_by = row['meta_value'];
            }
            if (row['meta_key'] === 'published_by') {
              meta_value.published_by = row['meta_value'];
            }
            if (row['meta_key'] === 'term_ids') {
              meta_value.term_ids = unserialize(unserialize(row['meta_value']));
            }
          }
          return d.resolve(meta_value);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getMetaValue transaction completed');
      }).fail(_.failureHandler);
    },
    getLastDetails: function(collection_id, division) {
      var lastDetails, onSuccess, runQuery;
      lastDetails = {
        id: '',
        date: '',
        status: ''
      };
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT id, status, date FROM wp_training_logs WHERE collection_id=? AND division_id=? ORDER BY id DESC LIMIT 1", [collection_id, division], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var row;
          if (data.rows.length !== 0) {
            row = data.rows.item(0);
            lastDetails = {
              id: row['id'],
              date: row['date'],
              status: row['status']
            };
          }
          return d.resolve(lastDetails);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getLastDetails transaction completed');
      }).fail(_.failureHandler);
    },
    updateQuestionResponseLogs: function(refID) {
      return _.db.transaction(function(tx) {
        return tx.executeSql('INSERT INTO wp_question_response_logs (qr_ref_id, start_time, sync) VALUES (?,?,?)', [refID, _.getCurrentDateTime(2), 0]);
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
