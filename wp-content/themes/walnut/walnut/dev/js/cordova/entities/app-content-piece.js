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
                    var gradingParams;
                    gradingParams = _.getGradingParams(row['ID']);
                    return gradingParams.done(function(grading_params) {
                      return (function(row, i, author_name, meta_value, grading_params) {
                        var contentElementsArray;
                        if (meta_value.layout_json) {
                          contentElementsArray = _.getJsonToClone(meta_value.layout_json);
                          return contentElementsArray.done(function(contentElements) {
                            var excerpt, excerpt_array, gradingParamsExcerpt, taglessArray;
                            _.mixin(_.str.exports());
                            excerpt_array = contentElements.excerpt;
                            if (!_.isEmpty(grading_params)) {
                              gradingParamsExcerpt = [];
                              _.each(grading_params, function(params, i) {
                                gradingParamsExcerpt[i] = _.omit(params, 'id');
                                return excerpt_array.push(gradingParamsExcerpt);
                              });
                            }
                            excerpt_array = _.flatten(excerpt_array);
                            taglessArray = new Array;
                            _.each(excerpt_array, function(excerpt) {
                              return taglessArray.push(_(excerpt).stripTags());
                            });
                            excerpt = taglessArray.join(' | ');
                            excerpt = _(excerpt).prune(150);
                            return result[i] = {
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
                          });
                        }
                      })(row, i, author_name, meta_value, grading_params);
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
    },
    getGradingParams: function(post_id) {
      var onSuccess, pattern, runQuery;
      pattern = '%parameter_%';
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM wp_postmeta WHERE post_id=? AND meta_key LIKE '" + pattern + "'", [post_id], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
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
