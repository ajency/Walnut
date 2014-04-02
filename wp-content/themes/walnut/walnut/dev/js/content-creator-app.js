define(['marionette'], function(Marionette) {
  window.App = new Marionette.Application;
  App.addRegions({
    leftNavRegion: '#left-nav-region',
    headerRegion: '#header-region',
    mainContentRegion: '#main-content-region',
    dialogRegion: Marionette.Region.Dialog.extend({
      el: '#dialog-region'
    }),
    settingsRegion: Marionette.Region.Settings.extend({
      el: '#settings-region'
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
    Pace.on('hide', function() {
      return $("#site_main_container").addClass("showAll");
    });
    App.startHistory();
    if (!this.getCurrentRoute()) {
      return App.navigate(this.rootRoute, {
        trigger: true
      });
    }
  });
  App.on('start', function() {
    App.execute("show:content:creator", {
      region: App.mainContentRegion
    });
    App.execute("show:headerapp", {
      region: App.headerRegion
    });
    App.execute("show:leftnavapp", {
      region: App.leftNavRegion
    });
    return App.execute("show:breadcrumbapp", {
      region: App.breadcrumbRegion
    });
  });
  return App;
});
