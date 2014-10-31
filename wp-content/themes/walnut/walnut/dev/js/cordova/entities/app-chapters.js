define(['underscore'], function(_) {
  return _.mixin({
    getChaptersByParentId: function(parentId) {
      var defer, onSuccess, result;
      defer = $.Deferred();
      result = [];
      onSuccess = function(tx, data) {
        var forEach;
        forEach = function(row, i) {
          result[i] = {
            term_id: row['term_id'],
            name: row['name'],
            slug: row['slug'],
            term_group: row['term_group'],
            term_taxonomy_id: row['term_taxonomy_id'],
            taxonomy: row['taxonomy'],
            description: row['description'],
            parent: row['parent']
          };
          i = i + 1;
          if (i < data.rows.length) {
            return forEach(data.rows.item(i), i);
          } else {
            return defer.resolve(result);
          }
        };
        return forEach(data.rows.item(0), 0);
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT * FROM wp_terms t, wp_term_taxonomy tt WHERE t.term_id=tt.term_id AND tt.taxonomy='textbook' AND tt.parent=?", [parentId], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getChapterCount: function(parentId) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var chapter_count;
        chapter_count = data.rows.item(0)['chapter_count'];
        return defer.resolve(chapter_count);
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT COUNT(term_id) AS chapter_count FROM wp_term_taxonomy WHERE parent=?", [parentId], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    }
  });
});
