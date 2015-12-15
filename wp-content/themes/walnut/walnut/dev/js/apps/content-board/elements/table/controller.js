var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'apps/content-board/element/controller', 'apps/content-board/elements/table/views'], function(App, Element) {
  return App.module('ContentPreview.ContentBoard.Element.Table', function(Table, App) {
    return Table.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        this.renderElement = bind(this.renderElement, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        return Controller.__super__.initialize.call(this, options);
      };

      Controller.prototype._getTableView = function() {
        return new Table.Views.TableView({
          model: this.layout.model
        });
      };

      Controller.prototype.renderElement = function() {
        this.view = this._getTableView();
        return this.layout.elementRegion.show(this.view);
      };

      return Controller;

    })(Element.Controller);
  });
});
