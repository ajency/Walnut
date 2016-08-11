var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/header/left/leftapp', 'apps/header/right/rightapp', 'text!apps/header/templates/header.html'], function(App, RegionController, LeftApp, RightApp, headerTpl) {
  return App.module("HeaderApp.Controller", function(Controller, App) {
    var HeaderView;
    Controller.HeaderController = (function(superClass) {
      extend(HeaderController, superClass);

      function HeaderController() {
        this._getHeaderView = bind(this._getHeaderView, this);
        this._showLeftRightViews = bind(this._showLeftRightViews, this);
        return HeaderController.__super__.constructor.apply(this, arguments);
      }

      HeaderController.prototype.initialize = function() {
        var layout;
        this.layout = layout = this._getHeaderView();
        this.listenTo(layout, 'show', this._showLeftRightViews);
        this.show(layout);
        this.listenTo(this.layout.rightRegion, "user:logout", this._logoutCurrentUser);
        return this.listenTo(layout, 'user:logout', this._logoutCurrentUser);
      };

      HeaderController.prototype._logoutCurrentUser = function() {
        return $.post(AJAXURL + '?action=logout_user', (function(_this) {
          return function(response) {
            var redirect_url, usermodel;
            if (response.error) {
              return console.log('response');
            } else {
              redirect_url = window.location.hostname;
              usermodel = App.request("get:user:model");
              usermodel.clear();
              return location.href = redirect_url + "/#login";
            }
          };
        })(this));
      };

      HeaderController.prototype._showLeftRightViews = function() {
        App.execute("show:leftheaderapp", {
          region: this.layout.leftRegion
        });
        return App.execute("show:rightheaderapp", {
          region: this.layout.rightRegion
        });
      };

      HeaderController.prototype._getHeaderView = function() {
        return new HeaderView({
          templateHelpers: {
            show_user_name: function() {
              var user_model, user_name;
              user_model = App.request("get:user:model");
              return user_name = user_model.get('display_name');
            }
          }
        });
      };

      return HeaderController;

    })(RegionController);
    HeaderView = (function(superClass) {
      extend(HeaderView, superClass);

      function HeaderView() {
        return HeaderView.__super__.constructor.apply(this, arguments);
      }

      HeaderView.prototype.template = headerTpl;

      HeaderView.prototype.className = 'header navbar navbar-inverse';

      HeaderView.prototype.regions = {
        leftRegion: '#header-left',
        rightRegion: '#header-right'
      };

      HeaderView.prototype.events = {
        'click #logout': function() {
          $.sidr('close', 'walnutProfile');
          return this.trigger("user:logout");
        }
      };

      HeaderView.prototype.serializeData = function() {
        var data;
        data = HeaderView.__super__.serializeData.call(this);
        data.logourl = SITEURL + '/wp-content/themes/walnut/images/synapse_logo.png';
        return data;
      };

      HeaderView.prototype.onShow = function() {
        if ($(window).width() > 1024) {
          $("#gears-mob").remove();
        }
        if ($(window).width() < 1025) {
          $("#gears-pc").remove();
        }
        if ($('.creator').length > 0) {
          $('.page-content').addClass('condensed');
          return $(".header-seperation").css("display", "none");
        }
      };

      return HeaderView;

    })(Marionette.Layout);
    return App.commands.setHandler("show:headerapp", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.HeaderController(opt);
    });
  });
});
