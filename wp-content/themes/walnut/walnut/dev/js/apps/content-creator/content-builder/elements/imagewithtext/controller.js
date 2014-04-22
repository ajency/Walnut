var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-creator/content-builder/element/controller', 'apps/content-creator/content-builder/elements/imagewithtext/views', 'apps/content-creator/content-builder/elements/imagewithtext/settings/controller'], function(App, Element) {
  return App.module('ContentCreator.ContentBuilder.Element.ImageWithText', function(ImageWithText, App, Backbone, Marionette, $, _) {
    return ImageWithText.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.renderElement = __bind(this.renderElement, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        _.defaults(options.modelData, {
          element: 'ImageWithText',
          image_id: 0,
          size: 'thumbnail',
          align: 'left',
          style: '',
          content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.'
        });
        return Controller.__super__.initialize.call(this, options);
      };

      Controller.prototype.bindEvents = function() {
        this.listenTo(this.layout.model, "change:image_id", this.renderElement);
        this.listenTo(this.layout.model, "change:style", this.changeElementStyle);
        this.listenTo(this.layout.model, "change:size", this.renderElement);
        this.listenTo(this.layout.model, "change:align", this.renderElement);
        return Controller.__super__.bindEvents.call(this);
      };

      Controller.prototype._getTemplateHelpers = function() {
        return {
          size: this.layout.model.get('size'),
          align: this.layout.model.get('align'),
          content: this.layout.model.get('content')
        };
      };

      Controller.prototype._getImageWithTextView = function(imageModel, style) {
        return new ImageWithText.Views.ImageWithTextView({
          model: imageModel,
          templateHelpers: this._getTemplateHelpers(),
          style: style
        });
      };

      Controller.prototype.changeElementStyle = function(model) {
        var newStyle, prevStyle;
        prevStyle = _.slugify(model.previous('style'));
        newStyle = _.slugify(model.get('style'));
        return this.layout.elementRegion.currentView.triggerMethod("style:upadted", newStyle, prevStyle);
      };

      Controller.prototype.renderElement = function() {
        var imageModel;
        this.removeSpinner();
        imageModel = App.request("get:media:by:id", this.layout.model.get('image_id'));
        return App.execute("when:fetched", imageModel, (function(_this) {
          return function() {
            var view;
            view = _this._getImageWithTextView(imageModel, _this.layout.model.get('style'));
            _this.listenTo(view, "show:media:manager", function() {
              App.navigate("media-manager", {
                trigger: true
              });
              _this.listenTo(App.vent, "media:manager:choosed:media", function(media, size) {
                _this.layout.model.set('image_id', media.get('id'));
                _this.layout.model.set('size', size);
                _this.layout.model.save();
                localStorage.setItem('ele' + _this.layout.model.get('meta_id'), JSON.stringify(_this.layout.model.toJSON()));
                return _this.stopListening(App.vent, "media:manager:choosed:media");
              });
              return _this.listenTo(App.vent, "stop:listening:to:media:manager", function() {
                return _this.stopListening(App.vent, "media:manager:choosed:media");
              });
            });
            _this.listenTo(view, "text:element:blur", function(html) {
              _this.layout.model.set('content', "" + html);
              if (_this.layout.model.hasChanged()) {
                _this.layout.model.save();
              }
              if (_this.layout.model.hasChanged()) {
                return localStorage.setItem('ele' + _this.layout.model.get('meta_id'), JSON.stringify(_this.layout.model.toJSON()));
              }
            });
            return _this.layout.elementRegion.show(view);
          };
        })(this));
      };

      return Controller;

    })(Element.Controller);
  });
});
