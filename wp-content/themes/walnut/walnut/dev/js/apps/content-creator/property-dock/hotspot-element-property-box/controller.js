var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-creator/property-dock/hotspot-element-property-box/hotspot-element-property-view-loader'], function(App, RegionController) {
  return App.module("ContentCreator.PropertyDock.HotspotElementPropertyBox", function(HotspotElementPropertyBox, App, Backbone, MArionette, $, _) {
    var HotspotElementPropertyBoxController;
    HotspotElementPropertyBoxController = (function(_super) {
      __extends(HotspotElementPropertyBoxController, _super);

      function HotspotElementPropertyBoxController() {
        return HotspotElementPropertyBoxController.__super__.constructor.apply(this, arguments);
      }

      HotspotElementPropertyBoxController.prototype.initialize = function(options) {
        this.view = this._getView(options.model);
        return this.show(this.view);
      };

      HotspotElementPropertyBoxController.prototype._getView = function(model) {
        var elementType, viewName;
        elementType = model.get('type');
        viewName = "" + elementType + "View";
        return new HotspotElementPropertyBox.Views[viewName]({
          model: model
        });
      };

      return HotspotElementPropertyBoxController;

    })(RegionController);
    return App.commands.setHandler("show:hotspot:element:properties:box", function(options) {
      return new HotspotElementPropertyBoxController({
        region: options.region,
        model: options.model
      });
    });
  });
});
