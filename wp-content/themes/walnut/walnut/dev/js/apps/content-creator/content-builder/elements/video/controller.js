var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-creator/content-builder/element/controller', 'apps/content-creator/content-builder/elements/video/views'], function(App, Element) {
  return App.module('ContentCreator.ContentBuilder.Element.Video', function(Video, App, Backbone, Marionette, $, _) {
    return Video.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.renderElement = __bind(this.renderElement, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        _.defaults(options.modelData, {
          element: 'Video',
          video_ids: [],
          video_id: 0,
          height: 0,
          width: 0,
          title: [],
          videoUrl: '',
          videoUrls: []
        });
        return Controller.__super__.initialize.call(this, options);
      };

      Controller.prototype.bindEvents = function() {
        return Controller.__super__.bindEvents.call(this);
      };

      Controller.prototype._getVideoView = function() {
        return new Video.Views.VideoView({
          model: this.layout.model
        });
      };

      Controller.prototype._getVideoCollection = function() {
        if (!this.videoCollection) {
          if (this.layout.model.get('video_ids').length) {
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
        if (!this.layout.model.get('video_ids') && this.layout.model.get('video_id')) {
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
        this.removeSpinner();
        this._parseInt();
        videoCollection = this._getVideoCollection();
        return App.execute("when:fetched", videoCollection, (function(_this) {
          return function() {
            videoCollection.each(function(model, index) {
              var titles;
              titles = _this.layout.model.get('title');
              if (_.str.contains(titles[index], 'youtube.com') && !model.get('url')) {
                return model.set({
                  'title': titles[index],
                  'name': titles[index],
                  'url': titles[index]
                });
              }
            });
            _this.view = _this._getVideoView();
            _this.listenTo(_this.view, "show:media:manager", function() {
              return App.execute("show:media:collection:manager", {
                region: App.dialogRegion,
                mediaType: 'video',
                mediaCollection: videoCollection
              });
            });
            _this.listenTo(_this.videoCollection, 'add remove order:updated', function() {
              this.videoCollection.sort();
              this.layout.model.set({
                'video_ids': this.videoCollection.pluck('id'),
                'videoUrls': this.videoCollection.pluck('url'),
                'title': this.videoCollection.pluck('title'),
                'video_id': _.first(this.videoCollection.pluck('id')),
                'videoUrl': _.first(this.videoCollection.pluck('url'))
              });
              this.layout.elementRegion.show(this.view);
              return this.layout.model.save();
            });
            _this.listenTo(_this.view, "show show:video:properties", function() {
              return App.execute("show:question:properties", {
                model: _this.layout.model
              });
            });
            return _this.layout.elementRegion.show(_this.view);
          };
        })(this));
      };

      return Controller;

    })(Element.Controller);
  });
});
