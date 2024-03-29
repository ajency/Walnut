var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/media/grid/views'], function(App, AppController) {
  return App.module("Media.Grid", function(Grid, App) {
    Grid.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        this._searchMedia = bind(this._searchMedia, this);
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
            return Marionette.triggerMethod.call(_this.region, "media:element:selected", Marionette.getOption(iv, 'model'));
          };
        })(this));
        this.listenTo(this.view, "itemview:media:element:unselected", (function(_this) {
          return function(iv) {
            return Marionette.triggerMethod.call(_this.region, "media:element:unselected", Marionette.getOption(iv, 'model'));
          };
        })(this));
        this.listenTo(this.view, "itemview:delete:media:image", (function(_this) {
          return function(iv, model) {
            return _this.deleteImage(model);
          };
        })(this));
        this.listenTo(this.view, "itemview:show:image:editor", (function(_this) {
          return function(iv, model) {
            var editView, ratio;
            ratio = App.currentImageRatio;
            editView = App.request("get:image:editor:view", model, {
              aspectRatio: ratio
            });
            _this.view.triggerMethod("show:edit:image", editView);
            return _this.listenTo(editView, "image:editing:cancelled", function() {
              return _this.view.triggerMethod("image:editing:cancelled");
            });
          };
        })(this));
        App.commands.setHandler("new:media:added", (function(_this) {
          return function(media) {
            _this.mediaCollection.add(media);
            return _this.mediaCollection.trigger('media:uploaded', _this.mediaCollection.get(media.id));
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
        this.mediaCollection = App.request("fetch:media", data);
        return App.execute("when:fetched", this.mediaCollection, (function(_this) {
          return function() {
            return _this.view.triggerMethod("media:collection:fetched", _this.mediaCollection);
          };
        })(this));
      };

      Controller.prototype._getView = function(mediaCollection) {
        this.mediaCollection = mediaCollection;
        return new Grid.Views.GridView({
          collection: this.mediaCollection,
          mediaType: this.mediaType
        });
      };

      Controller.prototype.deleteImage = function(imageModel) {
        return imageModel.destroy({
          allData: false,
          wait: true
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
