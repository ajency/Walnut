var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.Media", function(Media, App, Backbone, Marionette, $, _) {
    var API;
    Media.MediaModel = (function(superClass) {
      extend(MediaModel, superClass);

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
    Media.MediaCollection = (function(superClass) {
      extend(MediaCollection, superClass);

      function MediaCollection() {
        return MediaCollection.__super__.constructor.apply(this, arguments);
      }

      MediaCollection.prototype.filters = {
        order: 'DESC',
        orderby: 'date',
        paged: 1,
        posts_per_page: 40,
        searchStr: ''
      };

      MediaCollection.prototype.model = Media.MediaModel;

      MediaCollection.prototype.parse = function(resp) {
        if (resp.code === 'OK') {
          return resp.data;
        }
        return resp;
      };

      return MediaCollection;

    })(Backbone.Collection);
    API = {
      fetchMedia: function(params, reset) {
        var mediaCollection;
        if (params == null) {
          params = {};
        }
        mediaCollection = new Media.MediaCollection;
        mediaCollection.url = AJAXURL + "?action=query_attachments";
        _.defaults(params, mediaCollection.filters);
        mediaCollection.filters = params;
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
        media = new Media.MediaModel({
          id: mediaId
        });
        media.fetch();
        return media;
      },
      getEmptyMediaCollection: function() {
        var mediaCollection;
        mediaCollection = new Media.MediaCollection;
        return mediaCollection;
      },
      getMediaCollectionById: function(ids) {
        var mediaCollection;
        if (ids == null) {
          ids = [];
        }
        mediaCollection = new Media.MediaCollection;
        mediaCollection.url = AJAXURL + "?action=get_media_by_ids";
        if (_.size(ids) > 0) {
          mediaCollection.fetch({
            data: {
              ids: ids,
              mediaType: 'video'
            }
          });
        }
        return mediaCollection;
      },
      getPlaceHolderMedia: function() {
        var media;
        media = new Media.MediaModel;
        return media;
      },
      createNewMedia: function(data) {
        var media;
        media = new Media.MediaModel(data);
        return media;
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
        shouldReset = false;
      }
      return API.fetchMedia(params, shouldReset);
    });
    App.reqres.setHandler("get:media:by:id", function(mediaId) {
      return API.getMediaById(mediaId);
    });
    App.reqres.setHandler('get:media:collection:by:ids', function(mediaIds) {
      return API.getMediaCollectionById(mediaIds);
    });
    App.reqres.setHandler("new:media:added", function(modelData) {
      return API.createNewMedia(modelData);
    });
    return App.commands.setHandler("new:media:added", function(modelData) {
      return API.createNewMedia(modelData);
    });
  });
});
