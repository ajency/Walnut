var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'apps/content-creator/content-builder/element/controller', 'apps/content-creator/content-builder/elements/image/views', 'apps/content-creator/content-builder/elements/image/settings/controller'], function(App, Element) {
  return App.module('ContentCreator.ContentBuilder.Element.Image', function(Image, App, Backbone, Marionette, $, _) {
    return Image.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        this.renderElement = bind(this.renderElement, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        _.defaults(options.modelData, {
          element: 'Image',
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

      Controller.prototype.bindEvents = function() {
        this.listenTo(this.layout.model, "change:image_id", this.renderElement);
        return Controller.__super__.bindEvents.call(this);
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
        this.removeSpinner();
        imageModel = App.request("get:media:by:id", this.layout.model.get('image_id'));
        return App.execute("when:fetched", imageModel, (function(_this) {
          return function() {
            var view;
            view = _this._getImageView(imageModel);
            _this.listenTo(view, "show:media:manager", function(ratio) {
              if (ratio == null) {
                ratio = false;
              }
              App.currentImageRatio = ratio;
              App.execute("show:media:manager:app", {
                region: App.dialogRegion,
                mediaType: 'image'
              });
              _this.listenTo(App.vent, "media:manager:choosed:media", function(media) {
                _this.layout.model.set('image_id', media.get('id'));
                App.currentImageRatio = false;
                return _this.stopListening(App.vent, "media:manager:choosed:media");
              });
              return _this.listenTo(App.vent, "stop:listening:to:media:manager", function() {
                App.currentImageRatio = false;
                return _this.stopListening(App.vent, "media:manager:choosed:media");
              });
            });
            _this.listenTo(view, "image:size:selected", function(size) {
              _this.layout.model.set('size', size);
              return _this.layout.model.save();
            });
            _this.listenTo(view, 'set:image:height', function(height, width) {
              _this.layout.model.set('height', height);
              if (height === 'auto') {
                _this.layout.model.set('heightRatio', 'auto');
              } else {
                _this.layout.model.set('heightRatio', height / width);
              }
              return _this.layout.model.save();
            });
            _this.listenTo(view, 'set:image:top:position', function(width, top) {
              _this.layout.model.set('top', top);
              _this.layout.model.set('topRatio', top / width);
              return _this.layout.model.save();
            });
            return _this.layout.elementRegion.show(view);
          };
        })(this));
      };

      return Controller;

    })(Element.Controller);
  });
});
