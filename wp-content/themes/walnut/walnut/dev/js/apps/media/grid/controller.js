var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/media/grid/views'], function(App, AppController) {
  return App.module("Media.Grid", function(Grid, App) {
    Grid.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._searchMedia = __bind(this._searchMedia, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var data;
        this.mediaType = opts.mediaType;
        data = {
          mediaType: this.mediaType
        };
        if (this.mediaType === 'image') {
          this.mediaCollection = App.request("fetch:media", data);
        } else {
          this.mediaCollection = App.request("get:empty:media:collection");
        }
        this.view = this._getView(this.mediaCollection);
        App.execute("when:fetched", this.mediaCollection, (function(_this) {
          return function() {
            return _this.show(_this.view, {
              loading: true
            });
          };
        })(this));
        this.listenTo(this.view, "itemview:media:element:selected", (function(_this) {
          return function(iv) {
            console.log('listening to itemview:media:element:selected ');
            return Marionette.triggerMethod.call(_this.region, "media:element:selected", Marionette.getOption(iv, 'model'));
          };
        })(this));
        this.listenTo(this.view, "itemview:media:element:unselected", (function(_this) {
          return function(iv) {
            return Marionette.triggerMethod.call(_this.region, "media:element:unselected", Marionette.getOption(iv, 'model'));
          };
        })(this));
        return this.listenTo(this.view, "search:media", this._searchMedia);
      };

      Controller.prototype._searchMedia = function(searchStr) {
        var data;
        data = {
          mediaType: this.mediaType,
          searchStr: searchStr
        };
        return this.mediaCollection = App.request("fetch:media", data);
      };

      Controller.prototype._getView = function(mediaCollection) {
        this.mediaCollection = mediaCollection;
        console.log(this.mediaCollection);
        return new Grid.Views.GridView({
          collection: this.mediaCollection,
          mediaType: this.mediaType
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
