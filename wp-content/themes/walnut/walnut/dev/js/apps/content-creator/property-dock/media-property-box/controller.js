var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/content-creator/property-dock/media-property-box/views'], function(App, RegionController) {
  return App.module("ContentCreator.PropertyDock.MediaPropertyBox", function(MediaPropertyBox, App, Backbone, Marionette, $, _) {
    MediaPropertyBox.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        App.execute("close:question:elements");
        App.execute("close:question:element:properties");
        this.model = options.model;
        this.view = this._getView(this.model);
        return this.show(this.view);
      };

      Controller.prototype._getView = function(model) {
        return new MediaPropertyBox.Views.PropertyView({
          model: model
        });
      };

      Controller.prototype.onClose = function() {
        return this.model.save();
      };

      return Controller;

    })(RegionController);
    App.commands.setHandler("show:audio:properties", function(options) {
      return new MediaPropertyBox.Controller({
        region: options.region,
        model: options.model
      });
    });
    return App.commands.setHandler("show:video:properties", function(options) {
      return new MediaPropertyBox.Controller({
        region: options.region,
        model: options.model
      });
    });
  });
});
