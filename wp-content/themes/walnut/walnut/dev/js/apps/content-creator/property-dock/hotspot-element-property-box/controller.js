var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("ContentCreator.PropertyDock.HotspotElementPropertyBox", function(HotspotElementPropertyBox, App, Backbone, MArionette, $, _) {
    var HotspotElementPropertyBoxController;
    HotspotElementPropertyBoxController = (function(_super) {
      __extends(HotspotElementPropertyBoxController, _super);

      function HotspotElementPropertyBoxController() {
        return HotspotElementPropertyBoxController.__super__.constructor.apply(this, arguments);
      }

      HotspotElementPropertyBoxController.prototype.initialize = function() {};

      return HotspotElementPropertyBoxController;

    })(RegionController);
    return App.commands.setHandler("show:hotspot:properties:box", function(options) {
      return new HotspotElementPropertyBoxController;
    });
  });
});
