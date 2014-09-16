define(['underscore', 'unserialize'], function(_) {
  return _.mixin({
    getMetaValue: function(content_piece_id) {
      var meta_value, onSuccess, runQuery;
      meta_value = {
        content_type: '',
        layout_json: '',
        question_type: '',
        difficulty_level: '',
        post_tags: '',
        duration: '',
        last_modified_by: '',
        published_by: '',
        term_ids: '',
        instructions: '',
        comment_enable: '',
        comment: '',
        hint_enable: '',
        hint: ''
      };
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM wp_postmeta WHERE post_id=?", [content_piece_id], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var i, row, _fn, _i, _ref;
          _fn = function(row) {
            var content_piece_meta;
            if (row['meta_key'] === 'content_type') {
              meta_value.content_type = row['meta_value'];
            }
            if (row['meta_key'] === 'layout_json') {
              meta_value.layout_json = _.unserialize(row['meta_value']);
            }
            if (row['meta_key'] === 'question_type') {
              meta_value.question_type = row['meta_value'];
            }
            if (row['meta_key'] === 'difficulty_level') {
              meta_value.difficulty_level = row['meta_value'];
            }
            if (row['meta_key'] === 'content_piece_meta') {
              content_piece_meta = _.unserialize(row['meta_value']);
              meta_value.post_tags = content_piece_meta.post_tags;
              meta_value.duration = content_piece_meta.duration;
              meta_value.last_modified_by = content_piece_meta.last_modified_by;
              meta_value.published_by = content_piece_meta.published_by;
              meta_value.term_ids = content_piece_meta.term_ids;
              meta_value.instructions = content_piece_meta.instructions;
              meta_value.comment_enable = content_piece_meta.comment_enable;
              meta_value.comment = content_piece_meta.comment;
              meta_value.hint_enable = content_piece_meta.hint_enable;
              return meta_value.hint = content_piece_meta.hint;
            }
          };
          for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
            row = data.rows.item(i);
            _fn(row);
          }
          return d.resolve(meta_value);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getMetaValue transaction completed');
      }).fail(_.failureHandler);
    },
    getJsonToClone: function(elements) {
      var runFunc;
      runFunc = function() {
        return $.Deferred(function(d) {
          var content, total;
          content = {
            elements: elements,
            excerpt: new Array
          };
          if (_.isArray(elements)) {
            total = 0;
            return _.each(elements, function(element) {
              var insideElement, metaData;
              total++;
              if (element.element === 'Row') {
                insideElement = _.getRowElements(element);
                return insideElement.done(function(columnElement) {
                  content.excerpt.push(columnElement.excerpt);
                  total--;
                  if (!total) {
                    return d.resolve(content);
                  }
                });
              } else if (element.element === 'Mcq') {
                insideElement = _.getMcqElements(element);
                return insideElement.done(function(columnElement) {
                  content.excerpt.push(columnElement.excerpt);
                  total--;
                  if (!total) {
                    return d.resolve(content);
                  }
                });
              } else {
                metaData = _.getElementMetaValues(element);
                return metaData.done(function(meta) {
                  element.meta_id = parseInt(element.meta_id);
                  if (meta !== false) {
                    _.defaults(element, meta);
                    if (element.element === 'Text') {
                      content.excerpt.push(meta.content);
                    }
                    if (element.element === 'Fib') {
                      content.excerpt.push(element.text);
                    }
                    if (element.element === 'Hotspot') {
                      content.excerpt.push(element.textCollection[0].text);
                    }
                    if (element.element === 'Image') {
                      element.image_id = parseInt(element.image_id);
                    }
                    if (element.element === 'ImageWithText') {
                      element.image_id = parseInt(element.image_id);
                    }
                    if (element.element === 'Video') {
                      element.video_id = parseInt(element.video_id);
                    }
                  }
                  total--;
                  if (!total) {
                    return d.resolve(content);
                  }
                });
              }
            });
          } else {
            return d.resolve(elements);
          }
        });
      };
      return $.when(runFunc()).done(function() {
        return console.log("get getJsonToClone done");
      }).fail(_.failureHandler);
    },
    getRowElements: function(rowElements) {
      var runFunc;
      runFunc = function() {
        return $.Deferred(function(d) {
          var content, total;
          content = {
            excerpt: new Array
          };
          total = 0;
          return _.each(rowElements.elements, function(column) {
            if (column.elements) {
              return _.each(column.elements, function(element) {
                var insideElement, metaData;
                total++;
                if (element.element === 'Row') {
                  insideElement = _.getRowElements(element);
                  return insideElement.done(function(columnElement) {
                    content.excerpt.push(columnElement.excerpt);
                    total--;
                    if (!total) {
                      return d.resolve(content);
                    }
                  });
                } else {
                  metaData = _.getElementMetaValues(element);
                  return metaData.done(function(meta) {
                    element.meta_id = parseInt(element.meta_id);
                    if (meta !== false) {
                      _.defaults(element, meta);
                      if (element.element === 'Text') {
                        content.excerpt.push(element.content);
                      }
                      if (element.element === 'Fib') {
                        content.excerpt.push(element.text);
                      }
                      if (element.element === 'Hotspot') {
                        content.excerpt.push(element.textCollection[0].text);
                      }
                      if (element.element === 'Image') {
                        element.image_id = parseInt(element.image_id);
                      }
                      if (element.element === 'ImageWithText') {
                        element.image_id = parseInt(element.image_id);
                      }
                      if (element.element === 'Video') {
                        element.video_id = parseInt(element.video_id);
                      }
                    }
                    total--;
                    if (!total) {
                      return d.resolve(content);
                    }
                  });
                }
              });
            } else {
              return d.resolve(content);
            }
          });
        });
      };
      return $.when(runFunc()).done(function() {
        return console.log("get getRowElements done");
      }).fail(_.failureHandler);
    },
    getMcqElements: function(rowElements) {
      var runFunc;
      runFunc = function() {
        return $.Deferred(function(d) {
          var content, total;
          content = {
            excerpt: new Array
          };
          total = 0;
          return _.each(rowElements.elements, function(column) {
            if (column) {
              return _.each(column, function(element) {
                var insideElement, metaData;
                total++;
                if (element.element === 'Row') {
                  insideElement = _.getRowElements(element);
                  return insideElement.done(function(columnElement) {
                    content.excerpt.push(columnElement.excerpt);
                    total--;
                    if (!total) {
                      return d.resolve(content);
                    }
                  });
                } else {
                  metaData = _.getElementMetaValues(element);
                  return metaData.done(function(meta) {
                    element.meta_id = parseInt(element.meta_id);
                    if (meta !== false) {
                      _.defaults(element, meta);
                      if (element.element === 'Text') {
                        content.excerpt.push(element.content);
                      }
                      if (element.element === 'Fib') {
                        content.excerpt.push(element.text);
                      }
                      if (element.element === 'Hotspot') {
                        content.excerpt.push(element.textCollection[0].text);
                      }
                      if (element.element === 'Image') {
                        element.image_id = parseInt(element.image_id);
                      }
                      if (element.element === 'ImageWithText') {
                        element.image_id = parseInt(element.image_id);
                      }
                      if (element.element === 'Video') {
                        element.video_id = parseInt(element.video_id);
                      }
                    }
                    total--;
                    if (!total) {
                      return d.resolve(content);
                    }
                  });
                }
              });
            } else {
              return d.resolve(content);
            }
          });
        });
      };
      return $.when(runFunc()).done(function() {
        return console.log("get getMcqElements done");
      }).fail(_.failureHandler);
    },
    getElementMetaValues: function(element) {
      var runFunc;
      runFunc = function() {
        return $.Deferred(function(d) {
          var meta;
          meta = _.getMetaValueFromMetaId(element.meta_id);
          return meta.done(function(metaData) {
            var ele;
            if (metaData) {
              ele = unserialize(metaData);
              ele.meta_id = element.meta_id;
            } else {
              ele = element;
            }
            return d.resolve(ele);
          });
        });
      };
      return $.when(runFunc()).done(function() {
        return console.log("get getElementMetaValues done");
      }).fail(_.failureHandler);
    },
    getMetaValueFromMetaId: function(meta_id) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM wp_postmeta WHERE meta_id=?", [meta_id], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var metaValue, row;
          metaValue = null;
          if (data.rows.length !== 0) {
            row = data.rows.item(0);
            if (row['meta_key'] === 'content_element') {
              metaValue = row['meta_value'];
            }
          }
          return d.resolve(metaValue);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getMetaValueFromMetaId: ' + meta_id + ' transaction completed');
      }).fail(_.failureHandler);
    }
  });
});
