var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-board/element/controller', 'apps/content-board/elements/image/view'], function(App, Element) {
  return App.module('ContentPreview.ContentBoard.Element.Image', function(Image, App, Backbone, Marionette, $, _) {
    return Image.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.renderElement = __bind(this.renderElement, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        _.defaults(options.modelData, {
          image_id: 0,
          size: 'thumbnail',
          align: 'left',
          heightRatio: 'auto',
          topRatio: 0
        });
        if (options.modelData.heightRatio !== 'auto') {
          options.modelData.heightRatio = parseFloat(options.modelData.heightRatio);
        }
        if (_.isNaN(options.modelData.topRatio)) {
          options.modelData.topRatio = 0;
        }
        return Controller.__super__.initialize.call(this, options);
      };

      Controller.prototype._getTemplateHelpers = function() {
        return {
          size: this.layout.model.get('size'),
          alignment: this.layout.model.get('align')
        };
      };

      Controller.prototype._getImageView = function(imageModel) {
        return new Image.Views.ImageView({
          model: imageModel,
          imageHeightRatio: this.layout.model.get('heightRatio'),
          positionTopRatio: parseFloat(this.layout.model.get('topRatio')),
          templateHelpers: this._getTemplateHelpers()
        });
      };

      Controller.prototype.renderElement = function() {
        var imageModel;
        imageModel = App.request("get:media:by:id", this.layout.model.get('image_id'));
        return App.execute("when:fetched", imageModel, (function(_this) {
          return function() {
            var view;
            view = _this._getImageView(imageModel);
            return _this.layout.elementRegion.show(view);
          };
        })(this));
      };

      return Controller;

    })(Element.Controller);
  });
});
