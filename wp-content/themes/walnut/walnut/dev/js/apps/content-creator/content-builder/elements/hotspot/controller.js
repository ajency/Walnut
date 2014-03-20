var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-creator/content-builder/element/controller', 'apps/content-creator/content-builder/elements/hotspot/views'], function(App, Element) {
  return App.module('ContentCreator.ContentBuilder.Element.Hotspot', function(Hotspot, App, Backbone, Marionette, $, _) {
    return Hotspot.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.renderElement = __bind(this.renderElement, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        _.defaults(options.modelData, {
          element: 'Hotspot',
          width: options.container.width(),
          height: options.container.height(),
          image_id: 0,
          elements: [],
          meta_id: 1,
          size: 'thumbnail',
          align: 'left'
        });
        return Controller.__super__.initialize.call(this, options);
      };

      Controller.prototype._getHotspotView = function() {
        return new Hotspot.Views.HotspotView({
          model: this.layout.model
        });
      };

      Controller.prototype.renderElement = function() {
        var view;
        this.removeSpinner();
        view = this._getHotspotView();
        this.listenTo(view, "show:media:manager", (function(_this) {
          return function() {
            App.navigate("media-manager", {
              trigger: true
            });
            return _this.listenTo(App.vent, "media:manager:choosed:media", function(media) {
              _this.layout.model.set('image_id', media.get('id'));
              _this.layout.model.save();
              return _this.stopListening(App.vent, "media:manager:choosed:media");
            });
          };
        })(this));
        this.layout.elementRegion.show(view);
        return App.execute("show:question:elements", {
          model: this.layout.model
        });
      };

      Controller.prototype.deleteElement = function(model) {
        if (!this.layout.elementRegion.currentView.$el.canBeDeleted()) {
          return alert("Please remove elements inside row and then delete.");
        } else {
          return model.destroy();
        }
      };

      return Controller;

    })(Element.Controller);
  });
});
