var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'apps/content-creator/content-builder/element/controller', 'apps/content-creator/content-builder/elements/biganswer/views'], function(App, Element) {
  return App.module("ContentCreator.ContentBuilder.Element.BigAnswer", function(BigAnswer, App, Backbone, Marionette, $, _) {
    return BigAnswer.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.eventObj = options.eventObj;
        _.defaults(options.modelData, {
          element: 'BigAnswer',
          maxlength: '50',
          font: 'Arial',
          color: '#000000',
          bg_color: '#c5ebd2',
          bg_opacity: '0.5',
          font_size: '12',
          case_sensitive: false,
          marks: 2,
          style: 'blank',
          complete: false
        });
        return Controller.__super__.initialize.call(this, options);
      };

      Controller.prototype.renderElement = function() {
        var view;
        view = this._getBigAnswerView(this.layout.model);
        this.listenTo(view, 'show show:this:biganswer:properties', (function(_this) {
          return function() {
            return App.execute("show:question:properties", {
              model: _this.layout.model
            });
          };
        })(this));
        return this.layout.elementRegion.show(view);
      };

      Controller.prototype._getBigAnswerView = function(model) {
        return new BigAnswer.Views.BigAnswerView({
          model: model
        });
      };

      Controller.prototype.deleteElement = function(model) {
        Controller.__super__.deleteElement.call(this, model);
        return App.execute("close:question:properties");
      };

      return Controller;

    })(Element.Controller);
  });
});
