var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("BreadcrumbApp.Controller", function(Controller, App) {
    var BreadcrumbView;
    Controller.BreadcrumbController = (function(_super) {
      __extends(BreadcrumbController, _super);

      function BreadcrumbController() {
        return BreadcrumbController.__super__.constructor.apply(this, arguments);
      }

      BreadcrumbController.prototype.initialize = function() {
        var view;
        this.view = view = this._getBreadcrumbView;
        return this.show(view);
      };

      BreadcrumbController.prototype._getBreadcrumbView = function() {
        return new BreadcrumbView;
      };

      return BreadcrumbController;

    })(RegionController);
    BreadcrumbView = (function(_super) {
      __extends(BreadcrumbView, _super);

      function BreadcrumbView() {
        return BreadcrumbView.__super__.constructor.apply(this, arguments);
      }

      BreadcrumbView.prototype.template = '<a href="#">Dashboard</a>';

      BreadcrumbView.prototype.className = '';

      return BreadcrumbView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:breadcrumbapp", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.BreadcrumbController(opt);
    });
  });
});
