define(['underscore', 'unserialize'], function(_) {
  return _.mixin({
    getJsonToClone: function(elements) {
      var content, defer, forEach, total;
      defer = $.Deferred();
      content = {
        elements: elements,
        excerpt: new Array
      };
      if (_.isArray(elements)) {
        total = 0;
        forEach = function(element, i) {
          total++;
          if (element.element === 'Row' || element.element === 'TeacherQuestion') {
            _.getRowElements(element).then(function(columnElement) {
              console.log('getRowElements done');
              content.excerpt.push(columnElement.excerpt);
              total--;
              if (!total) {
                return defer.resolve(content);
              }
            });
          } else {
            _.getElementMetaValues(element).done(function(meta) {
              console.log('getElementMetaValues done');
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
        excerpt: new Array
      };
      total = 0;
      forEachRowElement = function(column, i) {
        var forEachColumnElement;
        if (column.elements) {
          forEachColumnElement = function(element, j) {
            total++;
            if (element.element === 'Row' || element.element === 'TeacherQuestion') {
              _.getRowElements(element).then(function(columnElement) {
                console.log('getRowElements done');
                content.excerpt.push(columnElement.excerpt);
                total--;
                if (!total) {
                  return defer.resolve(content);
                }
              });
            } else {
              _.getElementMetaValues(element).then(function(meta) {
                console.log('getElementMetaValues done');
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
    getElementMetaValues: function(element) {
      var defer, metaID;
      defer = $.Deferred();
      metaID = element.meta_id;
      _.getMetaValueFromMetaId(metaID).then(function(metaData) {
        var ele;
        console.log('getMetaValueFromMetaId: ' + metaID + ' done');
        if (metaData) {
          ele = _.unserialize(metaData);
          ele.meta_id = metaID;
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
