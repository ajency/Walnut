var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/content-creator/property-dock/views', 'apps/content-creator/property-dock/question-element-box-loader'], function(App, RegionController) {
  return App.module("ContentCreator.PropertyDock", function(PropertyDock, App, Backbone, Marionette, $, _) {
    var PropertyDockController;
    PropertyDockController = (function(superClass) {
      extend(PropertyDockController, superClass);

      function PropertyDockController() {
        return PropertyDockController.__super__.constructor.apply(this, arguments);
      }

      PropertyDockController.prototype.initialize = function(options) {
        this.saveModelCommand = options.saveModelCommand;
        this.layout = this._getLayout();
        App.commands.setHandler("show:question:elements", (function(_this) {
          return function(options) {
            return _this._getElementBox(options.model);
          };
        })(this));
        App.commands.setHandler("show:question:properties", (function(_this) {
          return function(options) {
            return _this._getElementProperties(options.model);
          };
        })(this));
        App.commands.setHandler("show:hotspot:element:properties", (function(_this) {
          return function(options) {
            return _this._getHotspotElementProperties(options);
          };
        })(this));
        App.commands.setHandler("show:fib:element:properties", (function(_this) {
          return function(options) {
            return _this._getFibElementProperties(options);
          };
        })(this));
        App.commands.setHandler("close:question:element:properties", (function(_this) {
          return function() {
            return _this.layout.questElementPropRegion.close();
          };
        })(this));
        App.commands.setHandler("close:question:elements", (function(_this) {
          return function() {
            return _this.layout.questElementRegion.close();
          };
        })(this));
        App.commands.setHandler("close:question:properties", (function(_this) {
          return function() {
            return _this.layout.questPropertyRegion.close();
          };
        })(this));
        this.show(this.layout);
        return this.listenTo(this.layout, "save:question", (function(_this) {
          return function() {
            return _this.saveModelCommand.execute("save:model:data");
          };
        })(this));
      };

      PropertyDockController.prototype._getLayout = function() {
        return new PropertyDock.Views.Layout;
      };

      PropertyDockController.prototype._getElementBox = function(model) {
        var ele, elementName;
        elementName = model.get('element');
        ele = _.slugify(elementName);
        return App.execute("show:" + ele + ":elements", {
          region: this.layout.questElementRegion,
          model: model
        });
      };

      PropertyDockController.prototype._getHotspotElementProperties = function(options) {
        return App.execute("show:hotspot:element:properties:box", {
          region: this.layout.questElementPropRegion,
          model: options.model,
          hotspotModel: options.hotspotModel
        });
      };

      PropertyDockController.prototype._getFibElementProperties = function(options) {
        return App.execute("show:fib:element:properties:box", {
          region: this.layout.questElementPropRegion,
          model: options.model,
          fibModel: options.fibModel
        });
      };

      PropertyDockController.prototype._getElementProperties = function(model) {
        var ele, elementName;
        elementName = model.get('element');
        ele = _.slugify(elementName);
        return App.execute("show:" + ele + ":properties", {
          region: this.layout.questPropertyRegion,
          model: model
        });
      };

      return PropertyDockController;

    })(RegionController);
    return App.commands.setHandler("show:property:dock", function(options) {
      return new PropertyDockController(options);
    });
  });
});
