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
    App.startHistory();
    return xhr = $.get("" + AJAXURL + "?action=get-user-data", {}, function(resp) {
      var user;
      if (resp.success) {
        user = App.request("get:user:model");
        user.set(resp.data);
        return App.vent.trigger("show:dashboard");
      } else {
        this.rootRoute = 'login';
        if (!this.getCurrentRoute()) {
          return App.navigate(this.rootRoute, {
            trigger: true
          });
        }
      }
    }, 'json');
  });
  App.vent.on("show:dashboard", function() {
    App.execute("show:headerapp", {
      region: App.headerRegion
    });
    App.execute("show:leftnavapp", {
      region: App.leftNavRegion
    });
    return App.navigate('textbooks', {
      trigger: true
    });
  });
  return App;
});
