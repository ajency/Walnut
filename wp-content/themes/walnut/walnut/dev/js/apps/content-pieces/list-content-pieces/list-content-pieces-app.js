var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-pieces/list-content-pieces/list-content-pieces-controller'], function(App) {
  return App.module("ContentPiecesListApp", function(TextbooksApp, App) {
    var ContentPiecesListRouter, Controller;
    ContentPiecesListRouter = (function(_super) {
      __extends(ContentPiecesListRouter, _super);

      function ContentPiecesListRouter() {
        return ContentPiecesListRouter.__super__.constructor.apply(this, arguments);
      }

      ContentPiecesListRouter.prototype.appRoutes = {
        'content-pieces': 'listContentPieces',
        'textbook/:term_id': 'showSingleTextbook'
      };

      return ContentPiecesListRouter;

    })(Marionette.AppRouter);
    Controller = {
      listContentPieces: function() {
        return new TextbooksApp.List.ListController({
          region: App.mainContentRegion
        });
      }
    };
    return ContentPiecesListApp.on("start", function() {
      return new ContentPiecesListRouter({
        controller: Controller
      });
    });
  });
});
