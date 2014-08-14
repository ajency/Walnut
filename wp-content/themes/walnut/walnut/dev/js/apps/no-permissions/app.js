var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("NoPermissions.Controller", function(Controller, App) {
    var NoPermissionsView;
    Controller.NoPermissionsController = (function(_super) {
      __extends(NoPermissionsController, _super);

      function NoPermissionsController() {
        return NoPermissionsController.__super__.constructor.apply(this, arguments);
      }

      NoPermissionsController.prototype.initialize = function() {
        var view;
        this.view = view = this._getNoPermissionsView();
        return this.show(view);
      };

      NoPermissionsController.prototype._getNoPermissionsView = function(items) {
        return new NoPermissionsView();
      };

      return NoPermissionsController;

    })(RegionController);
    NoPermissionsView = (function(_super) {
      __extends(NoPermissionsView, _super);

      function NoPermissionsView() {
        return NoPermissionsView.__super__.constructor.apply(this, arguments);
      }

      NoPermissionsView.prototype.template = '<div class="tiles white grid simple vertical green animated slideInRight"> <div class="grid-title no-border"> FORBIDDEN ACCESS </div> <div style="overflow: hidden; display: block;" class="grid-body no-border"> <div class="row "> <div class="col-md-4"> You do not have access to this section </div> </div> </div> </div>';

      return NoPermissionsView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:no:permissions:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.NoPermissionsController(opt);
    });
  });
});
