var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/login/app-login/templates/applogin.html'], function(App, RegionController, appLoginTpl) {
  return App.module("LoginApp.Controller", function(Controller, App) {
    var AppLoginView, LoginListView;
    Controller.AppController = (function(_super) {
      __extends(AppController, _super);

      function AppController() {
        return AppController.__super__.constructor.apply(this, arguments);
      }

      AppController.prototype.initialize = function() {
        var LoginCollection, view;
        LoginCollection = App.request("get:loggedin:user:collection");
        this.view = view = this._getLoginView(LoginCollection);
        this.show(view);
        this.listenTo(view, "goto:login:view", function(username) {
          return App.navigate("login/" + username, {
            trigger: true
          });
        });
        App.leftNavRegion.close();
        App.headerRegion.close();
        App.mainContentRegion.close();
        return App.breadcrumbRegion.close();
      };

      AppController.prototype._getLoginView = function(collection) {
        return new AppLoginView({
          collection: collection
        });
      };

      return AppController;

    })(RegionController);
    LoginListView = (function(_super) {
      __extends(LoginListView, _super);

      function LoginListView() {
        return LoginListView.__super__.constructor.apply(this, arguments);
      }

      LoginListView.prototype.template = '<div class="message-wrapper"> <h4 class="bold"> <a href="#">{{username}}</a></h4> </div> <div class="pull-right p-t-15"> <i class="fa fa-chevron-right"></i> </div>';

      LoginListView.prototype.className = 'notification-messages info';

      return LoginListView;

    })(Marionette.ItemView);
    return AppLoginView = (function(_super) {
      __extends(AppLoginView, _super);

      function AppLoginView() {
        return AppLoginView.__super__.constructor.apply(this, arguments);
      }

      AppLoginView.prototype.template = appLoginTpl;

      AppLoginView.prototype.className = 'row login-container';

      AppLoginView.prototype.itemView = LoginListView;

      AppLoginView.prototype.itemViewContainer = '#loginAccounts';

      AppLoginView.prototype.events = {
        'click #loginAccounts': 'gotoLogin',
        'click #addNewAccount': 'gotoNewLogin'
      };

      AppLoginView.prototype.gotoLogin = function(e) {
        var username;
        username = $(e.target).text();
        return this.trigger("goto:login:view", username);
      };

      AppLoginView.prototype.gotoNewLogin = function() {
        return App.navigate('login', {
          trigger: true
        });
      };

      AppLoginView.prototype.onShow = function() {
        _.setSchoolLogo();
        _.cordovaHideSplashscreen();
        return _.enableCordovaBackbuttonNavigation();
      };

      return AppLoginView;

    })(Marionette.CompositeView);
  });
});
