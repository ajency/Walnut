var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-creator/content-builder/element/controller', 'text!apps/content-creator/content-builder/elements/table/templates/table.html', 'apps/content-creator/content-builder/elements/table/views'], function(App, Element, tableTemplate) {
  return App.module('ContentCreator.ContentBuilder.Element.Table', function(Table, App, Backbone, Marionette, $, _) {
    return Table.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.renderElement = __bind(this.renderElement, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        _.defaults(options.modelData, {
          element: 'Table',
          content: tableTemplate,
          row: 3,
          column: 3,
          style: 'style-1',
          bordered: false,
          striped: false
        });
        return Controller.__super__.initialize.call(this, options);
      };

      Controller.prototype.bindEvents = function() {
        return Controller.__super__.bindEvents.call(this);
      };

      Controller.prototype._getTableView = function() {
        return new Table.Views.TableView({
          model: this.layout.model
        });
      };

      Controller.prototype.renderElement = function() {
        this.removeSpinner();
        this.view = this._getTableView();
        this.listenTo(this.view, "save:table", (function(_this) {
          return function(tableHolder) {
            var html;
            html = $(tableHolder).clone();
            $(html).find('.rc-handle-container').remove();
            $(html).find('td div, th div').removeAllAttr();
            _this.layout.model.set('content', "" + ($(html).html()));
            if (_this.layout.model.hasChanged()) {
              return _this.layout.model.save();
            }
          };
        })(this));
        this.listenTo(this.view, "show show:table:property", (function(_this) {
          return function() {
            return App.execute("show:question:properties", {
              model: _this.layout.model
            });
          };
        })(this));
        return this.layout.elementRegion.show(this.view);
      };

      Controller.prototype.onClose = function() {
        return App.execute("close:question:properties");
      };

      return Controller;

    })(Element.Controller);
  });
});
