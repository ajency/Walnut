define(['underscore'], function(_) {
  return _.mixin({
    deferredErrorHandler: function(d) {
      return function(tx, error) {
        return d.reject(error);
      };
    },
    failureHandler: function(error) {
      return console.log('ERROR: ' + error.message);
    },
    transactionErrorHandler: function(tx, error) {
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
          var r;
          if (data.rows.length !== 0) {
            r = data.rows.item(0);
            userData = {
              user_id: r['user_id'],
              password: r['password'],
              role: r['user_role'],
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
    getQuestionType: function(content_piece_id) {
      var onSuccess, question_type, runQuery;
      question_type = '';
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT meta_value FROM wp_postmeta WHERE post_id=? AND meta_key='question_type'", [content_piece_id], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          if (data.rows.length !== 0) {
            question_type = data.rows.item(0)['meta_value'];
          }
          return d.resolve(question_type);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getQuestionType transaction completed');
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
          var r;
          if (data.rows.length !== 0) {
            r = data.rows.item(0);
            lastDetails = {
              id: r['id'],
              date: r['date'],
              status: r['status']
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
        return tx.executeSql('INSERT INTO wp_question_response_logs (qr_ref_id, start_time) VALUES (?,?)', [refID, _.getCurrentDateTime(2)]);
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
