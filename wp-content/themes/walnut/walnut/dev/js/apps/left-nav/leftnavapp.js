var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/left-nav/templates/leftnav.html'], function(App, RegionController, leftNavTpl) {
  return App.module("LeftNavApp.Controller", function(Controller, App) {
    var LeftNavView;
    Controller.LeftNavController = (function(_super) {
      __extends(LeftNavController, _super);

      function LeftNavController() {
        return LeftNavController.__super__.constructor.apply(this, arguments);
      }

      LeftNavController.prototype.initialize = function() {
        var view;
        this.view = view = this._getLeftNavView();
        return this.show(view);
      };

      LeftNavController.prototype._getLeftNavView = function() {
        return new LeftNavView;
      };

      return LeftNavController;

    })(RegionController);
    LeftNavView = (function(_super) {
      __extends(LeftNavView, _super);

      function LeftNavView() {
        return LeftNavView.__super__.constructor.apply(this, arguments);
      }

      LeftNavView.prototype.template = leftNavTpl;

      LeftNavView.prototype.id = 'main-menu';

      LeftNavView.prototype.className = 'page-sidebar';

      return LeftNavView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:leftnavapp", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.LeftNavController(opt);
    });
  });
});
