var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app', 'controllers/region-controller', 'text!apps/media-manager/templates/outer.html'], function(App, AppController, outerTpl) {
  return App.module('MediaManager', function(MediaManager, App, Backbone, Marionette, $, _) {
    var API, OuterLayout, ShowController;
    MediaManager.Router = (function(_super) {
      __extends(Router, _super);

      function Router() {
        return Router.__super__.constructor.apply(this, arguments);
      }

      Router.prototype.appRoutes = {
        'media-manager/:mediaType': 'show'
      };

      return Router;

    })(Marionette.AppRouter);
    ShowController = (function(_super) {
      __extends(ShowController, _super);

      function ShowController() {
        this._getLayout = __bind(this._getLayout, this);
        return ShowController.__super__.constructor.apply(this, arguments);
      }

      ShowController.prototype.initialize = function(opt) {
        var layout;
        if (opt == null) {
          opt = {};
        }
        this.choosedMedia = null;
        this.mediaType = opt.mediaType;
        this.layout = layout = this._getLayout();
        this.show(this.layout);
        this.listenTo(this.layout, "show", (function(_this) {
          return function() {
            App.execute("start:media:upload:app", {
              region: layout.uploadRegion,
              mediaType: _this.mediaType
            });
            App.execute("start:media:grid:app", {
              region: layout.gridRegion,
              mediaType: _this.mediaType
            });
            return App.execute("start:youtube:video:app", {
              region: layout.youtubeRegion,
              mediaType: _this.mediaType
            });
          };
        })(this));
        this.show(this.layout);
        this.listenTo(this.layout.gridRegion, "media:element:selected", (function(_this) {
          return function(media) {
            return _this.choosedMedia = media;
          };
        })(this));
        this.listenTo(this.layout.youtubeRegion, "youtube:url:selected", (function(_this) {
          return function(url) {
            var data, mediaModel;
            data = {
              id: 'youtube_' + _.random(855, 1234),
              title: url,
              name: url,
              url: url,
              type: 'video',
              videoType: 'youtubeVideo'
            };
            mediaModel = App.request("new:media:added", data);
            return App.vent.trigger("media:manager:choosed:media", mediaModel);
          };
        })(this));
        return this.listenTo(this.layout, "media:selected", (function(_this) {
          return function() {
            if (!_.isNull(_this.choosedMedia)) {
              App.vent.trigger("media:manager:choosed:media", _this.choosedMedia);
              if (_this.region) {
                return _this.region.closeDialog();
              }
            }
          };
        })(this));
      };

      ShowController.prototype.onClose = function() {};

      ShowController.prototype._getLayout = function() {
        return new OuterLayout({
          mediaType: this.mediaType
        });
      };

      return ShowController;

    })(AppController);
    OuterLayout = (function(_super) {
      __extends(OuterLayout, _super);

      function OuterLayout() {
        return OuterLayout.__super__.constructor.apply(this, arguments);
      }

      OuterLayout.prototype.template = outerTpl;

      OuterLayout.prototype.regions = {
        uploadRegion: '#upload-region',
        gridRegion: '#grid-region',
        youtubeRegion: '#youtube-region'
      };

      OuterLayout.prototype.dialogOptions = {
        modal_title: 'Media Manager',
        modal_size: 'wide-modal'
      };

      OuterLayout.prototype.events = {
        'click button.media-manager-select': function() {
          return this.trigger("media:selected");
        }
      };

      OuterLayout.prototype.onShow = function() {
        var _ref;
        if ((_ref = Marionette.getOption(this, 'mediaType')) === 'audio' || _ref === 'video') {
          return this.$el.find('.upload-tab').hide();
        }
      };

      OuterLayout.prototype.onClose = function() {
        return App.vent.trigger("stop:listening:to:media:manager");
      };

      return OuterLayout;

    })(Marionette.Layout);
    API = {
      show: function(mediaType) {
        return new ShowController({
          region: App.dialogRegion,
          statApp: 'all-media',
          mediaType: mediaType
        });
      },
      editMedia: function(model, region) {}
    };
    MediaManager.on("start", function() {
      return new MediaManager.Router({
        controller: API
      });
    });
    MediaManager.on("stop", function() {
      return App.vent.off("media:element:clicked");
    });
    return App.commands.setHandler("show:media:manager:app", function(options) {
      return new ShowController(options);
    });
  });
});
