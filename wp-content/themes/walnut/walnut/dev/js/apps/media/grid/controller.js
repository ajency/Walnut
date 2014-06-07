var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/media/grid/views'], function(App, AppController) {
  return App.module("Media.Grid", function(Grid, App) {
    Grid.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var data, mediaCollection, mediaType, view;
        mediaType = opts.mediaType;
        data = {
          mediaType: mediaType
        };
        mediaCollection = App.request("fetch:media", data, false);
        view = this._getView(mediaCollection);
        this.listenTo(view, "itemview:media:element:selected", (function(_this) {
          return function(iv) {
            return Marionette.triggerMethod.call(_this.region, "media:element:selected", Marionette.getOption(iv, 'model'));
          };
        })(this));
        this.listenTo(view, "itemview:media:element:unselected", (function(_this) {
          return function(iv) {
            return Marionette.triggerMethod.call(_this.region, "media:element:unselected", Marionette.getOption(iv, 'model'));
          };
        })(this));
        return App.execute("when:fetched", mediaCollection, (function(_this) {
          return function() {
            return _this.show(view, {
              loading: true
            });
          };
        })(this));
      };

      Controller.prototype._getView = function(mediaCollection) {
        console.log(mediaCollection);
        return new Grid.Views.GridView({
          collection: mediaCollection
        });
      };

      return Controller;

    })(AppController);
    return App.commands.setHandler('start:media:grid:app', (function(_this) {
      return function(options) {
        return new Grid.Controller({
          region: options.region,
          mediaType: options.mediaType
        });
      };
    })(this));
  });
});
