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
          elements: [],
          meta_id: 1
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
        this.layout.elementRegion.show(view);
        console.log(this.layout.model);
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
