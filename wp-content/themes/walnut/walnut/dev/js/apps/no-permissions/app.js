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

      NoPermissionsController.prototype.initialize = function(opts) {
        var is404, view;
        this.error_msg = opts.error_msg, this.error_header = opts.error_header, is404 = opts.is404;
        this.view = view = this._getNoPermissionsView();
        this.show(view);
        if (is404) {
          this.error_msg = '404';
          this.error_header = "Page not found";
        }
        this.view = view = this._getNoPermissionsView();
        return this.show(view);
      };

      NoPermissionsController.prototype._getNoPermissionsView = function() {
        return new NoPermissionsView({
          error_header: this.error_header,
          error_msg: this.error_msg
        });
      };

      return NoPermissionsController;

    })(RegionController);
    NoPermissionsView = (function(_super) {
      __extends(NoPermissionsView, _super);

      function NoPermissionsView() {
        return NoPermissionsView.__super__.constructor.apply(this, arguments);
      }

      NoPermissionsView.prototype.template = '<div class="tiles white grid simple vertical green animated slideInRight"> <div class="grid-title no-border"> {{error_header}} </div> <div style="overflow: hidden; display: block;" class="grid-body no-border"> <div class="row "> <div class="col-md-8"> {{error_msg}} </div> </div> </div> </div>';

      NoPermissionsView.prototype.mixinTemplateHelpers = function(data) {
        var error_header, error_msg;
        error_msg = Marionette.getOption(this, 'error_msg');
        error_header = Marionette.getOption(this, 'error_header');
        data.error_header = error_header ? error_header : 'Forbidden Access';
        data.error_msg = error_msg ? error_msg : 'You do not have access to this section';
        return data;
      };

      return NoPermissionsView;

    })(Marionette.ItemView);
    App.commands.setHandler("show:no:permissions:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.NoPermissionsController(opt);
    });
    return App.commands.setHandler("show:404:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      opt.is404 = true;
      return new Controller.NoPermissionsController(opt);
    });
  });
});
