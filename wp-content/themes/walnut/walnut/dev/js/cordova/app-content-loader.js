define(['underscore', 'unserialize'], function(_) {
  return _.mixin({
    getMetaValue: function(content_piece_id) {
      var defer, meta_value, onSuccess;
      content_piece_id = parseInt(content_piece_id);
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
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var forEach;
        if (data.rows.length === 0) {
          return defer.resolve(meta_value);
        } else {
          forEach = function(row, i) {
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
              meta_value.hint = content_piece_meta.hint;
            }
            i = i + 1;
            if (i < data.rows.length) {
              return forEach(data.rows.item(i), i);
            } else {
              return defer.resolve(meta_value);
            }
          };
          return forEach(data.rows.item(0), 0);
        }
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT * FROM wp_postmeta WHERE post_id=?", [content_piece_id], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getJsonToClone: function(elements) {
      var content, defer, forEach, total;
      defer = $.Deferred();
      content = {
        elements: elements,
        excerpt: new Array,
        marks: 0,
        audioArray: new Array,
        videoArray: new Array
      };
      if (_.isArray(elements)) {
        total = 0;
        forEach = function(element, i) {
          total++;
          if (element.element === 'Row') {
            _.getRowElements(element).then(function(columnElement) {
              content.excerpt.push(columnElement.excerpt);
              if (columnElement.videoArray) {
                content.videoArray.push(columnElement.videoArray);
              }
              if (columnElement.audioArray) {
                content.audioArray.push(columnElement.audioArray);
              }
              if (columnElement.marks) {
                content.marks += columnElement.marks;
              }
              total--;
              if (!total) {
                return defer.resolve(content);
              }
            });
          } else if (element.element === 'Mcq') {
            _.getMcqElements(element).then(function(columnElement) {
              return _.getElementMetaValues(element).then(function(meta) {
                element.meta_id = parseInt(element.meta_id);
                if (meta !== false) {
                  _.defaults(element, meta);
                }
                content.excerpt.push(columnElement.excerpt);
                if (meta.marks) {
                  content.marks += parseInt(meta.marks);
                }
                total--;
                if (!total) {
                  return defer.resolve(content);
                }
              });
            });
          } else {
            _.getElementMetaValues(element).then(function(meta) {
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
                  if (element.video_ids) {
                    content.videoArray.push(element.video_ids);
                  }
                }
                if (element.element === 'Audio') {
                  content.audioArray.push(element);
                }
                if (element.marks) {
                  content.marks += element.marks;
                }
              }
              total--;
              if (!total) {
                return defer.resolve(content);
              }
            });
          }
          i = i + 1;
          if (i < _.size(elements)) {
            return forEach(elements[i], i);
          }
        };
        forEach(elements[0], 0);
      } else {
        defer.resolve(elements);
      }
      return defer.promise();
    },
    getRowElements: function(rowElements) {
      var content, defer, forEachRowElement, total;
      defer = $.Deferred();
      content = {
        excerpt: new Array,
        marks: 0,
        audioArray: new Array,
        videoArray: new Array
      };
      total = 0;
      forEachRowElement = function(column, i) {
        var forEachColumnElement;
        if (column.elements) {
          forEachColumnElement = function(element, j) {
            total++;
            if (element.element === 'Row') {
              _.getRowElements(element).then(function(columnElement) {
                content.excerpt.push(columnElement.excerpt);
                if (meta.marks) {
                  content.marks += parseInt(meta.marks);
                }
                total--;
                if (!total) {
                  return defer.resolve(content);
                }
              });
            } else if (element.element === 'Mcq') {
              _.getMcqElements(element).then(function(columnElement) {
                return _.getElementMetaValues(element).then(function(meta) {
                  element.meta_id = parseInt(element.meta_id);
                  if (meta !== false) {
                    _.defaults(element, meta);
                  }
                  content.excerpt.push(columnElement.excerpt);
                  if (meta.marks) {
                    content.marks += parseInt(meta.marks);
                  }
                  total--;
                  if (!total) {
                    return defer.resolve(content);
                  }
                });
              });
            } else {
              _.getElementMetaValues(element).then(function(meta) {
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
                    if (element.video_ids) {
                      content.videoArray.push(element.video_ids);
                    }
                  }
                  if (element.element === 'Audio') {
                    content.audioArray.push(element);
                  }
                  if (meta.marks) {
                    content.marks += parseInt(meta.marks);
                  }
                  console.log('element.marks');
                  console.log(element.marks);
                }
                total--;
                if (!total) {
                  return defer.resolve(content);
                }
              });
            }
            j = j + 1;
            if (j < _.size(column.elements)) {
              return forEachColumnElement(column.elements[j], j);
            }
          };
          forEachColumnElement(column.elements[0], 0);
        } else {
          defer.resolve(content);
        }
        i = i + 1;
        if (i < _.size(rowElements.elements)) {
          return forEachRowElement(rowElements.elements[i], i);
        }
      };
      forEachRowElement(rowElements.elements[0], 0);
      return defer.promise();
    },
    getMcqElements: function(rowElements) {
      var content, defer, forEachRowElement, total;
      defer = $.Deferred();
      content = {
        excerpt: new Array,
        marks: 0
      };
      total = 0;
      forEachRowElement = function(column, i) {
        var forEachColumnElement;
        if (column) {
          forEachColumnElement = function(element, j) {
            total++;
            if (element.element === 'Row') {
              _.getRowElements(element).then(function(columnElement) {
                content.excerpt.push(columnElement.excerpt);
                if (columnElement.marks) {
                  content.marks += columnElement.marks;
                }
                total--;
                if (!total) {
                  return defer.resolve(content);
                }
              });
            } else {
              _.getElementMetaValues(element).then(function(meta) {
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
                  if (element.marks) {
                    content.marks += element.marks;
                  }
                }
                total--;
                if (!total) {
                  return defer.resolve(content);
                }
              });
            }
            j = j + 1;
            if (j < _.size(column)) {
              return forEachColumnElement(column[j], j);
            }
          };
          forEachColumnElement(column[0], 0);
        } else {
          defer.resolve(content);
        }
        i = i + 1;
        if (i < _.size(rowElements.elements)) {
          return forEachRowElement(rowElements.elements[i], i);
        }
      };
      forEachRowElement(rowElements.elements[0], 0);
      return defer.promise();
    },
    getElementMetaValues: function(element) {
      var defer;
      defer = $.Deferred();
      _.getMetaValueFromMetaId(element.meta_id).then(function(metaData) {
        var ele;
        if (metaData) {
          ele = _.unserialize(metaData);
          ele.meta_id = element.meta_id;
        } else {
          ele = element;
        }
        return defer.resolve(ele);
      });
      return defer.promise();
    },
    getMetaValueFromMetaId: function(meta_id) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var metaValue, row;
        metaValue = null;
        if (data.rows.length !== 0) {
          row = data.rows.item(0);
          if (row['meta_key'] === 'content_element') {
            metaValue = row['meta_value'];
          }
        }
        return defer.resolve(metaValue);
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT * FROM wp_postmeta WHERE meta_id=?", [meta_id], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    }
  });
});
