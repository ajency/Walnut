var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/left-nav/views'], function(App, RegionController) {
  return App.module("LeftNavApp.Controller", function(Controller, App) {
    Controller.LeftNavController = (function(superClass) {
      extend(LeftNavController, superClass);

      function LeftNavController() {
        return LeftNavController.__super__.constructor.apply(this, arguments);
      }

      LeftNavController.prototype.initialize = function() {
        var menuCollection, view;
        menuCollection = App.request("get:site:menus");
        this.view = view = this._getLeftNavView(menuCollection);
        return this.show(view, {
          loading: true
        });
      };

      LeftNavController.prototype._getLeftNavView = function(collection) {
        return new Controller.Views.LeftNavView({
          collection: collection
        });
      };

      return LeftNavController;

    })(RegionController);
    return App.commands.setHandler("show:leftnavapp", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.LeftNavController(opt);
    });
  });
});
