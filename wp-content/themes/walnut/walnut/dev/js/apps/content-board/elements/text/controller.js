var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-board/element/controller', 'apps/content-board/elements/text/view'], function(App, Element) {
  return App.module('ContentPreview.ContentBoard.Element.Text', function(Text, App, Backbone, Marionette, $, _) {
    return Text.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.renderElement = __bind(this.renderElement, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        return Controller.__super__.initialize.call(this, options);
      };

      Controller.prototype._getTextView = function(model) {
        return new Text.Views.TextView({
          model: model
        });
      };

      Controller.prototype.renderElement = function() {
        var view;
        view = this._getTextView(this.layout.model);
        return this.layout.elementRegion.show(view);
      };

      return Controller;

    })(Element.Controller);
  });
});
