var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-creator/content-builder/element/controller', 'apps/content-creator/content-builder/elements/mcq/views'], function(App, Element) {
  return App.module("ContentCreator.ContentBuilder.Element.Mcq", function(Mcq, App, Backbone, Marionette, $, _) {
    return Mcq.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.renderElement = __bind(this.renderElement, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        _.defaults(options.modelData, {
          element: 'Mcq',
          optioncount: 2,
          elements: App.request("create:new:mcq:option:collection", [
            {
              optionNo: 1
            }, {
              optionNo: 2
            }
          ]),
          marks: 1,
          individual_marks: false,
          multiple: false
        });
        return Controller.__super__.initialize.call(this, options);
      };

      Controller.prototype.renderElement = function() {
        var optionCollection, optionsObj, view;
        optionsObj = this.layout.model.get('elements');
        if (optionsObj instanceof Backbone.Collection) {
          optionCollection = optionsObj;
        } else {
          optionCollection = App.request("create:new:mcq:option:collection", optionsObj);
          this.layout.model.set('elements', optionCollection);
        }
        view = this._getMcqView(optionCollection);
        this.listenTo(view, "show show:this:mcq:properties", (function(_this) {
          return function(options) {
            return App.execute("show:question:properties", {
              model: _this.layout.model
            });
          };
        })(this));
        return this.layout.elementRegion.show(view);
      };

      Controller.prototype.bindEvents = function() {
        return Controller.__super__.bindEvents.call(this);
      };

      Controller.prototype._getMcqView = function(optionCollection) {
        return new Mcq.Views.McqView({
          collection: optionCollection,
          mcq_model: this.layout.model
        });
      };

      Controller.prototype.deleteElement = function(model) {
        model.set('elements', '');
        delete model.get('elements');
        model.destroy();
        return App.execute("close:question:properties");
      };

      return Controller;

    })(Element.Controller);
  });
});
