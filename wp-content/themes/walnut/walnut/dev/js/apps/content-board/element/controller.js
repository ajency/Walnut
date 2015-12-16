var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/element-controller', 'apps/content-board/element/views'], function(App, ElementController) {
  return App.module('ContentPreview.ContentBoard.Element', function(Element, App, Backbone, Marionette, $, _) {
    return Element.Controller = (function(superClass) {
      extend(Controller, superClass);

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
            var i, len, margin, model, ref, results;
            model = Marionette.getOption(_this.layout, 'model');
            ref = ['top_margin', 'left_margin', 'right_margin', 'bottom_margin'];
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              margin = ref[i];
              results.push(_this.layout.setMargin(model.get(margin)));
            }
            return results;
          };
        })(this));
        return this.add(this.layout, $(container));
      };

      Controller.prototype._getView = function(elementModel) {
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
