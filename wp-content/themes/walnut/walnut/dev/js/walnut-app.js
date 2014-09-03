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
    var user;
    App.startHistory();
    if (_.platform() === 'DEVICE') {
      if (_.isNull(_.getUserID()) || _.getUserID() === 'null') {
        this.rootRoute = 'app-login';
        if (_.isNull(_.getBlogID())) {
          this.rootRoute = 'login';
        }
        App.navigate(this.rootRoute, {
          trigger: true
        });
      } else {
        user = App.request("get:user:model");
        user.set({
          'ID': '' + _.getUserID()
        });
        App.vent.trigger("show:dashboard");
        App.loginRegion.close();
      }
    } else {
      if ((typeof USER !== "undefined" && USER !== null) && USER.ID) {
        user = App.request("get:user:model");
        App.execute("show:headerapp", {
          region: App.headerRegion
        });
        App.execute("show:leftnavapp", {
          region: App.leftNavRegion
        });
        App.execute("show:breadcrumbapp", {
          region: App.breadcrumbRegion
        });
        if (this.getCurrentRoute() === 'login') {
          App.vent.trigger("show:dashboard");
        }
        return App.loginRegion.close();
      } else {
        return App.vent.trigger("show:login");
      }
    }
  });
  App.vent.on("show:dashboard", (function(_this) {
    return function(user_role) {
      var lastSyncOperation, user;
      if (_.platform() === 'DEVICE') {
        lastSyncOperation = _.getLastSyncOperation();
        lastSyncOperation.done(function(typeOfOperation) {
          if (typeOfOperation === 'none' || typeOfOperation !== 'file_import') {
            return App.navigate('sync', {
              trigger: true
            });
          } else {
            return App.navigate('teachers/dashboard', {
              trigger: true
            });
          }
        });
      } else {
        user = App.request("get:user:model");
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
      App.execute("show:breadcrumbapp", {
        region: App.breadcrumbRegion
      });
      App.execute("show:headerapp", {
        region: App.headerRegion
      });
      App.execute("show:leftnavapp", {
        region: App.leftNavRegion
      });
      if (typeof Pace !== 'undefined') {
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
    App.breadcrumbRegion.close();
    this.rootRoute = 'login';
    return App.navigate(this.rootRoute, {
      trigger: true
    });
  });
  return App;
});
