var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/media-collection-manager/media-list/media-list-views'], function(App, RegionController) {
  return App.module('MediaCollectionManager.MediaList', function(MediaList, App) {
    MediaList.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.showSuccessMessage = __bind(this.showSuccessMessage, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.mediaCollection = options.mediaCollection;
        this.view = this._getListView();
        this.listenTo(this.view, "itemview:remove:media", (function(_this) {
          return function(iv, media) {
            return _this.mediaCollection.remove(media);
          };
        })(this));
        this.listenTo(this.view, "media:order:updated", (function(_this) {
          return function(mediaIds) {
            _.each(mediaIds, function(mediaId, index) {
              var media;
              media = _this.mediaCollection.get(mediaId);
              if (media) {
                return media.set('order', index + 1);
              }
            });
            return _this.showSuccessMessage();
          };
        })(this));
        return this.show(this.view);
      };

      Controller.prototype._getListView = function() {
        return new MediaList.Views.MediaListView({
          collection: this.mediaCollection
        });
      };

      Controller.prototype.showSuccessMessage = function() {
        return Marionette.triggerMethod.call(this.region, "show:order:updated:msg");
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler('show:media:list', function(options) {
      return new MediaList.Controller(options);
    });
  });
});
