var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-board/element/controller', 'apps/content-board/elements/row/views'], function(App, Element) {
  return App.module('ContentPreview.ContentBoard.Element.Row', function(Row, App, Backbone, Marionette, $, _) {
    return Row.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.renderElement = __bind(this.renderElement, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        return Controller.__super__.initialize.call(this, options);
      };

      Controller.prototype._getRowView = function() {
        return new Row.Views.RowView({
          model: this.layout.model
        });
      };

      Controller.prototype.renderElement = function() {
        var view;
        view = this._getRowView();
        return this.layout.elementRegion.show(view);
      };

      return Controller;

    })(Element.Controller);
  });
});
