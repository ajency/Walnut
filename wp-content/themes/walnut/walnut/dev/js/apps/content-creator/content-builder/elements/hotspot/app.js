var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-creator/content-builder/element/controller', 'apps/content-creator/hotspot-properties/controller'], function(App, Element) {
  return App.module("ContentCreator.ContentBuilder.Element.Hotspot", function(Hotspot, App, Backbone, Marionette, $, _) {
    return Hotspot.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        console.log("in hotspot");
        this.stage = new Kinetic.Stage({
          container: 'myCanvas',
          width: 600,
          height: 400
        });
        return Controller.__super__.initialize.call(this, options);
      };

      return Controller;

    })(Element.Controller);
  });
});
