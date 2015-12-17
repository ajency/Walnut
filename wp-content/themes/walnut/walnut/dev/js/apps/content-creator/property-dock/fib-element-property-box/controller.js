var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/content-creator/property-dock/fib-element-property-box/views'], function(App, RegionController) {
  return App.module("ContentCreator.PropertyDock.FibElementPropertyBox", function(FibElementPropertyBox, App, Backbone, MArionette, $, _) {
    FibElementPropertyBox.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.view = this._getView(options);
        return this.show(this.view);
      };

      Controller.prototype._getView = function(options) {
        return new FibElementPropertyBox.Views.BlankElementView({
          model: options.model,
          fibModel: options.fibModel
        });
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:fib:element:properties:box", function(options) {
      return new FibElementPropertyBox.Controller({
        region: options.region,
        model: options.model,
        fibModel: options.fibModel
      });
    });
  });
});
