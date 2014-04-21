var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-creator/property-dock/biganswer-property-box/views'], function(App, RegionController) {
  return App.module("ContentCreator.PropertyDock.BigAnswerPropertyBox", function(BigAnswerPropertyBox, App, Backbone, Marionette, $, _) {
    BigAnswerPropertyBox.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.model = options.model;
        this.layout = this._getView(this.model);
        return this.show(this.layout);
      };

      Controller.prototype._getView = function(model) {
        return new BigAnswerPropertyBox.Views.PropertyView({
          model: model
        });
      };

      Controller.prototype.onClose = function() {
        return localStorage.setItem('ele' + this.model.get('meta_id'), JSON.stringify(this.model.toJSON()));
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:biganswer:properties", function(options) {
      return new BigAnswerPropertyBox.Controller({
        region: options.region,
        model: options.model
      });
    });
  });
});
