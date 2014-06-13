var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.Media", function(Media, App, Backbone, Marionette, $, _) {
    var API, mediaCollection;
    Media.MediaModel = (function(_super) {
      __extends(MediaModel, _super);

      function MediaModel() {
        return MediaModel.__super__.constructor.apply(this, arguments);
      }

      MediaModel.prototype.idAttribute = 'id';

      MediaModel.prototype.name = 'media';

      MediaModel.prototype.getBestFit = function(width) {
        var closest, sizes, smallest;
        sizes = this.get('sizes');
        closest = null;
        smallest = 99999;
        _.each(sizes, function(size, key) {
          var val;
          val = size.width - width;
          val = val < 0 ? -1 * val : val;
          if (val <= smallest) {
            closest = {
              url: size.url,
              size: key
            };
            return smallest = val;
          }
        });
        if (_.isNull(closest)) {
          closest = sizes['full'];
        }
        console.log(closest);
        return closest;
      };

      return MediaModel;

    })(Backbone.Model);
    Media.MediaCollection = (function(_super) {
      __extends(MediaCollection, _super);

      function MediaCollection() {
        return MediaCollection.__super__.constructor.apply(this, arguments);
      }

      MediaCollection.prototype.filters = {
        order: 'DESC',
        orderby: 'date',
        paged: 1,
        posts_per_page: 40
      };

      MediaCollection.prototype.model = Media.MediaModel;

      MediaCollection.prototype.name = 'media';

      MediaCollection.prototype.parse = function(resp) {
        if (resp.code === 'OK') {
          return resp.data;
        }
        return resp;
      };

      return MediaCollection;

    })(Backbone.Collection);
    mediaCollection = new Media.MediaCollection;
    API = {
      fetchMedia: function(params, reset) {
        if (params == null) {
          params = {};
        }
        mediaCollection.url = "" + AJAXURL + "?action=query_attachments";
        _.defaults(params, mediaCollection.filters);
        mediaCollection.fetch({
          reset: reset,
          data: params
        });
        return mediaCollection;
      },
      getMediaById: function(mediaId) {
        var media;
        if (0 === parseInt(mediaId)) {
          return API.getPlaceHolderMedia();
        }
        media = mediaCollection.get(parseInt(mediaId));
        if (_.isUndefined(media)) {
          media = new Media.MediaModel({
            id: mediaId
          });
          mediaCollection.add(media);
          media.fetch();
        }
        return media;
      },
      getEmptyMediaCollection: function() {
        return new Media.MediaCollection;
      },
      getPlaceHolderMedia: function() {
        var media;
        media = new Media.MediaModel;
        return media;
      },
      createNewMedia: function(data) {
        var media;
        media = new Media.MediaModel(data);
        mediaCollection.add(media);
        return media;
      },
      getMediaByIdFromLocal: function(id) {
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
            var row;
            row = data.rows.item(0);
            return (function(row) {
              var attachmentData;
              attachmentData = _.getAttachmentData(id);
              return attachmentData.done(function(data) {
                var directoryPath, full, mediaUrl, result, url;
                url = row['guid'];
                directoryPath = "cdvfile://localhost/persistent/SynapseAssets/SynapseImages/";
                mediaUrl = directoryPath + url.substr(url.indexOf("uploads/"));
                console.log('mediaUrl: ' + mediaUrl);
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
            })(row);
          };
        };
        return $.when(runQuery()).done(function() {
          return console.log('getMediaByIdFromLocal transaction completed');
        }).fail(_.failureHandler);
      }
    };
    App.reqres.setHandler("get:empty:media:collection", function() {
      return API.getEmptyMediaCollection();
    });
    App.reqres.setHandler("fetch:media", function(params, shouldReset) {
      if (params == null) {
        params = {};
      }
      if (shouldReset == null) {
        shouldReset = true;
      }
      return API.fetchMedia(params, shouldReset);
    });
    App.reqres.setHandler("get:media:by:id", function(mediaId) {
      return API.getMediaById(mediaId);
    });
    App.commands.setHandler("new:media:added", function(modelData) {
      return API.createNewMedia(modelData);
    });
    return App.reqres.setHandler("get:media:by:id:local", function(id) {
      return API.getMediaByIdFromLocal(id);
    });
  });
});
