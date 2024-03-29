var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'apps/content-pieces/list-content-pieces/app'], function(App) {
  return App.module("ContentPiecesApp", function(ContentPiecesApp, App) {
    var ContentPiecesListRouter, Controller;
    ContentPiecesListRouter = (function(superClass) {
      extend(ContentPiecesListRouter, superClass);

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
        if ($.allowRoute('content-pieces')) {
          return new ContentPiecesApp.ContentList.ListController({
            region: App.mainContentRegion
          });
        }
      }
    };
    return ContentPiecesApp.on("start", function() {
      return new ContentPiecesListRouter({
        controller: Controller
      });
    });
  });
});
