var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-preview/content-board/element/controller', 'apps/content-preview/content-board/elements/hotspot/view'], function(App, Element) {
  return App.module("ContentPreview.ContentBoard.Element.Hotspot", function(Hotspot, App, Backbone, Marionette, $, _) {
    return Hotspot.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.renderElement = __bind(this.renderElement, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.eventObj = options.eventObj;
        _.defaults(options.modelData, {
          element: 'Hotspot',
          height: 0,
          marks: 1,
          enableIndividualMarks: false,
          optionCollection: [],
          textCollection: [],
          imageCollection: []
        });
        return Controller.__super__.initialize.call(this, options);
      };

      Controller.prototype._getHotspotView = function() {
        return new Hotspot.Views.HotspotView({
          model: this.layout.model
        });
      };

      Controller.prototype.renderElement = function() {
        this.optionCollection = App.request("create:new:hotspot:element:collection", this.layout.model.get('optionCollection'));
        this.textCollection = App.request("create:new:hotspot:element:collection", this.layout.model.get('textCollection'));
        this.imageCollection = App.request("create:new:hotspot:element:collection", this.layout.model.get('imageCollection'));
        this.layout.model.set('optionCollection', this.optionCollection);
        this.layout.model.set('textCollection', this.textCollection);
        this.layout.model.set('imageCollection', this.imageCollection);
        this.view = this._getHotspotView();
        this.listenTo(this.view, "show show:hotspot:elements", (function(_this) {
          return function() {
            App.execute("show:question:elements", {
              model: _this.layout.model
            });
            return App.execute("show:question:properties", {
              model: _this.layout.model
            });
          };
        })(this));
        this.listenTo(this.view, "close:hotspot:element:properties", function() {
          return App.execute("close:question:element:properties");
        });
        this.listenTo(this.view, "show:hotspot:element:properties", function(hotspotElement) {
          return App.execute("show:hotspot:element:properties", {
            model: hotspotElement,
            hotspotModel: this.layout.model
          });
        });
        return this.layout.elementRegion.show(this.view, {
          loading: true
        });
      };

      Controller.prototype.deleteElement = function(model) {
        model.set('optionCollection', '');
        model.set('textCollection', '');
        model.set('imageCollection', '');
        model.destroy();
        App.execute("close:question:elements");
        App.execute("close:question:properties");
        return App.execute("close:question:element:properties");
      };

      return Controller;

    })(Element.Controller);
  });
});
