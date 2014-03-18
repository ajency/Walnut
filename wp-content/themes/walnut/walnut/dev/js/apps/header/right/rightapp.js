var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/header/right/templates/right.html'], function(App, RegionController, rightTpl) {
  return App.module("RightHeaderApp.Controller", function(Controller, App) {
    var RightHeaderView;
    Controller.RightHeaderController = (function(_super) {
      __extends(RightHeaderController, _super);

      function RightHeaderController() {
        return RightHeaderController.__super__.constructor.apply(this, arguments);
      }

      RightHeaderController.prototype.initialize = function() {
        var view;
        this.view = view = this._getRightHeaderView();
        return this.show(view);
      };

      RightHeaderController.prototype._getRightHeaderView = function() {
        return new RightHeaderView;
      };

      return RightHeaderController;

    })(RegionController);
    RightHeaderView = (function(_super) {
      __extends(RightHeaderView, _super);

      function RightHeaderView() {
        return RightHeaderView.__super__.constructor.apply(this, arguments);
      }

      RightHeaderView.prototype.template = rightTpl;

      RightHeaderView.prototype.className = 'pull-right';

      RightHeaderView.prototype.events = {
        'click #user-options': 'user_options_popup'
      };

      RightHeaderView.prototype.user_options_popup = function(e) {
        if ($(e.target).closest('li').hasClass('open')) {
          return $(e.target).closest('li').removeClass('open');
        } else {
          return $(e.target).closest('li').addClass('open');
        }
      };

      return RightHeaderView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:rightheaderapp", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.RightHeaderController(opt);
    });
  });
});
