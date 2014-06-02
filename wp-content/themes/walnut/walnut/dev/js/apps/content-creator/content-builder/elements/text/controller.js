var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-creator/content-builder/element/controller', 'apps/content-creator/content-builder/elements/text/views', 'apps/content-creator/content-builder/elements/text/settings/controller'], function(App, Element) {
  return App.module('ContentCreator.ContentBuilder.Element.Text', function(Text, App, Backbone, Marionette, $, _) {
    return Text.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.renderElement = __bind(this.renderElement, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        _.defaults(options.modelData, {
          element: 'Text',
          content: ''
        });
        return Controller.__super__.initialize.call(this, options);
      };

      Controller.prototype.bindEvents = function() {
        return Controller.__super__.bindEvents.call(this);
      };

      Controller.prototype._getTextView = function(model) {
        return new Text.Views.TextView({
          model: model
        });
      };

      Controller.prototype.renderElement = function() {
        var view;
        this.removeSpinner();
        view = this._getTextView(this.layout.model);
        this.listenTo(view, "text:element:blur", (function(_this) {
          return function(html) {
            _this.layout.model.set('content', "" + html);
            if (_this.layout.model.hasChanged()) {
              console.log(_this.layout.model);
              _this.layout.model.save();
              console.log("saving them");
              return localStorage.setItem('ele' + _this.layout.model.get('meta_id'), JSON.stringify(_this.layout.model.toJSON()));
            }
          };
        })(this));
        return this.layout.elementRegion.show(view);
      };

      return Controller;

    })(Element.Controller);
  });
});
