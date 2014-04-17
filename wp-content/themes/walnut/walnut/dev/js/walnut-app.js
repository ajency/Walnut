define(['marionette'], function(Marionette) {
  window.App = new Marionette.Application;
  App.addRegions({
    leftNavRegion: '#left-nav-region',
    headerRegion: '#header-region',
    mainContentRegion: '#main-content-region',
    dialogRegion: '#dialog-region',
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
    var xhr;
    if (typeof Pace !== 'undefined') {
      Pace.on('hide', function() {
        return $("#site_main_container").addClass("showAll");
      });
    }
    App.startHistory();
    this.rootRoute = 'login';
    App.navigate(this.rootRoute, {
      trigger: true
    });
    return;
    return xhr = $.get("" + AJAXURL + "?action=get-user-data", {}, (function(_this) {
      return function(resp) {
        var school, user;
        if (resp.success) {
          console.log(resp);
          user = App.request("get:user:model");
          user.set(resp.data);
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
  });
  App.vent.on("show:dashboard", (function(_this) {
    return function(user_role) {
      var user;
      if (typeof Pace !== 'undefined') {
        Pace.restart();
        $("#site_main_container").removeClass("showAll");
      }
      user = App.request("get:user:model");
      user_role = user.get("roles");
      if (user_role[0] === 'administrator') {
        App.navigate('textbooks', {
          trigger: true
        });
      } else {
        App.navigate('teachers/dashboard', {
          trigger: true
        });
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
