var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-board/element/controller', 'apps/content-board/elements/imagewithtext/view'], function(App, Element) {
  return App.module('ContentPreview.ContentBoard.Element.ImageWithText', function(ImageWithText, App, Backbone, Marionette, $, _) {
    return ImageWithText.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.renderElement = __bind(this.renderElement, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        return Controller.__super__.initialize.call(this, options);
      };

      Controller.prototype._getTemplateHelpers = function() {
        return {
          size: this.layout.model.get('size'),
          align: this.layout.model.get('align'),
          content: this.layout.model.get('content')
        };
      };

      Controller.prototype._getImageWithTextView = function(imageModel) {
        return new ImageWithText.Views.ImageWithTextView({
          model: imageModel,
          templateHelpers: this._getTemplateHelpers()
        });
      };

      Controller.prototype.renderElement = function() {
        var imageModel;
        imageModel = App.request("get:media:by:id", this.layout.model.get('image_id'));
        return App.execute("when:fetched", imageModel, (function(_this) {
          return function() {
            var view;
            view = _this._getImageWithTextView(imageModel);
            return _this.layout.elementRegion.show(view);
          };
        })(this));
      };

      return Controller;

    })(Element.Controller);
  });
});
