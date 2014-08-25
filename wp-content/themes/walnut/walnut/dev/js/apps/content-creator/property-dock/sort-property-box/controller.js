var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-creator/property-dock/sort-property-box/views'], function(App, RegionController) {
  return App.module("ContentCreator.PropertyDock.SortPropertyBox", function(SortPropertyBox, App, Backbone, Marionette, $, _) {
    SortPropertyBox.Controller = (function(_super) {
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
        return new SortPropertyBox.Views.PropertyView({
          model: model
        });
      };

      Controller.prototype.onClose = function() {
        var elements, models, optionCollection;
        if (this.model.get('marks') > 0) {
          this.model.set('complete', true);
        } else {
          this.model.set('complete', false);
        }
        models = this.model.get('elements').models;
        elements = _.map(models, function(m) {
          return m.toJSON();
        });
        console.log(elements);
        this.model.set({
          'elements': elements
        });
        this.model.save();
        optionCollection = App.request("create:new:option:collection", models);
        this.model.set('elements', optionCollection);
        return console.log(this.model);
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:sort:properties", function(options) {
      return new SortPropertyBox.Controller({
        region: options.region,
        model: options.model
      });
    });
  });
});
