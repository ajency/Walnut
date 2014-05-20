define(['underscore', 'unserialize'], function(_) {
  return _.mixin({
    getPostAuthorName: function(post_author_id) {
      var postAuthorName, runQuery, success;
      postAuthorName = '';
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
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
    getRowElements: function(element) {
      console.log('element');
      return console.log(element);
    },
    getJsonToClone: function(layout_json) {
      var d2, key, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = layout_json.length; _i < _len; _i++) {
        key = layout_json[_i];
        if (key.element === 'Text') {
          key['columncount'] = layout_json.length;
          _results.push(d2 = _.getRowElements(layout_json));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    callFunc: function(layout_json) {
      return _.getJsonToClone(layout_json);
    }
  });
});
