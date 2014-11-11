define(['underscore', 'unserialize'], function(_) {
  return _.mixin({
    getContentPiecesByIDs: function(ids) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var forEach, result;
        result = [];
        if (data.rows.length === 0) {
          return defer.resolve(result);
        } else {
          forEach = function(row, i) {
            return _.getPostAuthorName(row['post_author']).then(function(author_name) {
              return _.getMetaValue(row['ID']).then(function(meta_value) {
                return _.getJsonToClone(meta_value.layout_json).then(function(contentElements) {
                  var excerpt, excerpt_array, taglessArray;
                  console.log(contentElements);
                  excerpt_array = contentElements.excerpt;
                  excerpt_array = _.flatten(excerpt_array);
                  taglessArray = new Array;
                  _.each(excerpt_array, function(excerpt) {
                    return taglessArray.push(_(excerpt).stripTags());
                  });
                  excerpt = taglessArray.join(' | ');
                  excerpt = _(excerpt).prune(500);
                  result[i] = {
                    ID: row['ID'],
                    comment: meta_value.comment,
                    comment_count: row['comment_count'],
                    comment_status: row['comment_status'],
                    comment_enable: meta_value.comment_enable,
                    content_type: meta_value.content_type,
                    difficulty_level: meta_value.difficulty_level,
                    duration: meta_value.duration,
                    grading_params: [],
                    guid: row['guid'],
                    hint_enable: meta_value.hint_enable,
                    hint: meta_value.hint,
                    instructions: meta_value.instructions,
                    last_modified_by: meta_value.last_modified_by,
                    layout: contentElements.elements,
                    menu_order: row['menu_order'],
                    order: _.indexOf(ids, row['ID'].toString()),
                    ping_status: row['ping_status'],
                    pinged: row['pinged'],
                    post_author: row['post_author'],
                    post_author_name: author_name,
                    post_content: row['post_content'],
                    post_content_filtered: row['post_content_filtered'],
                    post_date: row['post_date'],
                    post_date_gmt: row['post_date_gmt'],
                    post_excerpt: excerpt,
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
                  i = i + 1;
                  if (i < data.rows.length) {
                    return forEach(data.rows.item(i), i);
                  } else {
                    return defer.resolve(result);
                  }
                });
              });
            });
          };
          return forEach(data.rows.item(0), 0);
        }
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT * FROM wp_posts WHERE post_type=? AND post_status=? AND ID in (" + ids + ")", ['content-piece', 'publish'], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getPostAuthorName: function(post_author_id) {
      var defer, onSuccess, postAuthorName;
      postAuthorName = '';
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        if (data.rows.length !== 0) {
          postAuthorName = data.rows.item(0)['display_name'];
        }
        return defer.resolve(postAuthorName);
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT display_name FROM wp_users WHERE ID=?", [post_author_id], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    }
  });
});
