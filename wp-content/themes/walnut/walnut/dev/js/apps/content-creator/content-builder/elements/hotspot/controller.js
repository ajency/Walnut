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
        this.eventObj = options.eventObj;
        _.defaults(options.modelData, {
          element: 'Hotspot',
          content: '',
          marks: 1
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
        view = this._getHotspotView();
        this.listenTo(view, "show:hotspot:elements", (function(_this) {
          return function() {
            return App.execute("show:question:elements", {
              model: _this.layout.model
            });
          };
        })(this));
        this.listenTo(view, "close:hotspot:elements", (function(_this) {
          return function(contentObject) {
            console.log(JSON.stringify(contentObject));
            _this.layout.model.set('content', JSON.stringify(contentObject));
            if (_this.layout.model.hasChanged()) {
              console.log("saving them");
              localStorage.setItem('ele' + _this.layout.model.get('meta_id'), JSON.stringify(_this.layout.model.toJSON()));
              console.log(JSON.stringify(_this.layout.model.toJSON()));
            }
            return App.execute("close:question:elements");
          };
        })(this));
        this.listenTo(view, "close:hotspot:element:properties", function() {
          return App.execute("close:question:element:properties");
        });
        this.listenTo(view, "show", (function(_this) {
          return function() {
            return _this.eventObj.vent.trigger("question:dropped");
          };
        })(this));
        this.layout.elementRegion.show(view, {
          loading: true
        });
        return App.execute("show:question:elements", {
          model: this.layout.model
        });
      };

      Controller.prototype.deleteElement = function(model) {
        model.destroy();
        App.execute("close:question:elements");
        return this.eventObj.vent.trigger("question:removed");
      };

      return Controller;

    })(Element.Controller);
  });
});
