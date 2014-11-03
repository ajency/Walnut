define(['underscore', 'unserialize'], function(_) {
  return _.mixin({
    cordovaContentPieceCollection: function(ids) {
      var defer, result;
      defer = $.Deferred();
      result = [];
      _.getContentPiecesByIDs(ids).then(function(contentPieceData) {
        var forEach, length;
        console.log('getContentPiecesByIDs done');
        length = contentPieceData.rows.length;
        if (length === 0) {
          return defer.resolve(result);
        } else {
          forEach = function(row, i) {
            return _.getPostAuthorName(row['post_author']).then(function(author_name) {
              console.log('getPostAuthorName done');
              return _.getMetaValue(row['ID']).then(function(meta_value) {
                console.log('getMetaValue done');
                return _.getGradingParams(row['ID']).then(function(grading_params) {
                  console.log('getGradingParams done');
                  return _.getJsonToClone(meta_value.layout_json).then(function(contentElements) {
                    var excerpt, excerpt_array, taglessArray;
                    console.log('getJsonToClone done');
                    if (meta_value.question_type === 'multiple_eval') {
                      if (!_.isEmpty(grading_params)) {
                        excerpt_array = [];
                        _.each(grading_params, function(params, i) {
                          var attributes;
                          excerpt_array.push(params['parameter']);
                          attributes = params['attributes'];
                          return _.each(attributes, function(attr, i) {
                            return excerpt_array.push(attr);
                          });
                        });
                      }
                    } else {
                      excerpt_array = contentElements.excerpt;
                    }
                    excerpt_array = _.flatten(excerpt_array);
                    taglessArray = new Array;
                    _.each(excerpt_array, function(excerpt) {
                      return taglessArray.push(_(excerpt).stripTags());
                    });
                    excerpt = taglessArray.join(' | ');
                    excerpt = _(excerpt).prune(500);
                    result[i] = {
                      ID: row['ID'],
                      post_author: row['post_author'],
                      post_date: row['post_date'],
                      post_date_gmt: row['post_date_gmt'],
                      post_content: row['post_content'],
                      post_title: row['post_title'],
                      post_excerpt: excerpt,
                      post_status: row['post_status'],
                      comment_status: row['comment_status'],
                      ping_status: row['ping_status'],
                      post_password: row['post_password'],
                      post_name: row['post_name'],
                      to_ping: row['to_ping'],
                      pinged: row['pinged'],
                      post_modified: row['post_modified'],
                      post_modified_gmt: row['post_modified_gmt'],
                      post_content_filtered: row['post_content_filtered'],
                      post_parent: row['post_parent'],
                      guid: row['guid'],
                      menu_order: row['menu_order'],
                      post_type: row['post_type'],
                      post_mime_type: row['post_mime_type'],
                      comment_count: row['comment_count'],
                      filter: 'raw',
                      post_author_name: author_name,
                      content_type: meta_value.content_type,
                      layout: contentElements.elements,
                      question_type: meta_value.question_type,
                      post_tags: meta_value.post_tags,
                      duration: meta_value.duration,
                      last_modified_by: meta_value.last_modified_by,
                      published_by: meta_value.published_by,
                      term_ids: meta_value.term_ids,
                      instructions: meta_value.instructions,
                      order: _.indexOf(ids, row['ID'].toString()),
                      grading_params: grading_params
                    };
                    i = i + 1;
                    if (i < length) {
                      return forEach(contentPieceData.rows.item(i), i);
                    } else {
                      return defer.resolve(result);
                    }
                  });
                });
              });
            });
          };
          return forEach(contentPieceData.rows.item(0), 0);
        }
      });
      return defer.promise();
    },
    getContentPiecesByIDs: function(ids) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        return defer.resolve(data);
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT * FROM wp_posts WHERE post_type=? AND post_status=? AND ID in (" + ids + ")", ['content-piece', 'publish'], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getPostAuthorName: function(post_author_id) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var postAuthorName;
        postAuthorName = '';
        if (data.rows.length !== 0) {
          postAuthorName = data.rows.item(0)['display_name'];
        }
        return defer.resolve(postAuthorName);
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT display_name FROM wp_users WHERE ID=?", [post_author_id], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getGradingParams: function(post_id) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var forEach, gradingParams, length;
        gradingParams = [];
        length = data.rows.length;
        if (length === 0) {
          return defer.resolve(gradingParams);
        } else {
          forEach = function(row, i) {
            var attributes;
            attributes = _.unserialize(row['meta_value']);
            gradingParams[i] = {
              id: row['meta_id'],
              parameter: row['meta_key'].replace('parameter_', ''),
              attributes: attributes
            };
            i = i + 1;
            if (i < length) {
              return forEach(data.rows.item(i), i);
            } else {
              return defer.resolve(gradingParams);
            }
          };
          return forEach(data.rows.item(0), 0);
        }
      };
      _.db.transaction(function(tx) {
        var pattern;
        pattern = '%parameter_%';
        return tx.executeSql("SELECT * FROM wp_postmeta WHERE post_id=? AND meta_key LIKE '" + pattern + "'", [post_id], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    }
  });
});
