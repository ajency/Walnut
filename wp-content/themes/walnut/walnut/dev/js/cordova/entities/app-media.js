define(['underscore', 'unserialize'], function(_) {
  return _.mixin({
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
            var full, mediaUrl, result, url;
            url = row['guid'];
            mediaUrl = _.getSynapseMediaDirectoryPath() + url.substr(url.indexOf("uploads/"));
            full = {
              full: {}
            };
            _.extend(data.sizes, full);
            if (data.sizes) {
              _.each(data.sizes, function(size) {
                return size.url = mediaUrl;
              });
            } else {
              data.sizes = '';
            }
            result = {
              id: row['ID'],
              filename: data.file,
              url: mediaUrl,
              mime: row['post_mime_type'],
              icon: '',
              sizes: data.sizes,
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
