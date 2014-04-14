var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-group/edit-group/group-edit-controller', 'apps/content-group/view-group/group-view-controller', 'apps/content-group/groups-listing/group-listing-controller'], function(App) {
  return App.module("ContentGroupApp", function(ContentGroupApp, App) {
    var ContentGroupRouter, Controller;
    ContentGroupRouter = (function(_super) {
      __extends(ContentGroupRouter, _super);

      function ContentGroupRouter() {
        return ContentGroupRouter.__super__.constructor.apply(this, arguments);
      }

      ContentGroupRouter.prototype.appRoutes = {
        'edit-group': 'editGroup',
        'view-group/:id': 'viewGroup',
        'list-groups': 'groupsListing'
      };

      return ContentGroupRouter;

    })(Marionette.AppRouter);
    Controller = {
      editGroup: function() {
        return new ContentGroupApp.Edit.GroupController({
          region: App.mainContentRegion
        });
      },
      viewGroup: function(id) {
        return new ContentGroupApp.View.GroupController({
          region: App.mainContentRegion,
          modelID: id
        });
      },
      groupsListing: function() {
        return new ContentGroupApp.ListingView.GroupController({
          region: App.mainContentRegion
        });
      }
    };
    return ContentGroupApp.on("start", function() {
      return new ContentGroupRouter({
        controller: Controller
      });
    });
  });
});
