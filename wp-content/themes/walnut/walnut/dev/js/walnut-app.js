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
  App.on("initialize:before", function() {
    return Pace.start();
  });
  App.on("initialize:after", function(options) {
    var xhr;
    Pace.stop();
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
            return App.vent.trigger("show:dashboard");
          }
        } else {
          console.log('error');
          _this.rootRoute = 'login';
          return App.navigate(_this.rootRoute, {
            trigger: true
          });
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
  return App;
});
