var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-preview/side-panel/controller'], function(App, RegionController) {
  return App.module("ContentPreview.SidePanel", function(SidePanel, App, Backbone, Marionette, $, _) {
    SidePanel.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.view = this._showView();
        return this.show(this.view);
      };

      Controller.prototype._showView = function() {
        return new SidePanel.Views.SidePanelView;
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler('show:side:panel', function(options) {
      return new SidePanel.Controller(options);
    });
  });
});
