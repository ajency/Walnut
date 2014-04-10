var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-creator/property-dock/mcq-property-box/views'], function(App, RegionController) {
  return App.module("ContentCreator.PropertyDock.McqPropertyBox", function(McqPropertyBox, App, Backbone, Marionette, $, _) {
    McqPropertyBox.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.model = options.model;
        this.layout = this._getView(this.model);
        this.listenTo(this.layout, "change:option:number", (function(_this) {
          return function(number) {
            _this.model.set('optioncount', parseInt(number));
            return console.log(_this.model);
          };
        })(this));
        return this.show(this.layout);
      };

      Controller.prototype._getView = function(model) {
        return new McqPropertyBox.Views.PropertyView({
          model: model
        });
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:mcq:properties", function(options) {
      return new McqPropertyBox.Controller({
        region: options.region,
        model: options.model
      });
    });
  });
});
