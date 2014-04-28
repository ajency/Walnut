var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-preview/view', 'apps/content-preview/content-board/controller'], function(App, RegionController) {
  return App.module("ContentPreview", function(ContentPreview, App, Backbone, Marionette, $, _) {
    ContentPreview.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        var breadcrumb_items;
        breadcrumb_items = {
          'items': [
            {
              'label': 'Dashboard',
              'link': 'javascript://'
            }, {
              'label': 'Content Management',
              'link': 'javascript:;'
            }, {
              'label': 'Content Preview',
              'link': 'javascript:;',
              'active': 'active'
            }
          ]
        };
        App.execute("update:breadcrumb:model", breadcrumb_items);
        this.layout = this._getContentPreviewLayout();
        this.listenTo(this.layout, 'show', (function(_this) {
          return function() {
            App.execute("show:content:board", {
              region: _this.layout.contentBoardRegion
            });
            return App.execute("show:side:panel", {
              region: _this.layout.sidePanelRegion
            });
          };
        })(this));
        return this.show(this.layout);
      };

      Controller.prototype._getContentPreviewLayout = function() {
        return new ContentPreview.Views.Layout;
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:content:preview", function(options) {
      return new ContentPreview.Controller({
        region: options.region
      });
    });
  });
});
