var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/element-controller', 'apps/content-preview/content-board/element/views'], function(App, ElementController) {
  return App.module('ContentPreview.ContentBoard.Element', function(Element, App, Backbone, Marionette, $, _) {
    return Element.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var container, element, modelData, options;
        container = opts.container, modelData = opts.modelData;
        options = {
          bottom_margin: '',
          top_margin: '',
          left_margin: '',
          right_margin: ''
        };
        _.defaults(modelData, options);
        element = App.request("create:new:element", modelData);
        this.layout = this._getView(element);
        this.layout.elementRegion.on("show", (function(_this) {
          return function(view) {
            var margin, model, _i, _len, _ref, _results;
            model = Marionette.getOption(_this.layout, 'model');
            _ref = ['top_margin', 'left_margin', 'right_margin', 'bottom_margin'];
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              margin = _ref[_i];
              _results.push(_this.layout.setMargin(model.get(margin)));
            }
            return _results;
          };
        })(this));
        return this.add(this.layout, $(container));
      };

      Controller.prototype._getView = function(elementModel) {
        console.log('elementModel');
        console.log(elementModel);
        return new Element.Views.ElementView({
          model: elementModel
        });
      };

      Controller.prototype.deleteElement = function(model) {
        return model.destroy({
          wait: true
        });
      };

      return Controller;

    })(ElementController);
  });
});
