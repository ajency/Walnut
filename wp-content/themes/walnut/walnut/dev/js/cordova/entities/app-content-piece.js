define(['underscore', 'unserialize'], function(_) {
  return _.mixin({
    getPostAuthorName: function(post_author_id) {
      var postAuthorName, runQuery, success;
      postAuthorName = '';
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.trasnaction(function(tx) {
            return tx.executeSql("SELECT display_name FROM wp_users WHERE ID=?", [post_author_id], success(d), _.deferredErrorHandler(d));
          });
        });
      };
      success = function(d) {
        return function(tx, data) {
          if (data.rows.length !== 0) {
            postAuthorName = data.rows.item(0)['display_name'];
          }
          return d.resolve(postAuthorName);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getPostAuthorName transaction completed');
      }).fail(_.failureHandler);
    },
    getGradingParams: function(post_id) {
      var pattern, runQuery, success;
      pattern = '%parameter_%';
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM wp_postmeta WHERE post_id=? AND meta_key LIKE '" + pattern + "'", [post_id], success(d), _.deferredErrorHandler(d));
          });
        });
      };
      success = function(d) {
        return function(tx, data) {
          var gradingParams, i, row, _fn, _i, _ref;
          gradingParams = [];
          _fn = function(row, i) {
            var attributes, result;
            attributes = '';
            if (row['meta_value'] !== '') {
              attributes = unserialize(row['meta_value']);
            }
            result = {
              id: row['meta_id'],
              parameter: row['meta_key'].replace('parameter_', ''),
              attributes: attributes
            };
            return gradingParams[i] = result;
          };
          for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
            row = data.rows.item(i);
            _fn(row, i);
          }
          return d.resolve(gradingParams);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getGradingParams transaction completed');
      }).fail(_.failureHandler);
    }
  });
});
