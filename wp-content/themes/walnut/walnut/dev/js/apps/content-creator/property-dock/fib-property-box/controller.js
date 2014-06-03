var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-creator/property-dock/fib-property-box/views'], function(App, RegionController) {
  return App.module("ContentCreator.PropertyDock.FibPropertyBox", function(FibPropertyBox, App, Backbone, Marionette, $, _) {
    FibPropertyBox.Controller = (function(_super) {
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
        return new FibPropertyBox.Views.PropertyView({
          model: model
        });
      };

      Controller.prototype.onClose = function() {
        var ElementCollection, elements, models;
        App.execute('save:fib:text');
        models = this.model.get('blanksArray').models;
        elements = _.map(models, function(m) {
          return m.toJSON();
        });
        this.model.set({
          'blanksArray': elements
        });
        this.model.save();
        ElementCollection = App.request("create:new:question:element:collection", models);
        return this.model.set('blanksArray', ElementCollection);
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:fib:properties", function(options) {
      return new FibPropertyBox.Controller({
        region: options.region,
        model: options.model
      });
    });
  });
});
