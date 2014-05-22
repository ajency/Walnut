var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-pieces/list-content-pieces/list-content-pieces-controller'], function(App) {
  return App.module("ContentPiecesApp", function(ContentPiecesApp, App) {
    var ContentPiecesListRouter, Controller;
    ContentPiecesListRouter = (function(_super) {
      __extends(ContentPiecesListRouter, _super);

      function ContentPiecesListRouter() {
        return ContentPiecesListRouter.__super__.constructor.apply(this, arguments);
      }

      ContentPiecesListRouter.prototype.appRoutes = {
        'content-pieces': 'listContentPieces'
      };

      return ContentPiecesListRouter;

    })(Marionette.AppRouter);
    Controller = {
      listContentPieces: function() {
        return new ContentPiecesApp.ContentList.ListController({
          region: App.mainContentRegion
        });
      }
    };
    return ContentPiecesApp.on("start", function() {
      return new ContentPiecesListRouter({
        controller: Controller
      });
    });
  });
});
