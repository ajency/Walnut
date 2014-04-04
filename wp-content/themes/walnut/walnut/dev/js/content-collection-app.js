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
    Pace.on('hide', function() {
      return $("#site_main_container").addClass("showAll");
    });
    App.startHistory();
    return xhr = $.get("" + AJAXURL + "?action=get-user-data", {}, (function(_this) {
      return function(resp) {
        var school, user;
        if (resp.success) {
          user = App.request("get:user:model");
          user.set(resp.data);
          school = App.request("get:current:school");
          console.log('show:content:collection');
          App.vent.trigger("show:content:collection");
          return App.loginRegion.close();
        } else {
          return App.vent.trigger("show:login");
        }
      };
    })(this), 'json');
  });
  App.vent.on("show:content:collection", function() {
    App.execute("show:create:collection", {
      region: App.mainContentRegion
    });
    App.execute("show:breadcrumbapp", {
      region: App.breadcrumbRegion
    });
    App.execute("show:headerapp", {
      region: App.headerRegion
    });
    App.execute("show:leftnavapp", {
      region: App.leftNavRegion
    });
    return Pace.on('hide', function() {
      return $("#site_main_container").addClass("showAll");
    });
  });
  App.vent.on("show:login", function() {
    return window.location = SITEURL + '#login';
  });
  return App;
});
