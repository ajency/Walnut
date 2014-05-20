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
        this.show(view);
        return this.listenTo(this.view, {
          "user:logout": function() {
            return $.post(AJAXURL + '?action=logout_user', (function(_this) {
              return function(response) {
                var usermodel;
                if (response.error) {
                  return console.log(response);
                } else {
                  usermodel = App.request("get:user:model");
                  usermodel.clear();
                  return App.vent.trigger("show:login");
                }
              };
            })(this));
          }
        });
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
        'click #user_logout': function() {
          return this.trigger("user:logout");
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
