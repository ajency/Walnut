var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/content-creator/content-builder/elements/image/settings/views'], function(App, AppController) {
  return App.module('ContentCreator.ContentBuilder.Element.Image.Settings', function(Settings, App, Backbone, Marionette, $, _) {
    Settings.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opt) {
        var model, view;
        if (opt == null) {
          opt = {};
        }
        this.model = opt.model;
        this.region = App.settingsRegion;
        model = App.request("get:element:settings:options", 'Image');
        view = this._getSettingView(model, this.model);
        this.listenTo(view, 'show', (function(_this) {
          return function() {
            return _this.region.$el.center(false);
          };
        })(this));
        this.listenTo(view, "element:style:changed", (function(_this) {
          return function(style) {
            return _this.model.set("style", style);
          };
        })(this));
        this.listenTo(view, "element:draggable:changed", (function(_this) {
          return function(draggable) {
            return _this.model.set("draggable", draggable);
          };
        })(this));
        this.listenTo(view, "element:alignment:changed", (function(_this) {
          return function(alignment) {
            return _this.model.set("align", alignment);
          };
        })(this));
        this.listenTo(view, "element:spacing:changed", (function(_this) {
          return function(spacing, value) {
            _this.model.set(spacing, value);
            return console.log(_this.model);
          };
        })(this));
        return this.show(view);
      };

      Controller.prototype.onClose = function() {
        if (!this.model.hasChanged()) {
          return;
        }
        return this.model.save(null, {
          wait: true
        });
      };

      Controller.prototype._getSettingView = function(model, eleModel) {
        return new Settings.Views.SettingsView({
          eleModel: eleModel,
          model: model
        });
      };

      return Controller;

    })(AppController);
    return App.vent.on("show:image:settings:popup", function(model) {
      return new Settings.Controller({
        model: model
      });
    });
  });
});
