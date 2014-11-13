define(['underscore', 'unserialize'], function(_) {
  return _.mixin({
    getListOfMediaByID: function(ids) {
      var defer, forEach, length, result;
      defer = $.Deferred();
      result = [];
      length = ids.length;
      if (length === 0) {
        defer.resolve(result);
      } else {
        forEach = function(mediaId, index) {
          return _.getMediaById(mediaId).then(function(mediaData) {
            console.log('getMediaById done');
            result[index] = mediaData;
            index = index + 1;
            if (index < length) {
              return forEach(ids[index], index);
            } else {
              return defer.resolve(result);
            }
          });
        };
        forEach(ids[0], 0);
      }
      return defer.promise();
    },
    getMediaById: function(id) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var row;
        row = data.rows.item(0);
        return _.getAttachmentData(id).then(function(attachmentData) {
          var full, media, mediaUrl, sizes, url;
          url = row['guid'];
          mediaUrl = _.getSynapseMediaDirectoryPath() + url.substr(url.indexOf("uploads/"));
          if (attachmentData.sizes) {
            sizes = attachmentData.sizes;
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
          media = {
            id: row['ID'],
            filename: attachmentData.file,
            url: mediaUrl,
            mime: row['post_mime_type'],
            icon: '',
            sizes: sizes,
            height: attachmentData.height,
            width: attachmentData.width
          };
          return defer.resolve(media);
        });
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT * FROM wp_posts WHERE id=?", [id], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getAttachmentData: function(id) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var meta_value;
        meta_value = '';
        if (data.rows.length !== 0) {
          meta_value = _.unserialize(data.rows.item(0)['meta_value']);
        }
        return defer.resolve(meta_value);
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT * FROM wp_postmeta WHERE meta_key=? AND post_id=?", ['_wp_attachment_metadata', id], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    }
  });
});
