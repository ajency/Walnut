define(['marionette'], function(Marionette) {
  window.App = new Marionette.Application;
  App.addRegions({
    leftNavRegion: '#left-nav-region',
    headerRegion: '#header-region',
    mainContentRegion: '#main-content-region',
    dialogRegion: '#dialog-region',
    loginRegion: '#login-region'
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
    Pace.on('hide', function() {
      return $("#site_main_container").addClass("showAll");
    });
    App.startHistory();
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
  App.vent.on("show:dashboard", function() {
    App.navigate('textbooks', {
      trigger: true
    });
    App.execute("show:headerapp", {
      region: App.headerRegion
    });
    return App.execute("show:leftnavapp", {
      region: App.leftNavRegion
    });
  });
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
