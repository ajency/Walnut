var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/content-creator/property-dock/hotspot-element-property-box/hotspot-element-property-view-loader'], function(App, RegionController) {
  return App.module("ContentCreator.PropertyDock.HotspotElementPropertyBox", function(HotspotElementPropertyBox, App, Backbone, MArionette, $, _) {
    var HotspotElementPropertyBoxController;
    HotspotElementPropertyBoxController = (function(superClass) {
      extend(HotspotElementPropertyBoxController, superClass);

      function HotspotElementPropertyBoxController() {
        return HotspotElementPropertyBoxController.__super__.constructor.apply(this, arguments);
      }

      HotspotElementPropertyBoxController.prototype.initialize = function(options) {
        this.view = this._getView(options);
        return this.show(this.view);
      };

      HotspotElementPropertyBoxController.prototype._getView = function(options) {
        var elementType, viewName;
        elementType = options.model.get('type');
        viewName = elementType + "View";
        return new HotspotElementPropertyBox.Views[viewName]({
          model: options.model,
          hotspotModel: options.hotspotModel
        });
      };

      return HotspotElementPropertyBoxController;

    })(RegionController);
    return App.commands.setHandler("show:hotspot:element:properties:box", function(options) {
      return new HotspotElementPropertyBoxController({
        region: options.region,
        model: options.model,
        hotspotModel: options.hotspotModel
      });
    });
  });
});
