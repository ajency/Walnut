var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/header/left/leftapp', 'apps/header/right/rightapp'], function(App, RegionController) {
  return App.module("HeaderApp.Controller", function(Controller, App) {
    var HeaderView;
    Controller.HeaderController = (function(_super) {
      __extends(HeaderController, _super);

      function HeaderController() {
        return HeaderController.__super__.constructor.apply(this, arguments);
      }

      HeaderController.prototype.initialize = function() {
        var view;
        this.view = view = this._getHeaderView();
        return this.show(view);
      };

      HeaderController.prototype._getHeaderView = function() {
        return new HeaderView;
      };

      return HeaderController;

    })(RegionController);
    HeaderView = (function(_super) {
      __extends(HeaderView, _super);

      function HeaderView() {
        return HeaderView.__super__.constructor.apply(this, arguments);
      }

      HeaderView.prototype.template = 'login';

      HeaderView.prototype.className = 'error-body no-top  pace-done';

      return HeaderView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:headerapp", function(opt) {
      if (opt == null) {
        opt = {};
      }
      console.info("sasa", opt);
      return new Controller.HeaderController(opt);
    });
  });
});
