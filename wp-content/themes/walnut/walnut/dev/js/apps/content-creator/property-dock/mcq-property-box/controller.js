var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-creator/property-dock/mcq-property-box/views', 'apps/content-creator/property-dock/mcq-property-box/marksview'], function(App, RegionController) {
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
        this.listenTo(this.layout, "show:individual:marks:table", (function(_this) {
          return function() {
            var marksView;
            marksView = _this._getMarksView(_this.model);
            return _this.layout.individualMarksRegion.show(marksView);
          };
        })(this));
        this.listenTo(this.layout, "hide:individual:marks:table", (function(_this) {
          return function() {
            return _this.layout.individualMarksRegion.close();
          };
        })(this));
        return this.show(this.layout);
      };

      Controller.prototype._getView = function(model) {
        return new McqPropertyBox.Views.PropertyView({
          model: model
        });
      };

      Controller.prototype._getMarksView = function(model) {
        return new McqPropertyBox.Views.MarksView({
          collection: model.get('elements')
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
