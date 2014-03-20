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

      MediaModel.prototype.getBestFit = function(width, height) {
        var mode, sizes, url;
        mode = 'landscape';
        if (height > width) {
          mode = 'portrait';
        }
        url = 'http://dsdsdsd.com';
        switch (mode) {
          case 'landscape':
            url = 'landscape';
            break;
          case 'portrait':
            url = 'portrait';
        }
        sizes = this.get('sizes');
        if (sizes['thumbnail']) {
          return sizes['thumbnail'].url;
        } else {
          return sizes['full'].url;
        }
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
        mediaCollection = App.request("get:collection", 'mediacollection');
        return mediaCollection.add(media);
      }
    };
    App.reqres.setHandler("get:empty:media:collection", function() {
      return API.getEmptyMediaCollection();
    });
    App.reqres.setHandler("fetch:media", function(shouldReset) {
      if (shouldReset == null) {
        shouldReset = true;
      }
      return API.fetchMedia(shouldReset);
    });
    App.reqres.setHandler("get:media:by:id", function(mediaId) {
      return API.getMediaById(mediaId);
    });
    return App.commands.setHandler("new:media:added", function(modelData) {
      return API.createNewMedia(modelData);
    });
  });
});
