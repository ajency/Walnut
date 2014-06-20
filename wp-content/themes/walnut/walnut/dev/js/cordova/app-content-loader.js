define(['underscore', 'unserialize'], function(_) {
  var getElementMetaValues, getMetaValueFromMetaId, getRowElements;
  getMetaValueFromMetaId = function(meta_id) {
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
  };
  _.getJsonToClone = function(elements) {
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
            if (element.element === 'Row' || element.element === 'TeacherQuestion') {
              insideElement = getRowElements(element);
              return insideElement.done(function(columnElement) {
                content.excerpt.push(columnElement.excerpt);
                total--;
                if (!total) {
                  return d.resolve(content);
                }
              });
            } else {
              metaData = getElementMetaValues(element);
              return metaData.done(function(meta) {
                element.meta_id = parseInt(element.meta_id);
                if (meta !== false) {
                  _.defaults(element, meta);
                  if (element.element === 'Text') {
                    content.excerpt.push(meta.content);
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
        }
      });
    };
    return $.when(runFunc()).done(function() {
      return console.log("get getJsonToClone done");
    }).fail(_.failureHandler);
  };
  getRowElements = function(rowElements) {
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
              if (element.element === 'Row' || element.element === 'TeacherQuestion') {
                insideElement = getRowElements(element);
                return insideElement.done(function(columnElement) {
                  content.excerpt.push(columnElement.excerpt);
                  total--;
                  if (!total) {
                    return d.resolve(content);
                  }
                });
              } else {
                metaData = getElementMetaValues(element);
                return metaData.done(function(meta) {
                  element.meta_id = parseInt(element.meta_id);
                  if (meta !== false) {
                    _.defaults(element, meta);
                    if (element.element === 'Text') {
                      content.excerpt.push(element.content);
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
  };
  return getElementMetaValues = function(element) {
    var runFunc;
    runFunc = function() {
      return $.Deferred(function(d) {
        var meta;
        meta = getMetaValueFromMetaId(element.meta_id);
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
  };
});
