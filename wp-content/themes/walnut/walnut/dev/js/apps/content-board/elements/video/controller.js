var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-board/element/controller', 'apps/content-board/elements/video/view'], function(App, Element) {
  return App.module('ContentPreview.ContentBoard.Element.Video', function(Video, App, Backbone, Marionette, $, _) {
    return Video.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._getVideoUrls = __bind(this._getVideoUrls, this);
        this.renderElement = __bind(this.renderElement, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        return Controller.__super__.initialize.call(this, options);
      };

      Controller.prototype.bindEvents = function() {
        return Controller.__super__.bindEvents.call(this);
      };

      Controller.prototype._getVideoView = function(videoModel) {
        return new Video.Views.VideoView({
          model: this.layout.model
        });
      };

      Controller.prototype._getVideoCollection = function() {
        if (!this.videoCollection) {
          if (this.layout.model.get('video_ids') && this.layout.model.get('video_ids').length) {
            this.videoCollection = App.request("get:media:collection:by:ids", this.layout.model.get('video_ids'));
          } else {
            this.videoCollection = App.request("get:empty:media:collection");
          }
        }
        this.videoCollection.comparator = 'order';
        return this.videoCollection;
      };

      Controller.prototype._parseInt = function() {
        var video_ids;
        video_ids = new Array();
        if (!this.layout.model.get('video_ids') && this.layout.model.get('video_id') !== '') {
          this.layout.model.set('video_ids', [this.layout.model.get('video_id')]);
          this.layout.model.set('videoUrls', [this.layout.model.get('videoUrl')]);
        }
        _.each(this.layout.model.get('video_ids'), function(id) {
          return video_ids.push(parseInt(id));
        });
        return this.layout.model.set('video_ids', video_ids);
      };

      Controller.prototype.renderElement = function() {
        var videoCollection;
        this._parseInt();
        videoCollection = this._getVideoCollection();
        return App.execute("when:fetched", videoCollection, (function(_this) {
          return function() {
            var urls, view;
            urls = _this._getVideoUrls(videoCollection);
            _this.layout.model.set({
              'videoUrl': _.first(urls)
            });
            _this.layout.model.set({
              'videoUrls': urls
            });
            view = _this._getVideoView();
            return _this.layout.elementRegion.show(view);
          };
        })(this));
      };

      Controller.prototype._getVideoUrls = function(collection) {
        var urls;
        urls = collection.pluck('url');
        return urls = _.map(urls, (function(_this) {
          return function(url, index) {
            var titles;
            titles = _this.layout.model.get('title');
            if (_.str.contains(titles[index], 'youtube.com') && !url) {
              return titles[index];
            } else {
              return url;
            }
          };
        })(this));
      };

      return Controller;

    })(Element.Controller);
  });
});
