define(['underscore', 'unserialize'], function(_) {
  return _.mixin({
    getAttachmentData: function(id) {
      var runQuery, success;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM wp_postmeta WHERE meta_key=? AND post_id=?", ['_wp_attachment_metadata', id], success(d), _.deferredErrorHandler(d));
          });
        });
      };
      success = function(d) {
        return function(tx, data) {
          var meta_value;
          meta_value = '';
          if (data.rows.length !== 0) {
            meta_value = unserialize(data.rows.item(0)['meta_value']);
          }
          return d.resolve(meta_value);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getAttachmentData transaction completed');
      }).fail(_.failureHandler);
    }
  });
});
