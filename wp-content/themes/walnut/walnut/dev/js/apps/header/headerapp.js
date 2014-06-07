var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/header/left/leftapp', 'apps/header/right/rightapp', 'text!apps/header/templates/header.html'], function(App, RegionController, LeftApp, RightApp, headerTpl) {
  return App.module("HeaderApp.Controller", function(Controller, App) {
    var HeaderView;
    Controller.HeaderController = (function(_super) {
      __extends(HeaderController, _super);

      function HeaderController() {
        this._getHeaderView = __bind(this._getHeaderView, this);
        this._showLeftRightViews = __bind(this._showLeftRightViews, this);
        return HeaderController.__super__.constructor.apply(this, arguments);
      }

      HeaderController.prototype.initialize = function() {
        var layout;
        this.layout = layout = this._getHeaderView();
        this.school = App.request("get:current:school");
        this.listenTo(layout, 'show', this._showLeftRightViews);
        this.show(layout, {
          loading: true
        });
        this.listenTo(this.layout.rightRegion, "user:logout", this._logoutCurrentUser);
        return this.listenTo(layout, 'user:logout', this._logoutCurrentUser);
      };

      HeaderController.prototype._logoutCurrentUser = function() {
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
        console.log('@school2');
        console.log(this.school);
        return new HeaderView({
          model: this.school
        });
      };

      return HeaderController;

    })(RegionController);
    HeaderView = (function(_super) {
      __extends(HeaderView, _super);

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
        'click #logout': 'onLogout'
      };

      HeaderView.prototype.serializeData = function() {
        var data;
        data = HeaderView.__super__.serializeData.call(this);
        data.logourl = SITEURL + '/wp-content/themes/walnut/images/walnutlearn.png';
        if (_.platform() === 'DEVICE') {
          data.logourl = SITEURL + '/images/logo-synapse.png';
        }
        console.log(SITEURL);
        return data;
      };

      HeaderView.prototype.onShow = function() {
        if ($(window).width() < 1025) {
          $('#walnutProfile').mmenu({
            position: 'right'
          });
        }
        if ($('.creator').length > 0) {
          $('.page-content').addClass('condensed');
          $(".header-seperation").css("display", "none");
        }
        if (_.platform() === 'DEVICE') {
          return this.$el.find('#app_username').text('Hi ' + _.getUserName() + ',');
        }
      };

      HeaderView.prototype.onLogout = function() {
        var user;
        if (_.platform() === 'BROWSER') {
          return this.trigger("user:logout");
        } else {
          console.log('Synapse App Logout');
          _.setUserID(null);
          user = App.request("get:user:model");
          user.clear();
          App.leftNavRegion.close();
          App.headerRegion.close();
          App.mainContentRegion.close();
          App.breadcrumbRegion.close();
          return App.navigate('app-login', {
            trigger: true
          });
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
