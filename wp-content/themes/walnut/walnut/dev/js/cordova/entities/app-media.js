define(['underscore', 'unserialize'], function(_) {
  return _.mixin({
    getListOfMediaByID: function(ids) {
      var defer, forEach, result;
      defer = $.Deferred();
      result = [];
      forEach = function(mediaId, index) {
        var i;
        _.getMediaById(mediaId).then(function(data) {
          return result[index] = data;
        });
        i = i + 1;
        if (i < _.size(ids)) {
          return forEach(ids[i], i);
        } else {
          return defer.resolve(result);
        }
      };
      forEach(ids[0], 0);
      return defer.promise();
    },
    getMediaById: function(id) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var forEach, result;
        result = [];
        if (data.rows.length === 0) {
          return defer.resolve(result);
        } else {
          forEach = function(row, i) {
            return _.getAttachmentData(id).then(function(data) {
              var full, mediaUrl, sizes, url;
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
              i = i + 1;
              if (i < data.rows.length) {
                return forEach(data.rows.item(i), i);
              } else {
                return defer.resolve(result);
              }
            });
          };
          return forEach(data.rows.item(0), 0);
        }
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
          meta_value = unserialize(data.rows.item(0)['meta_value']);
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
