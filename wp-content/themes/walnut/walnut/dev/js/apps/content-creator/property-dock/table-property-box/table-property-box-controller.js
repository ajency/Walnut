var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-creator/property-dock/table-property-box/table-property-box-views'], function(App, RegionController) {
  return App.module("ContentCreator.PropertyDock.TablePropertyBox", function(TablePropertyBox, App, Backbone, Marionette, $, _) {
    TablePropertyBox.Controller = (function(_super) {
      __extends(Controller, _super);

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
        return new TablePropertyBox.Views.PropertyView({
          model: model
        });
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:table:properties", function(options) {
      return new TablePropertyBox.Controller({
        region: options.region,
        model: options.model
      });
    });
  });
});
