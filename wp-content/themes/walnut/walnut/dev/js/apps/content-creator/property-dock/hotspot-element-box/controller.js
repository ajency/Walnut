var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/content-creator/property-dock/hotspot-element-box/views'], function(App, RegionController) {
  return App.module("ContentCreator.PropertyDock.HotspotElementBox", function(HotspotElementBox, App, Backbone, Marionette, $, _) {
    var HotspotElementBoxController;
    HotspotElementBoxController = (function(superClass) {
      extend(HotspotElementBoxController, superClass);

      function HotspotElementBoxController() {
        return HotspotElementBoxController.__super__.constructor.apply(this, arguments);
      }

      HotspotElementBoxController.prototype.initialize = function(options) {
        this.view = this._getView();
        return this.show(this.view);
      };

      HotspotElementBoxController.prototype._getView = function() {
        return new HotspotElementBox.Views.HotspotElementBoxView({
          collection: App.request("get:all:hotspot:elements")
        });
      };

      return HotspotElementBoxController;

    })(RegionController);
    return App.commands.setHandler("show:hotspot:elements", function(options) {
      return new HotspotElementBoxController({
        region: options.region
      });
    });
  });
});
