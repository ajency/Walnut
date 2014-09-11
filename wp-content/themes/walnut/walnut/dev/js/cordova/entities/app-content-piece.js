define(['underscore', 'unserialize'], function(_) {
  return _.mixin({
    getContentPiecesByIDs: function(ids) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM wp_posts WHERE post_type=? AND post_status=? AND ID in (" + ids + ")", ['content-piece', 'publish'], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var i, result, row, _fn, _i, _ref;
          result = [];
          _fn = function(row, i) {
            var postAuthorName;
            postAuthorName = _.getPostAuthorName(row['post_author']);
            return postAuthorName.done(function(author_name) {
              return (function(row, i, author_name) {
                var metaValue;
                metaValue = _.getMetaValue(row['ID']);
                return metaValue.done(function(meta_value) {
                  return (function(row, i, author_name, meta_value) {
                    var contentElementsArray;
                    contentElementsArray = _.getJsonToClone(meta_value.layout_json);
                    return contentElementsArray.done(function(contentElements) {
                      console.log(contentElements);
                      return result[i] = {
                        ID: row['ID'],
                        comment_count: row['comment_count'],
                        comment_status: row['comment_status'],
                        content_type: meta_value.content_type,
                        difficulty_level: meta_value.difficulty_level,
                        duration: meta_value.duration,
                        grading_params: [],
                        guid: row['guid'],
                        instructions: meta_value.instructions,
                        last_modified_by: meta_value.last_modified_by,
                        layout: contentElements.elements,
                        menu_order: row['menu_order'],
                        ping_status: row['ping_status'],
                        pinged: row['pinged'],
                        post_author: row['post_author'],
                        post_author_name: postAuthorName,
                        post_content: row['post_content'],
                        post_content_filtered: row['post_content_filtered'],
                        post_date: row['post_date'],
                        post_date_gmt: row['post_date_gmt'],
                        post_excerpt: row['post_excerpt'],
                        post_mime_type: row['post_mime_type'],
                        post_modified: row['post_modified'],
                        post_modified_gmt: row['post_modified_gmt'],
                        post_name: row['post_name'],
                        post_parent: row['post_parent'],
                        post_password: row['post_password'],
                        post_status: row['post_status'],
                        post_tags: meta_value.post_tags,
                        post_title: row['post_title'],
                        post_type: row['post_type'],
                        published_by: meta_value.published_by,
                        question_type: meta_value.question_type,
                        term_ids: meta_value.term_ids,
                        to_ping: row['to_ping']
                      };
                    });
                  })(row, i, author_name, meta_value);
                });
              })(row, i, author_name);
            });
          };
          for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
            row = data.rows.item(i);
            _fn(row, i);
          }
          return d.resolve(result);
        };
      };
      return $.when(runQuery()).done(function(d) {
        return console.log('getContentPiecesByIDs transaction completed');
      }).fail(_.failureHandler);
    },
    getPostAuthorName: function(post_author_id) {
      var onSuccess, postAuthorName, runQuery;
      postAuthorName = '';
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT display_name FROM wp_users WHERE ID=?", [post_author_id], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
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
    }
  });
});
