var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("DashboardClassProgressApp.Controller", function(Controller, App) {
    var ClassProgressView;
    Controller.DashboardClassProgressController = (function(_super) {
      __extends(DashboardClassProgressController, _super);

      function DashboardClassProgressController() {
        return DashboardClassProgressController.__super__.constructor.apply(this, arguments);
      }

      DashboardClassProgressController.prototype.initialize = function(opts) {
        var view;
        this.view = view = this._getClassProgressView();
        return this.show(view, {
          loading: true
        });
      };

      DashboardClassProgressController.prototype._getClassProgressView = function() {
        return new ClassProgressView();
      };

      return DashboardClassProgressController;

    })(RegionController);
    ClassProgressView = (function(_super) {
      __extends(ClassProgressView, _super);

      function ClassProgressView() {
        return ClassProgressView.__super__.constructor.apply(this, arguments);
      }

      ClassProgressView.prototype.template = '<h1 class="text-center muted m-b-20">Coming <span class="bold">Soon</span>...</h1>';

      ClassProgressView.prototype.className = 'animated fadeInUp';

      return ClassProgressView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:dashboard:class:progress:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.DashboardClassProgressController(opt);
    });
  });
});
