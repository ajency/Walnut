var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/media-manager/templates/outer.html'], function(App, AppController, outerTpl) {
  return App.module('MediaManager', function(MediaManager, App, Backbone, Marionette, $, _) {
    var API, OuterLayout, ShowController;
    MediaManager.Router = (function(_super) {
      __extends(Router, _super);

      function Router() {
        return Router.__super__.constructor.apply(this, arguments);
      }

      Router.prototype.appRoutes = {
        'media-manager': 'show'
      };

      return Router;

    })(Marionette.AppRouter);
    ShowController = (function(_super) {
      __extends(ShowController, _super);

      function ShowController() {
        return ShowController.__super__.constructor.apply(this, arguments);
      }

      ShowController.prototype.initialize = function(opt) {
        var layout;
        if (opt == null) {
          opt = {};
        }
        this.choosedMedia = null;
        this.layout = layout = this._getLayout();
        this.listenTo(this.layout, "show", (function(_this) {
          return function() {
            App.execute("start:media:upload:app", {
              region: layout.uploadRegion
            });
            return App.execute("start:media:grid:app", {
              region: layout.gridRegion
            });
          };
        })(this));
        this.show(this.layout);
        this.listenTo(this.layout.gridRegion, "media:element:selected", (function(_this) {
          return function(media) {
            _this.choosedMedia = media;
            return App.execute("show:edit:media", media, _this.layout.editMediaRegion);
          };
        })(this));
        return this.listenTo(this.layout, "media:selected", (function(_this) {
          return function() {
            if (!_.isNull(_this.choosedMedia)) {
              App.vent.trigger("media:manager:choosed:media", _this.choosedMedia);
              return _this.region.closeDialog();
            }
          };
        })(this));
      };

      ShowController.prototype.onClose = function() {
        return App.navigate('');
      };

      ShowController.prototype._getLayout = function() {
        return new OuterLayout;
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
        editMediaRegion: '#edit-media-region'
      };

      OuterLayout.prototype.dialogOptions = {
        modal_title: 'Image Manager',
        modal_size: 'wide-modal'
      };

      OuterLayout.prototype.events = {
        'click button.media-manager-select': function() {
          return this.trigger("media:selected");
        }
      };

      OuterLayout.prototype.onClose = function() {
        return App.vent.trigger("stop:listening:to:media:manager");
      };

      return OuterLayout;

    })(Marionette.Layout);
    API = {
      show: function() {
        return new ShowController({
          region: App.dialogRegion,
          statApp: 'all-media'
        });
      },
      editMedia: function(model, region) {}
    };
    MediaManager.on("start", function() {
      return new MediaManager.Router({
        controller: API
      });
    });
    return MediaManager.on("stop", function() {
      return App.vent.off("media:element:clicked");
    });
  });
});
