var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/content-creator/element-box/view'], function(App, RegionController) {
  return App.module("ContentCreator.ElementBox", function(ElementBox, App, Backbone, Marionette, $, _) {
    var ElementBoxController;
    ElementBoxController = (function(superClass) {
      extend(ElementBoxController, superClass);

      function ElementBoxController() {
        return ElementBoxController.__super__.constructor.apply(this, arguments);
      }

      ElementBoxController.prototype.initialize = function(options) {
        var contentType, eventObj;
        contentType = options.contentType, eventObj = options.eventObj;
        console.log(eventObj);
        this.view = this._getElementBoxView(contentType);
        this.listenTo(eventObj.vent, "question:element:added", (function(_this) {
          return function() {
            return _this.view.triggerMethod("question:element:added");
          };
        })(this));
        this.listenTo(eventObj.vent, "question:element:removed", (function(_this) {
          return function() {
            return _this.view.triggerMethod("question:element:removed");
          };
        })(this));
        return this.show(this.view);
      };

      ElementBoxController.prototype._getElementBoxView = function(contentType) {
        return new ElementBox.Views.ElementBoxView({
          contentType: contentType
        });
      };

      return ElementBoxController;

    })(RegionController);
    return App.commands.setHandler("show:element:box", function(options) {
      return new ElementBoxController(options);
    });
  });
});
