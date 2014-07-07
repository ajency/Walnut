define(['underscore'], function(_) {
  return _.mixin({
    getChaptersByParentId: function(parentId) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM wp_terms t, wp_term_taxonomy tt WHERE t.term_id=tt.term_id AND tt.taxonomy='textbook' AND tt.parent=?", [parentId], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var i, result, row, _i, _ref;
          result = [];
          for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
            row = data.rows.item(i);
            result[i] = {
              term_id: row['term_id'],
              name: row['name'],
              slug: row['slug'],
              term_group: row['term_group'],
              term_order: row['term_order'],
              term_taxonomy_id: row['term_taxonomy_id'],
              taxonomy: row['taxonomy'],
              description: row['description'],
              parent: row['parent'],
              count: row['count'],
              thumbnail: '',
              cover_pic: '',
              author: '',
              classes: null,
              subjects: null,
              modules_count: '',
              chapter_count: ''
            };
          }
          return d.resolve(result);
        };
      };
      return $.when(runQuery()).done(function(d) {
        return console.log('getChaptersByParentId transaction completed');
      }).fail(_.failureHandler);
    }
  });
});
