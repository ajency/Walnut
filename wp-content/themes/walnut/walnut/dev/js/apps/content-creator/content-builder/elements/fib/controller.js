var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-creator/content-builder/element/controller', 'apps/content-creator/content-builder/elements/fib/views'], function(App, Element) {
  return App.module("ContentCreator.ContentBuilder.Element.Fib", function(Fib, App, Backbone, Marionette, $, _) {
    return Fib.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.eventObj = options.eventObj;
        _.defaults(options.modelData, {
          element: 'Fib',
          maxlength: '12',
          font: 'Arial',
          color: '#000000',
          bg_color: '#c5ebd2',
          bg_opacity: '0.42',
          font_size: '12',
          case_sensitive: false,
          marks: 1,
          style: 'blank',
          text: "India has ",
          blanksArray: []
        });
        return Controller.__super__.initialize.call(this, options);
      };

      Controller.prototype.renderElement = function() {
        var view;
        this.blanksCollection = App.request("create:new:question:element:collection", this.layout.model.get('blanksArray'));
        this.layout.model.set('blanksArray', this.blanksCollection);
        view = this._getFibView(this.layout.model);
        this.listenTo(view, 'show show:this:fib:properties', (function(_this) {
          return function() {
            return App.execute("show:question:properties", {
              model: _this.layout.model
            });
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
        this.listenTo(view, "create:new:fib:element", (function(_this) {
          return function(blanksData) {
            var blanksModel;
            blanksModel = App.request("create:new:question:element", blanksData);
            return _this.layout.model.get('blanksArray').add(blanksModel);
          };
        })(this));
        return this.layout.elementRegion.show(view);
      };

      Controller.prototype._getFibView = function(model) {
        return new Fib.Views.FibView({
          model: model
        });
      };

      Controller.prototype.deleteElement = function(model) {
        model.set('blanksArray', '');
        delete model.get('blanksArray');
        model.destroy();
        App.execute("close:question:properties");
        return this.eventObj.vent.trigger("question:removed");
      };

      return Controller;

    })(Element.Controller);
  });
});
