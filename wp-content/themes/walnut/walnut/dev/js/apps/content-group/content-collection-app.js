var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-collection/edit-collection-controller'], function(App) {
  return App.module("ContentCollectionApp", function(ContentCollectionApp, App) {
    var ContentCollectionRouter, Controller;
    ContentCollectionRouter = (function(_super) {
      __extends(ContentCollectionRouter, _super);

      function ContentCollectionRouter() {
        return ContentCollectionRouter.__super__.constructor.apply(this, arguments);
      }

      ContentCollectionRouter.prototype.appRoutes = {
        'edit-collection': 'editCollection',
        'textbook/:term_id': 'showSingleTextbook'
      };

      return ContentCollectionRouter;

    })(Marionette.AppRouter);
    Controller = {
      editCollection: function() {
        return new ContentCollectionApp.List.ListController({
          region: App.mainContentRegion
        });
      }
    };
    return ContentCollectionApp.on("start", function() {
      return new ContentCollectionRouter({
        controller: Controller
      });
    });
  });
});
