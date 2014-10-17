define(['underscore', 'unserialize'], function(_) {
  return _.mixin({
    getListOfMediaByID: function(ids) {
      var runFunc;
      runFunc = function() {
        return $.Deferred(function(d) {
          var result;
          result = [];
          _.each(ids, function(mediaId, index) {
            return (function(mediaId, index) {
              var mediaIdList;
              mediaIdList = _.getMediaById(mediaId);
              return mediaIdList.done(function(data) {
                return result[index] = data;
              });
            })(mediaId, index);
          });
          return d.resolve(result);
        });
      };
      return $.when(runFunc()).done(function() {
        return console.log('getListOfMediaByID transaction completed');
      }).fail(_.failureHandler);
    },
    getMediaById: function(id) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM wp_posts WHERE id=?", [id], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var attachmentData, row;
          row = data.rows.item(0);
          attachmentData = _.getAttachmentData(id);
          return attachmentData.done(function(data) {
            var full, mediaUrl, result, sizes, url;
            url = row['guid'];
            mediaUrl = _.getSynapseMediaDirectoryPath() + url.substr(url.indexOf("uploads/"));
            if (data.sizes) {
              sizes = data.sizes;
              full = {
                full: {}
              };
              _.extend(sizes, full);
              _.each(sizes, function(size) {
                return size.url = mediaUrl;
              });
            } else {
              sizes = '';
            }
            result = {
              id: row['ID'],
              filename: data.file,
              url: mediaUrl,
              mime: row['post_mime_type'],
              icon: '',
              sizes: sizes,
              height: data.height,
              width: data.width
            };
            return d.resolve(result);
          });
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getMediaById transaction completed');
      }).fail(_.failureHandler);
    },
    getAttachmentData: function(id) {
      var runQuery, success;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM wp_postmeta WHERE meta_key=? AND post_id=?", ['_wp_attachment_metadata', id], success(d), _.deferredErrorHandler(d));
          });
        });
      };
      success = function(d) {
        return function(tx, data) {
          var meta_value;
          meta_value = '';
          if (data.rows.length !== 0) {
            meta_value = unserialize(data.rows.item(0)['meta_value']);
          }
          return d.resolve(meta_value);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getAttachmentData transaction completed');
      }).fail(_.failureHandler);
    }
  });
});
