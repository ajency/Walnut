var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/media/edit-media/views'], function(App, AppController) {
  return App.module("Media.EditMedia", function(EditMedia, App) {
    EditMedia.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opt) {
        var model, view;
        if (opt == null) {
          opt = {};
        }
        model = opt.model;
        view = this._getView(model);
        this.listenTo(view, "size:select:changed", (function(_this) {
          return function(newSize) {
            return Marionette.triggerMethod.call(_this.region, "size:select:changed", newSize);
          };
        })(this));
        this.listenTo(view, 'update:image:data', function(data) {
          model.set(data);
          return model.save(null, {
            wait: true
          });
        });
        return this.show(view);
      };

      Controller.prototype._getView = function(mediaModel) {
        return new EditMedia.Views.EditMediaView({
          model: mediaModel
        });
      };

      return Controller;

    })(AppController);
    return App.commands.setHandler("show:edit:media", function(model, region) {
      return new EditMedia.Controller({
        model: model,
        region: region
      });
    });
  });
});
