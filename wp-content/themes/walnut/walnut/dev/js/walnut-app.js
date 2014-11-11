define(['marionette'], function(Marionette) {
  window.App = new Marionette.Application;
  App.addRegions({
    leftNavRegion: '#left-nav-region',
    headerRegion: '#header-region',
    mainContentRegion: '#main-content-region',
    popupRegion: '#dialog-region',
    dialogRegion: Marionette.Region.Dialog.extend({
      el: '#dialog-region'
    }),
    loginRegion: '#login-region',
    breadcrumbRegion: '#breadcrumb-region'
  });
  App.rootRoute = "";
  App.loginRoute = "login";
  App.reqres.setHandler("default:region", function() {
    return App.mainContentRegion;
  });
  App.commands.setHandler("when:fetched", function(entities, callback) {
    var xhrs;
    xhrs = _.chain([entities]).flatten().pluck("_fetch").value();
    return $.when.apply($, xhrs).done(function() {
      return callback();
    });
  });
  App.commands.setHandler("register:instance", function(instance, id) {
    return App.register(instance, id);
  });
  App.commands.setHandler("unregister:instance", function(instance, id) {
    return App.unregister(instance, id);
  });
  App.on("initialize:after", function(options) {
    var onDeviceReady, xhr;
    App.startHistory();
    if (_.platform() === 'DEVICE') {
      onDeviceReady = (function(_this) {
        return function() {
          var authController;
          _.cordovaOpenPrepopulatedDatabase();
          _.cordovaLocalStorage();
          FastClick.attach(document.body);
          cordova.getAppVersion().then(function(version) {
            if (version.indexOf('Production') === 0) {
              AJAXURL = "http://synapselearning.net/wp-admin/admin-ajax.php";;
            }
            if (version.indexOf('Staging') === 0) {
              return AJAXURL = "http://synapsedu.info/wp-admin/admin-ajax.php";;
            }
          });
          if (_.isNull(_.getUserID()) || _.getUserID() === 'null') {
            _this.rootRoute = 'app-login';
            if (_.isNull(_.getUserID())) {
              _this.rootRoute = 'login';
            }
            return App.navigate(_this.rootRoute, {
              trigger: true
            });
          } else {
            authController = App.request("get:auth:controller");
            return authController.setUserModelForOfflineLogin();
          }
        };
      })(this);
      document.addEventListener("deviceready", onDeviceReady, false);
    } else {
      return xhr = $.get("" + AJAXURL + "?action=get-user-data", {}, (function(_this) {
        return function(resp) {
          var school, user;
          if (resp.success) {
            console.log(resp);
            user = App.request("get:user:model");
            user.set(resp.data.data);
            school = App.request("get:current:school");
            App.execute("show:headerapp", {
              region: App.headerRegion
            });
            App.execute("show:leftnavapp", {
              region: App.leftNavRegion
            });
            App.execute("show:breadcrumbapp", {
              region: App.breadcrumbRegion
            });
            if (_this.getCurrentRoute() === 'login') {
              App.vent.trigger("show:dashboard");
            }
            return App.loginRegion.close();
          } else {
            return App.vent.trigger("show:login");
          }
        };
      })(this), 'json');
    }
  });
  App.vent.on("show:dashboard", (function(_this) {
    return function(user_role) {
      var user, userSynced;
      user = App.request("get:user:model");
      user_role = user.get("roles");
      if (_.platform() === 'DEVICE') {
        userSynced = _.hasUserPreviouslySynced();
        userSynced.done(function(synced) {
          var lastSyncOperation;
          if (!synced) {
            return App.navigate('sync', {
              trigger: true
            });
          } else {
            lastSyncOperation = _.getLastSyncOperation();
            return lastSyncOperation.done(function(type_of_operation) {
              if (type_of_operation === 'none' || type_of_operation !== 'file_import') {
                return App.navigate('sync', {
                  trigger: true
                });
              } else {
                return App.navigate('students/dashboard', {
                  trigger: true
                });
              }
            });
          }
        });
      } else {
        if (user_role[0] === 'administrator') {
          App.navigate('textbooks', {
            trigger: true
          });
        } else {
          App.navigate('teachers/dashboard', {
            trigger: true
          });
        }
        if (user.current_user_can('administrator') || user.current_user_can('school-admin')) {
          App.navigate('textbooks', {
            trigger: true
          });
        }
        if (user.current_user_can('teacher')) {
          App.navigate('teachers/dashboard', {
            trigger: true
          });
        }
        if (user.current_user_can('student')) {
          App.navigate('students/dashboard', {
            trigger: true
          });
        }
      }
      App.execute("show:headerapp", {
        region: App.headerRegion
      });
      App.execute("show:leftnavapp", {
        region: App.leftNavRegion
      });
      if (typeof Pace === !'undefined') {
        return Pace.on('hide', function() {
          return $("#site_main_container").addClass("showAll");
        });
      }
    };
  })(this));
  App.vent.on("show:login", function() {
    App.leftNavRegion.close();
    App.headerRegion.close();
    App.mainContentRegion.close();
    this.rootRoute = 'login';
    return App.navigate(this.rootRoute, {
      trigger: true
    });
  });
  return App;
});
